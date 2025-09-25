# Multi-stage Dockerfile: builds frontend, bundles into Spring Boot, and runs on JRE

# 1) Build frontend (Vite React)
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
# Ensure same-origin API calls in production build
ENV VITE_API_BASE_URL=/
# Copy only package manifests first for better caching
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install
# Copy the rest of the frontend
COPY frontend/ ./
# Build production assets to /app/frontend/dist
RUN npm run build

# 2) Build backend (Spring Boot + Maven), embed frontend into static resources
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
# Copy backend sources
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src
# Ensure static folder exists and is empty, then copy frontend build output into it
RUN mkdir -p backend/src/main/resources/static && rm -rf backend/src/main/resources/static/* || true
COPY --from=frontend-build /app/frontend/dist/ ./backend/src/main/resources/static/
# Package Spring Boot app (skip tests for faster build)
RUN mvn -f backend/pom.xml -DskipTests package

# 3) Runtime image
FROM eclipse-temurin:17-jre-alpine
ENV PORT=8080
WORKDIR /app
# Copy the built jar
COPY --from=backend-build /app/backend/target/*.jar app.jar
# Expose Spring Boot default port
EXPOSE 8080
# Optional: JVM options can be provided via RENDER_RUNTIME_ENV or environment variable in Render
# ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Healthcheck (optional)
# HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/actuator/health || exit 1

CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
