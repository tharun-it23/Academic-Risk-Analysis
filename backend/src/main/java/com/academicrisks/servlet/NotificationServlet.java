package com.academicrisks.servlet;

import com.academicrisks.dao.NotificationDAO;
import com.academicrisks.dao.StudentDAO;
import com.academicrisks.model.Notification;
import com.academicrisks.model.Student;
import com.academicrisks.util.JsonUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/notifications", "/api/notifications/*"})
public class NotificationServlet extends HttpServlet {

    private NotificationDAO notificationDAO = new NotificationDAO();
    private StudentDAO studentDAO = new StudentDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String role = (String) request.getAttribute("userRole");
        String username = (String) request.getAttribute("username");

        if (role == null) {
            JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }

        String riskStatus = null;
        if ("student".equalsIgnoreCase(role)) {
            Student s = studentDAO.findByRollNo(username);
            if (s != null) {
                riskStatus = s.getRiskStatus();
            }
        }

        List<Notification> notifications = notificationDAO.getNotificationsForUser(role, riskStatus);
        
        JsonArray array = new JsonArray();
        for (Notification n : notifications) {
            JsonObject obj = new JsonObject();
            obj.addProperty("id", n.getId());
            obj.addProperty("message", n.getMessage());
            obj.addProperty("targetGroup", n.getTargetGroup());
            obj.addProperty("senderName", n.getSenderName());
            obj.addProperty("createdAt", n.getCreatedAt());
            array.add(obj);
        }
        
        JsonUtil.sendJson(response, array);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String role = (String) request.getAttribute("userRole");

        if (!"admin".equalsIgnoreCase(role)) {
            JsonUtil.sendError(response, HttpServletResponse.SC_FORBIDDEN, "Only admins can send notifications");
            return;
        }

        try {
            String body = JsonUtil.readRequestBody(request);
            JsonObject json = JsonUtil.getGson().fromJson(body, JsonObject.class);

            if (json == null || !json.has("message") || !json.has("targetGroup")) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Message and targetGroup are required");
                return;
            }

            Notification n = new Notification();
            n.setMessage(json.get("message").getAsString());
            n.setTargetGroup(json.get("targetGroup").getAsString());
            n.setSenderName("Administrator");

            boolean success = notificationDAO.create(n);
            if (success) {
                JsonObject res = new JsonObject();
                res.addProperty("msg", "Notification sent successfully");
                JsonUtil.sendJson(response, res);
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to send notification");
            }
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error");
        }
    }
}
