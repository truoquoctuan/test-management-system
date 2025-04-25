# Build stage
FROM maven:3.9.9-amazoncorretto-21-alpine AS build

WORKDIR /home

# Copy toàn bộ source code vào container
COPY . /home/

# Build ứng dụng và bỏ qua test
RUN mvn -f /home/pom.xml clean package -DskipTests

# Deploy stage
FROM amazoncorretto:21-alpine

# Expose cổng ứng dụng
EXPOSE 8080

# Copy file JAR từ build stage
COPY --from=build /home/target/*.jar app.jar

# Lệnh chạy ứng dụng
ENTRYPOINT ["sh", "-c", "java -jar /app.jar"]
