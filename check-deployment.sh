#!/bin/bash

# Deployment readiness check script
# Verifies all necessary configurations for production deployment

echo "========================================="
echo "ResuMate Deployment Readiness Check"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check counters
CHECKS_PASSED=0
CHECKS_FAILED=0

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}✗${NC} Node.js not installed"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if npm is installed
echo "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}✗${NC} npm not installed"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check server .env file
echo ""
echo "Checking server configuration..."
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓${NC} server/.env exists"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
    
    # Check required environment variables
    required_vars=("MONGODB_URI" "JWT_SECRET" "OPENAI_API_KEY" "OPENAI_MODEL")
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" "server/.env"; then
            echo -e "${GREEN}✓${NC} $var configured"
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
        else
            echo -e "${YELLOW}⚠${NC} $var not configured"
            CHECKS_FAILED=$((CHECKS_FAILED + 1))
        fi
    done
else
    echo -e "${RED}✗${NC} server/.env not found"
    echo "  Copy server/.env.example to server/.env and configure"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check client .env file
echo ""
echo "Checking client configuration..."
if [ -f "client/.env" ]; then
    echo -e "${GREEN}✓${NC} client/.env exists"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠${NC} client/.env not found (optional)"
fi

# Check if node_modules exist in server
echo ""
echo "Checking dependencies..."
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Server dependencies installed"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠${NC} Server dependencies not installed"
    echo "  Run: cd server && npm install"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

if [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Client dependencies installed"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠${NC} Client dependencies not installed"
    echo "  Run: cd client && npm install"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if client dist exists
echo ""
echo "Checking client build..."
if [ -d "client/dist" ]; then
    echo -e "${GREEN}✓${NC} Client build exists"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${YELLOW}⚠${NC} Client build not found"
    echo "  Run: cd client && npm run build"
    CHECKS_FAILED=$((CHECKS_FAILED + 1))
fi

# Check if MongoDB is accessible (optional)
echo ""
echo "Checking MongoDB connectivity..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo -e "${GREEN}✓${NC} MongoDB is accessible"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "${YELLOW}⚠${NC} MongoDB is not accessible"
    fi
else
    echo -e "${YELLOW}⚠${NC} mongosh not installed (optional)"
fi

# Summary
echo ""
echo "========================================="
echo "Check Summary"
echo "========================================="
echo -e "${GREEN}Passed:${NC} $CHECKS_PASSED"
echo -e "${RED}Failed:${NC} $CHECKS_FAILED"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo "Ready for deployment."
    exit 0
else
    echo -e "${YELLOW}⚠ Please fix the above issues before deploying.${NC}"
    exit 1
fi
