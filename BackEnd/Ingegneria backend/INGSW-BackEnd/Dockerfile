FROM openjdk:23-jdk-slim

WORKDIR /app

# Copia il file JAR generato nel container
COPY target/dieti_estates-0.0.1-SNAPSHOT.jar app.jar

# Copia il file .env, se esiste
COPY .env .env

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]