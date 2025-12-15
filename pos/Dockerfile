# Multi-stage build for Angular POS application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm config set strict-ssl false && \
    npm install -g pnpm@10.24.0 && \
    pnpm config set strict-ssl false && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application with production optimizations
RUN pnpm run build --configuration=production

# Runtime stage with nginx
FROM nginx:1.25-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/pos/browser /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S omnishop && \
    adduser -u 1001 -S omnishop -G omnishop && \
    chown -R omnishop:omnishop /usr/share/nginx/html && \
    chown -R omnishop:omnishop /var/cache/nginx && \
    chown -R omnishop:omnishop /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R omnishop:omnishop /var/run/nginx.pid

# Switch to non-root user
USER omnishop

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
