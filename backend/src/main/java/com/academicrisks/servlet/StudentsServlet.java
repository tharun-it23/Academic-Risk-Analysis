package com.academicrisks.servlet;

import com.academicrisks.dao.StudentDAO;
import com.academicrisks.model.Student;
import com.academicrisks.util.JsonUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class StudentsServlet extends HttpServlet {

    private StudentDAO studentDAO = new StudentDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            // GET /api/students - list all
            handleGetAll(response);
        } else {
            // GET /api/students/{id}
            String idStr = pathInfo.substring(1); // remove leading /
            // Check if this is meant for stats servlet (shouldn't reach here due to web.xml mapping)
            if (idStr.startsWith("stats")) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            handleGetById(idStr, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.equals("/bulk")) {
            handleBulkCreate(request, response);
        } else {
            handleCreate(request, response);
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
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Student not found");
            }
        } catch (NumberFormatException e) {
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid student ID");
        }
    }

    private void handleGetAll(HttpServletResponse response) throws IOException {
        List<Student> students = studentDAO.findAll();

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

    private void handleCreate(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String body = JsonUtil.readRequestBody(request);
            JsonObject json = JsonUtil.getGson().fromJson(body, JsonObject.class);
            Student student = jsonToStudent(json);

            Student created = studentDAO.create(student);
            if (created != null) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                JsonUtil.sendJson(response, studentToFrontendJson(created));
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
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Invalid bulk upload data: " + e.getMessage());
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
        academics.addProperty("gpa", s.getGpa());
        academics.addProperty("cgpa", s.getGpa()); // alias for student profile page
        academics.addProperty("attendance", s.getAttendance());
        academics.addProperty("backlogs", s.getBacklogs());
        obj.add("academics", academics);

        // Also expose flat fields for admin dashboard compatibility
        obj.addProperty("cgpa", s.getGpa());
        obj.addProperty("attendance", s.getAttendance());

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

        if (json.has("semester")) s.setSemester(json.get("semester").getAsInt());

        if (json.has("gpa")) s.setGpa(json.get("gpa").getAsDouble());
        if (json.has("GPA")) s.setGpa(json.get("GPA").getAsDouble());
        if (json.has("cgpa")) s.setGpa(json.get("cgpa").getAsDouble());

        if (json.has("attendance")) s.setAttendance(json.get("attendance").getAsDouble());
        if (json.has("Attendance")) s.setAttendance(json.get("Attendance").getAsDouble());

        if (json.has("email")) s.setEmail(json.get("email").getAsString());
        if (json.has("Email")) s.setEmail(json.get("Email").getAsString());

        if (json.has("phone")) s.setPhone(json.get("phone").getAsString());

        if (json.has("year")) s.setYear(json.get("year").getAsInt());
        if (json.has("Year")) s.setYear(json.get("Year").getAsInt());

        if (json.has("address")) s.setAddress(json.get("address").getAsString());

        if (json.has("backlogs")) s.setBacklogs(json.get("backlogs").getAsInt());

        return s;
    }
}
