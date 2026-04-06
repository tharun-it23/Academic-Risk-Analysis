package com.academicrisks.servlet;

import com.academicrisks.dao.ActivityLogDAO;
import com.academicrisks.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet(urlPatterns = {"/api/activity-log", "/api/activity-log/*"})
public class ActivityLogServlet extends HttpServlet {

    private ActivityLogDAO activityLogDAO = new ActivityLogDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        int limit = 20;
        String limitParam = request.getParameter("limit");
        if (limitParam != null) {
            try {
                limit = Integer.parseInt(limitParam);
            } catch (NumberFormatException ignored) {}
        }

        List<Map<String, Object>> activities = activityLogDAO.getRecent(limit);
        JsonUtil.sendJson(response, activities);
    }
}
