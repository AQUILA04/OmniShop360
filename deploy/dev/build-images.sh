#!/bin/bash

# ============================================
# OmniShop360 - Build Docker Images (Linux/Mac)
# ============================================

set -e

echo ""
echo "============================================"
echo "Building OmniShop360 Docker Images"
echo "============================================"
echo ""

# Set the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Build Keycloak Image
print_info "[1/4] Building Keycloak image..."
if docker build -t omnishop360/keycloak:latest "$PROJECT_ROOT/keycloak"; then
    print_success "Keycloak image built successfully!"
else
    print_error "Failed to build Keycloak image"
    exit 1
fi
echo ""

# Build Backend Image
print_info "[2/4] Building Backend image..."
if docker build -t omnishop360/backend:latest "$PROJECT_ROOT/backend"; then
    print_success "Backend image built successfully!"
else
    print_error "Failed to build Backend image"
    exit 1
fi
echo ""

# Build Frontend Image
print_info "[3/4] Building Frontend image..."
if docker build -t omnishop360/frontend:latest "$PROJECT_ROOT/frontend"; then
    print_success "Frontend image built successfully!"
else
    print_error "Failed to build Frontend image"
    exit 1
fi
echo ""

# Build POS Image
print_info "[4/4] Building POS image..."
if docker build -t omnishop360/pos:latest "$PROJECT_ROOT/pos"; then
    print_success "POS image built successfully!"
else
    print_error "Failed to build POS image"
    exit 1
fi
echo ""

echo "============================================"
print_success "All images built successfully!"
echo "============================================"
echo ""
echo "Images created:"
echo "  - omnishop360/keycloak:latest"
echo "  - omnishop360/backend:latest"
echo "  - omnishop360/frontend:latest"
echo "  - omnishop360/pos:latest"
echo ""
echo "To start the services, run:"
echo "  docker-compose up -d"
echo ""

exit 0
