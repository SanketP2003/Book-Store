# Stage 1: Build frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY ../frontend/package.json ./
COPY ../frontend/package-lock.json ./
RUN npm install
COPY ../frontend ./
RUN npm run build

# Stage 2: Build backend
FROM maven:3.8.4-openjdk-17 AS build-backend
WORKDIR /app/backend
COPY ./pom.xml ./
COPY ./src ./src
RUN mvn clean install -DskipTests

# Stage 3: Final image
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build-backend /app/backend/target/*.jar ./app.jar
COPY --from=build-frontend /app/frontend/dist ./static
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]