#!/bin/bash

# ============================================
# OmniShop360 - Branch Protection Setup
# ============================================
# This script configures branch protection rules for main, develop, and release branches
# using GitHub API

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_OWNER="${GITHUB_REPOSITORY_OWNER:-AQUILA04}"
REPO_NAME="${GITHUB_REPOSITORY_NAME:-OmniShop360}"
GITHUB_TOKEN="${GITHUB_TOKEN}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: GITHUB_TOKEN environment variable is not set${NC}"
    echo "Usage: GITHUB_TOKEN=your_token ./setup-branch-protection.sh"
    exit 1
fi

API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/branches"

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

# Function to configure branch protection
configure_branch_protection() {
    local branch=$1
    local protection_config=$2
    
    print_info "Configuring protection for branch: $branch"
    
    response=$(curl -s -w "\n%{http_code}" -X PUT \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github+json" \
        "${API_URL}/${branch}/protection" \
        -d "${protection_config}")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Branch protection configured for: $branch"
    else
        print_error "Failed to configure protection for: $branch (HTTP $http_code)"
        echo "$response" | head -n-1
    fi
}

# Main branch protection
MAIN_PROTECTION='{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Build and Test Backend",
      "Build and Test Frontend",
      "Build and Test POS",
      "Code Quality Analysis",
      "Security Scan"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}'

# Develop branch protection
DEVELOP_PROTECTION='{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Build and Test Backend",
      "Build and Test Frontend",
      "Build and Test POS"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}'

# Release branch protection pattern
RELEASE_PROTECTION='{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Build and Test Backend",
      "Build and Test Frontend",
      "Build and Test POS",
      "Code Quality Analysis",
      "Security Scan"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}'

echo ""
echo "============================================"
echo "Configuring Branch Protection Rules"
echo "Repository: ${REPO_OWNER}/${REPO_NAME}"
echo "============================================"
echo ""

# Configure main branch
configure_branch_protection "main" "$MAIN_PROTECTION"

# Configure develop branch
configure_branch_protection "develop" "$DEVELOP_PROTECTION"

echo ""
echo "============================================"
print_success "Branch protection configuration completed!"
echo "============================================"
echo ""
echo "Protected branches:"
echo "  - main (strict protection, 2 approvals required)"
echo "  - develop (standard protection, 1 approval required)"
echo "  - release/* (pattern-based protection)"
echo ""
echo "Note: Release branch protection must be configured manually"
echo "      or when a release branch is created."
echo ""
