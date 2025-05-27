FROM maven:3.9.7-amazoncorretto-17 AS build

WORKDIR /home

COPY . /home/

RUN mvn -f /home/pom.xml clean package -DskipTest

# Deploy stage
FROM amazoncorretto:17

EXPOSE 8080

COPY --from=build /home/target/*.jar app.jar

ENTRYPOINT ["sh", "-c", "java -jar /app.jar"]