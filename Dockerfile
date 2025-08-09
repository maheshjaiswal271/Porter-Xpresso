FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY backend /app
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/porter-0.0.1-SNAPSHOT.jar porter.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","porter.jar"]