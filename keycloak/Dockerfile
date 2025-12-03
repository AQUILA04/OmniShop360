FROM quay.io/keycloak/keycloak:23.0 AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak

# Copy custom theme
COPY themes/omnishop360 /opt/keycloak/themes/omnishop360

# Build optimized Keycloak
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:23.0

COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Create non-root user (Keycloak already has keycloak user)
USER keycloak

# Expose ports
EXPOSE 8080
EXPOSE 8443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:8080/health/ready || exit 1

# Set the entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
