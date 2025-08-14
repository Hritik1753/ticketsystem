# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY demo/pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY demo/src ./src

# Package the application
RUN mvn clean package -DskipTests

# Stage 2: Run the packaged application
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
