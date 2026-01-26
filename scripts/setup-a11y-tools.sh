#!/bin/bash

# Accessibility Testing Tools Setup Script
# This script verifies dependencies and installs accessibility testing tools

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Accessibility Testing Tools Setup"
echo "========================================"
echo ""

# Check for Node.js
echo -n "Checking for Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}Found ${NODE_VERSION}${NC}"
else
    echo -e "${RED}Not found${NC}"
    echo "Please install Node.js from https://nodejs.org/ or via asdf"
    exit 1
fi

# Check for yarn
echo -n "Checking for yarn... "
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}Found ${YARN_VERSION}${NC}"
else
    echo -e "${RED}Not found${NC}"
    echo "Please install yarn: npm install -g yarn"
    exit 1
fi

echo ""
echo "Installing dependencies..."
echo ""

# Run yarn install
yarn install

echo ""
echo "Verifying accessibility tools..."
echo ""

# Verify pa11y
echo -n "Checking pa11y... "
if yarn --silent pa11y --version &> /dev/null; then
    PA11Y_VERSION=$(yarn --silent pa11y --version 2>/dev/null)
    echo -e "${GREEN}Installed (v${PA11Y_VERSION})${NC}"
else
    echo -e "${RED}Failed${NC}"
    exit 1
fi

# Verify axe-core
echo -n "Checking axe-core... "
if yarn --silent axe --version &> /dev/null; then
    AXE_VERSION=$(yarn --silent axe --version 2>/dev/null)
    echo -e "${GREEN}Installed (v${AXE_VERSION})${NC}"
else
    echo -e "${RED}Failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================"
echo "Setup Complete!"
echo "========================================${NC}"
echo ""
echo "Available commands:"
echo "  yarn a11y <url>  - Run pa11y against a URL"
echo "  yarn axe <url>   - Run axe-core against a URL"
echo ""
echo "Example:"
echo "  yarn a11y https://deploy-preview-5--buckley-sitzman-llp.netlify.app/"
echo "  yarn axe http://localhost:8080"
echo ""
