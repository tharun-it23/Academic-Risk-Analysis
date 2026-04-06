package com.academicrisks.servlet;

import com.academicrisks.dao.StudentDAO;
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
            handleOverallStats(response);
        }
    }

    private void handleOverallStats(HttpServletResponse response) throws IOException {
        Map<String, Object> stats = studentDAO.getStats();
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
