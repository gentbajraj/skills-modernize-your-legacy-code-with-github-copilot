#!/bin/bash
# Verification script for Account Management System

echo "========================================="
echo "Account Management System Verification"
echo "========================================="
echo ""

# Change to accounting directory
cd /workspaces/skills-modernize-your-legacy-code-with-github-copilot/src/accounting

echo "1. Running Test Suite..."
echo "----------------------------------------"
npm test
TEST_EXIT_CODE=$?

echo ""
echo "========================================="
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed successfully!"
else
    echo "❌ Tests failed with exit code: $TEST_EXIT_CODE"
fi
echo "========================================="
echo ""

echo "To run the application interactively:"
echo "  cd src/accounting && npm start"
echo ""

exit $TEST_EXIT_CODE
