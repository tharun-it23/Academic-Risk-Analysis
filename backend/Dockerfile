# Use a lightweight OpenJDK 8 image
FROM eclipse-temurin:8-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR from the target directory
COPY target/academic-risk-backend.jar app.jar

# Create a data directory for SQLite
RUN mkdir -p /app/data

# Set environment variables with defaults
ENV PORT=8080
ENV DATABASE_PATH=/app/data/academic_risk.db

# Expose the communication port
EXPOSE 8080

# Run the application
# We use shell form to allow environment variable expansion
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
