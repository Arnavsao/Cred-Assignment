#!/bin/bash

# Expense Sharing Application - Setup Script
# This script sets up both backend and frontend

set -e  # Exit on error

echo "================================================"
echo "Expense Sharing Application - Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}Warning: MongoDB is not installed or not in PATH${NC}"
    echo "Please ensure MongoDB is installed and running"
    echo "Install from: https://www.mongodb.com/try/download/community"
    echo ""
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✓ npm version: $(npm --version)${NC}"
echo ""

# Setup Backend
echo "================================================"
echo "Setting up Backend..."
echo "================================================"

cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping...${NC}"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo "================================================"
echo "Setting up Frontend..."
echo "================================================"

cd frontend

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

# Final Instructions
echo ""
echo "================================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Ensure MongoDB is running:"
echo "   - macOS (Homebrew): brew services start mongodb-community"
echo "   - Linux: sudo systemctl start mongod"
echo "   - Windows: Start MongoDB service from Services"
echo ""
echo "2. Start the backend server (in one terminal):"
echo "   cd backend"
echo "   npm start"
echo ""
echo "3. Start the frontend server (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "================================================"
echo "For more information, see README.md"
echo "================================================"
