package com.academicrisks.servlet;

import com.academicrisks.dao.ActivityLogDAO;
import com.academicrisks.dao.StudentDAO;
import com.academicrisks.dao.AcademicProfileDAO;
import com.academicrisks.dao.UserDAO;
import com.academicrisks.model.Student;
import com.academicrisks.model.User;
import com.academicrisks.util.JsonUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(urlPatterns = {"/api/students", "/api/students/*"})
public class StudentsServlet extends HttpServlet {

    private StudentDAO studentDAO = new StudentDAO();
    private ActivityLogDAO activityLogDAO = new ActivityLogDAO();
    private AcademicProfileDAO academicProfileDAO = new AcademicProfileDAO();

    private String getUserName(HttpServletRequest request) {
        String name = (String) request.getAttribute("username");
        return name != null ? name : "System";
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            // GET /api/students - list all
            handleGetAll(request, response);
        } else {
            // Check if this is meant for stats servlet (shouldn't reach here due to web.xml mapping)
            // ID is provided
            String idStr = pathInfo.substring(1); // remove leading /
            if (idStr.startsWith("roll/")) {
                String rollNo = idStr.substring(5);
                System.out.println("DEBUG: Hit rollNo endpoint with rollNo = " + rollNo);
                handleGetByRollNo(rollNo, response);
                return;
            }
            System.out.println("DEBUG: Falling back to getById with idStr = " + idStr);
            handleGetById(idStr, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.equals("/bulk")) {
            handleBulkCreate(request, response);
        } else if (pathInfo != null && pathInfo.matches("^/\\d+/marks$")) {
            handleAddMarks(request, response);
        } else {
            handleCreate(request, response);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Student ID required for update");
            return;
        }

        String idStr = pathInfo.substring(1);
        try {
            int id = Integer.parseInt(idStr);
            String body = JsonUtil.readRequestBody(request);
            JsonObject json = JsonUtil.getGson().fromJson(body, JsonObject.class);
            
            Student student = jsonToStudent(json);
            student.setId(id); // Ensure the ID from the URL is set
            
            boolean updated = studentDAO.update(student);
            
            if (updated) {
                Student updatedStudent = studentDAO.findById(id);
                JsonUtil.sendJson(response, studentToFrontendJson(updatedStudent));
                activityLogDAO.log("update", "Updated student record: " + updatedStudent.getName() + " (" + updatedStudent.getRollNo() + ")", getUserName(request));
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Student not found or no changes made");
            }
        } catch (NumberFormatException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid student ID");
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid request: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Student ID required");
            return;
        }

        String idStr = pathInfo.substring(1);
        try {
            int id = Integer.parseInt(idStr);
            boolean deleted = studentDAO.delete(id);
            if (deleted) {
                JsonObject result = new JsonObject();
                result.addProperty("msg", "Student deleted");
                JsonUtil.sendJson(response, result);
                activityLogDAO.log("alert", "Deleted student record (ID: " + id + ")", getUserName(request));
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Student not found");
            }
        } catch (NumberFormatException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid student ID");
        }
    }

    private void handleGetAll(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String role = (String) request.getAttribute("userRole");
        Integer userId = (Integer) request.getAttribute("userId");
        
        List<Student> students;
        if ("faculty".equals(role) && userId != null) {
            UserDAO userDAO = new UserDAO();
            User user = userDAO.findById(userId);
            if (user != null && user.getDepartment() != null && !user.getDepartment().isEmpty()) {
                students = studentDAO.findAllByDepartment(user.getDepartment());
            } else {
                students = studentDAO.findAll();
            }
        } else {
            students = studentDAO.findAll();
        }

        // Transform to match frontend expectations with _id and nested academics
        JsonArray result = new JsonArray();
        for (Student s : students) {
            result.add(studentToFrontendJson(s));
        }
        JsonUtil.sendJson(response, result);
    }

    private void handleGetById(String idStr, HttpServletResponse response) throws IOException {
        try {
            int id = Integer.parseInt(idStr);
            Student student = studentDAO.findById(id);
            if (student != null) {
                JsonUtil.sendJson(response, studentToFrontendJson(student));
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Student not found");
            }
        } catch (NumberFormatException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid student ID");
        }
    }

    private void handleGetByRollNo(String rollNo, HttpServletResponse response) throws IOException {
        System.out.println("DEBUG: Calling studentDAO.findByRollNo(" + rollNo + ")");
        Student student = studentDAO.findByRollNo(rollNo);
        if (student != null) {
            System.out.println("DEBUG: Student found! Returning " + student.getName());
            JsonUtil.sendJson(response, studentToFrontendJson(student));
        } else {
            JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Student not found with roll no: " + rollNo);
        }
    }

    private void handleCreate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String body = JsonUtil.readRequestBody(request);
            JsonObject json = null;
            try {
                json = JsonUtil.getGson().fromJson(body, JsonObject.class);
            } catch (Exception ex) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid JSON format");
                return;
            }
            if (json == null) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Empty request body");
                return;
            }
            Student student = jsonToStudent(json);

            Student created = studentDAO.create(student);
            if (created != null) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                JsonUtil.sendJson(response, studentToFrontendJson(created));
                activityLogDAO.log("update", "Added new student: " + created.getName() + " (" + created.getRollNo() + ")", getUserName(request));
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to create student");
            }
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid request: " + e.getMessage());
        }
    }

    private void handleBulkCreate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String body = JsonUtil.readRequestBody(request);
            JsonArray jsonArray = JsonUtil.getGson().fromJson(body, JsonArray.class);

            List<Student> students = new ArrayList<>();
            for (JsonElement elem : jsonArray) {
                students.add(jsonToStudent(elem.getAsJsonObject()));
            }

            List<Student> created = studentDAO.createBulk(students);
            response.setStatus(HttpServletResponse.SC_CREATED);

            JsonArray result = new JsonArray();
            for (Student s : created) {
                result.add(studentToFrontendJson(s));
            }
            JsonUtil.sendJson(response, result);
            activityLogDAO.log("update", "Bulk uploaded " + created.size() + " student records", getUserName(request));
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid bulk upload data: " + e.getMessage());
        }
    }

    private void handleAddMarks(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        String idStr = pathInfo.split("/")[1];
        try {
            int studentId = Integer.parseInt(idStr);
            String body = JsonUtil.readRequestBody(request);
            JsonObject json = JsonUtil.getGson().fromJson(body, JsonObject.class);
            
            boolean success = academicProfileDAO.addInternalMarks(studentId, json);
            if (success) {
                Student student = studentDAO.findById(studentId);
                activityLogDAO.log("update", "Added internal marks for: " + (student != null ? student.getName() : "ID " + studentId), getUserName(request));
                JsonObject result = new JsonObject();
                result.addProperty("msg", "Marks added successfully");
                JsonUtil.sendJson(response, result);
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to add marks");
            }
        } catch (NumberFormatException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid student ID");
        } catch (Exception e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid request: " + e.getMessage());
        }
    }

    /**
     * Convert Student model to JSON matching frontend expectations:
     * - _id instead of id
     * - nested academics object with gpa and attendance
     * - cgpa alias for student profile page
     */
    private JsonObject studentToFrontendJson(Student s) {
        JsonObject obj = new JsonObject();
        obj.addProperty("_id", String.valueOf(s.getId()));
        obj.addProperty("name", s.getName());
        obj.addProperty("rollNo", s.getRollNo());
        obj.addProperty("department", s.getDepartment());
        obj.addProperty("riskStatus", s.getRiskStatus());
        obj.addProperty("semester", s.getSemester());
        obj.addProperty("email", s.getEmail());
        obj.addProperty("phone", s.getPhone());
        obj.addProperty("year", s.getYear());
        obj.addProperty("address", s.getAddress());

        // Nested academics object for faculty and admin pages
        JsonObject academics = new JsonObject();
        academics.addProperty("gpa", s.getCgpa());
        academics.addProperty("cgpa", s.getCgpa()); // alias for student profile page
        academics.addProperty("attendance", s.getAttendance());
        academics.addProperty("backlogs", s.getArrearCount());
        obj.add("academics", academics);

        // Also expose flat fields for admin dashboard compatibility
        obj.addProperty("cgpa", s.getCgpa());
        obj.addProperty("attendance", s.getAttendance());

        // Inject deep academic profile for detailed dashboard views
        JsonObject deepProfile = academicProfileDAO.getFullStudentProfile(s.getId());
        for (String key : deepProfile.keySet()) {
            obj.add(key, deepProfile.get(key));
        }

        return obj;
    }

    /**
     * Parse incoming JSON (from AddStudentModal or bulk upload) to Student model.
     * Handles both camelCase and various field name formats.
     */
    private Student jsonToStudent(JsonObject json) {
        Student s = new Student();
        if (json.has("name")) s.setName(json.get("name").getAsString());
        if (json.has("Name")) s.setName(json.get("Name").getAsString());

        if (json.has("rollNo")) s.setRollNo(json.get("rollNo").getAsString());
        if (json.has("Roll No")) s.setRollNo(json.get("Roll No").getAsString());

        if (json.has("department")) s.setDepartment(json.get("department").getAsString());
        if (json.has("branch")) s.setDepartment(json.get("branch").getAsString());
        if (json.has("Department")) s.setDepartment(json.get("Department").getAsString());

        if (json.has("riskStatus")) s.setRiskStatus(json.get("riskStatus").getAsString());

        if (json.has("semester") && !json.get("semester").getAsString().isEmpty()) s.setSemester(json.get("semester").getAsInt());

        if (json.has("gpa") && !json.get("gpa").getAsString().isEmpty()) s.setCgpa(json.get("gpa").getAsDouble());
        if (json.has("GPA") && !json.get("GPA").getAsString().isEmpty()) s.setCgpa(json.get("GPA").getAsDouble());
        if (json.has("cgpa") && !json.get("cgpa").getAsString().isEmpty()) s.setCgpa(json.get("cgpa").getAsDouble());

        if (json.has("attendance") && !json.get("attendance").getAsString().isEmpty()) s.setAttendance(json.get("attendance").getAsDouble());
        if (json.has("Attendance") && !json.get("Attendance").getAsString().isEmpty()) s.setAttendance(json.get("Attendance").getAsDouble());

        if (json.has("email") && !json.get("email").getAsString().isEmpty()) s.setEmail(json.get("email").getAsString());
        if (json.has("Email") && !json.get("Email").getAsString().isEmpty()) s.setEmail(json.get("Email").getAsString());

        if (json.has("phone") && !json.get("phone").getAsString().isEmpty()) s.setPhone(json.get("phone").getAsString());

        if (json.has("year") && !json.get("year").getAsString().isEmpty()) s.setYear(json.get("year").getAsInt());
        if (json.has("Year") && !json.get("Year").getAsString().isEmpty()) s.setYear(json.get("Year").getAsInt());

        if (json.has("address") && !json.get("address").getAsString().isEmpty()) s.setAddress(json.get("address").getAsString());

        if (json.has("backlogs") && !json.get("backlogs").getAsString().isEmpty()) s.setArrearCount(json.get("backlogs").getAsInt());

        return s;
    }
}
