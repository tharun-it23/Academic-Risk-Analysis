package com.academicrisks.service;

import com.academicrisks.model.Student;

public class RiskEngine {
    
    // Weightage parameters as defined in project scope
    private static final double WEIGHT_CGPA = 0.35;
    private static final double WEIGHT_ATTENDANCE = 0.30;
    private static final double WEIGHT_ARREARS = 0.25;
    private static final double WEIGHT_PLACEMENT = 0.10;

    /**
     * Calculates composite risk score and updates the Student model's
     * riskScore and riskStatus fields automatically.
     */
    public static void assessAndRankStudent(Student student) {
        double cgpa = student.getCgpa();
        double attendance = student.getAttendance();
        int arrears = student.getArrearCount();
        String placementStatus = student.getPlacementEligibilityStatus();

        // 1. Calculate Risk Factor Scores (Higher Score = Higher Risk)
        // Max risk score per category is mapped to a 0-100 scale

        // CGPA Risk (35%) -> Base risk increases rapidly below 6.5
        // Best case (10.0) -> 0 risk. Worst case (< 5.0) -> 100 risk
        double cgpaRiskScore = 0.0;
        if (cgpa < 5.0) cgpaRiskScore = 100.0;
        else if (cgpa >= 10.0) cgpaRiskScore = 0.0;
        else cgpaRiskScore = ((10.0 - cgpa) / 5.0) * 100.0; 
        
        // Attendance Risk (30%) -> 100% att = 0 risk, < 65% = 100 risk
        double attendanceRiskScore = 0.0;
        if (attendance < 65.0) attendanceRiskScore = 100.0;
        else if (attendance >= 100.0) attendanceRiskScore = 0.0;
        else attendanceRiskScore = ((100.0 - attendance) / 35.0) * 100.0;

        // Arrear Risk (25%) -> 0 arrears = 0 risk, >= 4 arrears = 100 risk
        double arrearRiskScore = 0.0;
        if (arrears >= 4) arrearRiskScore = 100.0;
        else if (arrears == 0) arrearRiskScore = 0.0;
        else arrearRiskScore = (arrears / 4.0) * 100.0;

        // Placement Risk (10%)
        double placementRiskScore = "Eligible".equalsIgnoreCase(placementStatus) ? 0.0 : 100.0;

        // 2. Composite Score (0.0 to 100.0)
        double compositeScore = (cgpaRiskScore * WEIGHT_CGPA) + 
                                (attendanceRiskScore * WEIGHT_ATTENDANCE) + 
                                (arrearRiskScore * WEIGHT_ARREARS) + 
                                (placementRiskScore * WEIGHT_PLACEMENT);

        student.setRiskScore(Math.round(compositeScore * 100.0) / 100.0);

        // 3. Classification Engine (Rules override composite score for critical failures)
        if (cgpa < 5.0 || attendance < 65.0 || arrears >= 4) {
            student.setRiskStatus("High");
        } 
        else if ((cgpa >= 5.0 && cgpa <= 6.5) || 
                 (attendance >= 65.0 && attendance <= 75.0) || 
                 arrears > 0 || 
                 "At Risk".equalsIgnoreCase(placementStatus)) {
            student.setRiskStatus("Medium");
        } 
        else {
            student.setRiskStatus("Low");
        }
    }
}
