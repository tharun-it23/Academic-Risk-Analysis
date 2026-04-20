package com.academicrisks.servlet;

import com.academicrisks.dao.StudentDAO;
import com.academicrisks.dao.UserDAO;
import com.academicrisks.model.User;
import com.academicrisks.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@WebServlet(urlPatterns = {"/api/students/stats", "/api/students/stats/*"})
public class StudentStatsServlet extends HttpServlet {

    private StudentDAO studentDAO = new StudentDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.equals("/monthly")) {
            handleMonthlyStats(request, response);
        } else {
            handleOverallStats(request, response);
        }
    }

    private void handleOverallStats(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String role = (String) request.getAttribute("userRole");
        Integer userId = (Integer) request.getAttribute("userId");
        
        Map<String, Object> stats;
        if ("faculty".equals(role) && userId != null) {
            UserDAO userDAO = new UserDAO();
            User user = userDAO.findById(userId);
            if (user != null && user.getDepartment() != null && !user.getDepartment().isEmpty()) {
                stats = studentDAO.getStatsByDepartment(user.getDepartment());
            } else {
                stats = studentDAO.getStats();
            }
        } else {
            stats = studentDAO.getStats();
        }
        
        JsonUtil.sendJson(response, stats);
    }

    private void handleMonthlyStats(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int month;
        int year;
        try {
            month = Integer.parseInt(request.getParameter("month"));
            year = Integer.parseInt(request.getParameter("year"));
        } catch (NumberFormatException e) {
            // Default to current month/year
            java.util.Calendar cal = java.util.Calendar.getInstance();
            month = cal.get(java.util.Calendar.MONTH) + 1;
            year = cal.get(java.util.Calendar.YEAR);
        }

        Map<String, Object> monthlyStats = studentDAO.getMonthlyStats(month, year);
        JsonUtil.sendJson(response, monthlyStats);
    }
}
