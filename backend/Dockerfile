# ============================================================
# 1) BUILD STAGE - MAVEN + JDK 21
# ============================================================
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Install CA certificates & wget
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates wget && \
    rm -rf /var/lib/apt/lists/*

# Copy Zscaler certificate into container
COPY ZscalerRootCA.cer /tmp/ZscalerRootCA.cer

# Import Zscaler certificate into Java truststore
RUN keytool -importcert -trustcacerts -file /tmp/ZscalerRootCA.cer \
    -alias zscaler-root -keystore $JAVA_HOME/lib/security/cacerts \
    -storepass changeit -noprompt

# Force Maven to use TLS 1.2
ENV MAVEN_OPTS="-Dhttps.protocols=TLSv1.2"

# Copy source code
COPY src ./src

# Build the application using system Maven (already in image)
RUN mvn clean package -DskipTests

# ============================================================
# 2) RUNTIME STAGE - JRE 21
# ============================================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Create non-root user
RUN addgroup --gid 1001 omnishop && \
    adduser --uid 1001 --system --no-create-home --ingroup omnishop omnishop

# Copy built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Fix permissions
RUN chown -R omnishop:omnishop /app

# Switch to non-root
USER omnishop

# Expose backend port
EXPOSE 8081

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/api/actuator/health || exit 1

# ENTRYPOINT JSON Array valide
ENTRYPOINT ["java","-XX:+UseContainerSupport","-XX:MaxRAMPercentage=75.0","-Djava.security.egd=file:/dev/./urandom","-jar","app.jar"]
