# Stage 1: Build the application
FROM maven:3.8.5-openjdk-8-slim AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:8-jre-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/academic-risk-backend.jar app.jar

# Create a data directory for SQLite
RUN mkdir -p /app/data

# Set environment variables with defaults
ENV PORT=8080
ENV DATABASE_PATH=/app/data/academic_risk.db

# Expose the communication port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
