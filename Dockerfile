FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
ENV VITE_API_BASE_URL=/
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src
RUN mkdir -p backend/src/main/resources/static && rm -rf backend/src/main/resources/static/* || true
COPY --from=frontend-build /app/frontend/dist/ ./backend/src/main/resources/static/
RUN mvn -f backend/pom.xml -DskipTests package

FROM eclipse-temurin:17-jre-alpine
ENV PORT=8080
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8080

CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
