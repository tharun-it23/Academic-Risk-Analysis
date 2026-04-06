package com.academicrisks.filter;

import com.academicrisks.util.JsonUtil;
import com.academicrisks.util.JwtUtil;
import io.jsonwebtoken.Claims;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/api/*")
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();

        // Skip auth for login endpoint and OPTIONS preflight
        if (path.equals("/api/auth/login") || "OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String token = httpRequest.getHeader("x-auth-token");

        if (token == null || token.isEmpty()) {
            JsonUtil.sendError(httpResponse, HttpServletResponse.SC_UNAUTHORIZED, "No token, authorization denied");
            return;
        }

        Claims claims = JwtUtil.validateToken(token);
        if (claims == null) {
            JsonUtil.sendError(httpResponse, HttpServletResponse.SC_UNAUTHORIZED, "Token is not valid");
            return;
        }

        // Store user info in request attributes for downstream servlets
        httpRequest.setAttribute("userId", JwtUtil.getUserId(claims));
        httpRequest.setAttribute("userRole", JwtUtil.getRole(claims));
        httpRequest.setAttribute("username", JwtUtil.getUsername(claims));

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
