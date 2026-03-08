package com.academicrisks.servlet;

import com.academicrisks.dao.UserDAO;
import com.academicrisks.model.User;
import com.academicrisks.util.JsonUtil;
import com.academicrisks.util.JwtUtil;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.equals("/login")) {
            handleLogin(request, response);
        } else {
            JsonUtil.sendError(response, HttpServletResponse.SC_NOT_FOUND, "Endpoint not found");
        }
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String body = JsonUtil.readRequestBody(request);
            JsonObject json = JsonUtil.getGson().fromJson(body, JsonObject.class);

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

        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error");
        }
    }
}
