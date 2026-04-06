package com.academicrisks.servlet;

import com.academicrisks.dao.ActivityLogDAO;
import com.academicrisks.dao.UserDAO;
import com.academicrisks.model.User;
import com.academicrisks.util.JsonUtil;
import com.academicrisks.util.JwtUtil;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(urlPatterns = {"/api/auth", "/api/auth/*"})
public class AuthServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();
    private ActivityLogDAO activityLogDAO = new ActivityLogDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.equals("/login")) {
            handleLogin(request, response);
        } else if (pathInfo != null && pathInfo.equals("/register")) {
            handleRegister(request, response);
        } else if (pathInfo != null && pathInfo.equals("/change-password")) {
            handleChangePassword(request, response);
        } else {
            JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }

    private void handleChangePassword(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            Integer userId = (Integer) request.getAttribute("userId");
            if (userId == null) {
                JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            String body = JsonUtil.readRequestBody(request);
            JsonObject json = JsonUtil.getGson().fromJson(body, JsonObject.class);

            String currentPassword = json.has("currentPassword") ? json.get("currentPassword").getAsString() : null;
            String newPassword = json.has("newPassword") ? json.get("newPassword").getAsString() : null;

            if (currentPassword == null || newPassword == null) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Please provide current and new password");
                return;
            }

            User user = userDAO.findById(userId);

            if (user == null || !user.getPassword().equals(currentPassword)) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Incorrect current password");
                return;
            }

            boolean updated = userDAO.updatePassword(userId, newPassword);
            if (updated) {
                JsonObject result = new JsonObject();
                result.addProperty("msg", "Password updated successfully");
                JsonUtil.sendJson(response, result);
                activityLogDAO.log("update", "Changed account password", user.getName());
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to update password");
            }

        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error");
        }
    }

    private void handleRegister(HttpServletRequest request, HttpServletResponse response) throws IOException {
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

            String username = json.has("username") ? json.get("username").getAsString() : null;
            String password = json.has("password") ? json.get("password").getAsString() : null;
            String name = json.has("name") ? json.get("name").getAsString() : username;
            String role = json.has("role") ? json.get("role").getAsString() : "student";

            if (username == null || password == null || username.trim().isEmpty() || password.trim().isEmpty()) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Username and password are required");
                return;
            }

            User existingUser = userDAO.findByUsername(username);
            if (existingUser != null) {
                JsonUtil.sendError(response, HttpServletResponse.SC_CONFLICT, "Username already exists");
                return;
            }

            User newUser = new User(0, username, password, role, name);
            boolean added = userDAO.addUser(newUser);

            if (added) {
                JsonObject result = new JsonObject();
                result.addProperty("msg", "Account created successfully");
                JsonUtil.sendJson(response, result);
                activityLogDAO.log("update", "New account registered: " + username, name);
            } else {
                JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to create account");
            }
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error");
        }
    }


    private void handleLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
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

            String username = json.has("username") ? json.get("username").getAsString() : null;
            String password = json.has("password") ? json.get("password").getAsString() : null;

            if (username == null || password == null) {
                JsonUtil.sendError(response, HttpServletResponse.SC_BAD_REQUEST, "Please provide username and password");
                return;
            }

            User user = userDAO.findByUsername(username);

            if (user == null || !user.getPassword().equals(password)) {
                JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid credentials");
                return;
            }

            // Generate JWT token
            String token = JwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

            // Build response matching frontend expectations
            JsonObject userObj = new JsonObject();
            userObj.addProperty("id", String.valueOf(user.getId()));
            userObj.addProperty("username", user.getUsername());
            userObj.addProperty("role", user.getRole());
            userObj.addProperty("name", user.getName());

            JsonObject result = new JsonObject();
            result.addProperty("token", token);
            result.add("user", userObj);

            JsonUtil.sendJson(response, result);

            // Log the login activity
            activityLogDAO.log("login", user.getName() + " (" + user.getRole() + ") logged in", user.getName());

        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error");
        }
    }
}
