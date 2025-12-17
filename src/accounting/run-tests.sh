#!/bin/bash
# Test runner script for Account Management System

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "Account Management System - Test Suite"
echo "========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Run tests
echo "Running tests..."
npm test

echo ""
echo "========================================="
echo "Test execution complete!"
echo "========================================="
