package com.academicrisks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class BackendApplication {
    public static void main(String[] args) {
        System.out.println("Starting Academic Risk Analysis Backend...");
        SpringApplication.run(BackendApplication.class, args);
    }
}
