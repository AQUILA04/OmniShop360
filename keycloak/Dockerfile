FROM quay.io/keycloak/keycloak:23.0.1 AS builder

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

FROM quay.io/keycloak/keycloak:23.0.1

# Switch to root temporarily
USER root

# Copy built Keycloak from builder
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy healthcheck script
COPY healthcheck.sh /opt/keycloak/bin/healthcheck.sh
RUN chmod +x /opt/keycloak/bin/healthcheck.sh

# Switch back to non-root user
USER keycloak

# Expose ports
EXPOSE 8080
EXPOSE 8443

# Health check using custom script
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD /opt/keycloak/bin/healthcheck.sh || exit 1

# Set the entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
