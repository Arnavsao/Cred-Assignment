# Getting Started - Quick Guide

Welcome! This guide will help you get the Expense Sharing Application up and running quickly.

## What You'll Need

Before starting, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- A terminal/command prompt
- A code editor (optional, for viewing code)

## Project Overview

This is a full-stack expense sharing application with:
- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React
- **46 source files** across both applications
- **5+ comprehensive documentation files**

## Quick Setup (Automated)

### Option 1: Use the Setup Script (Recommended)

```bash
# Navigate to project directory
cd "Cred Assignment"

# Run the automated setup script
./setup.sh
```

This will:
1. Check for Node.js installation
2. Create .env file from template
3. Install backend dependencies
4. Install frontend dependencies
5. Show you next steps

## Manual Setup

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# (Optional) Edit .env if needed
# The defaults should work for local development
```

### Step 2: Setup Frontend

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install
```

### Step 3: Start MongoDB

Choose based on your operating system:

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
- Open Services app
- Find MongoDB service
- Click Start

**Verify MongoDB is running:**
```bash
# Should connect without errors
mongosh
# Or
mongo
```

### Step 4: Start the Application

You'll need **two terminal windows**.

**Terminal 1 - Backend:**
```bash
cd backend
npm start

# You should see:
# Server is running on port 5000
# MongoDB Connected: localhost
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start

# Browser will automatically open to:
# http://localhost:3000
```

## First Time Using the App

### 1. Create Users

When you first open the app:
1. Click "Create New User"
2. Enter a name and email
3. Create 2-3 test users for demonstration

Example users:
- Alice (alice@test.com)
- Bob (bob@test.com)
- Carol (carol@test.com)

### 2. Create a Group

1. Select a user (e.g., Alice)
2. Click "Create Group" in the navigation
3. Enter group details:
   - Name: "Roommates" or "Vacation Trip"
   - Description: Optional
   - Members: Select at least one other user
4. Click "Create Group"

### 3. Add an Expense

1. Select your group from the Groups list
2. Click "Add Expense"
3. Fill in the details:
   - Description: "Groceries" or "Dinner"
   - Amount: 90.00
   - Paid By: Select who paid
   - Split Type: Try "Equal" first
4. Click "Add Expense"

### 4. View Balances

1. Click "Balances" tab
2. See:
   - Who you owe money to
   - Who owes you money
   - Your net balance
3. Click "Settle Up" to record a payment

## Testing Different Split Types

### Equal Split (Easiest)
- Just add the expense
- Amounts calculated automatically
- Example: $90 among 3 people = $30 each

### Exact Split
- Specify exact amount for each person
- Must sum to total amount
- Example: $100 split as $40, $35, $25

### Percentage Split
- Specify percentage for each person
- Must sum to 100%
- Example: $100 split as 50%, 30%, 20%

## Project Structure

```
Cred Assignment/
├── Documentation (5 files)
│   ├── README.md              # Main documentation
│   ├── DESIGN.md              # Technical design
│   ├── ARCHITECTURE.md        # System architecture
│   ├── API_EXAMPLES.md        # API testing guide
│   └── GETTING_STARTED.md     # This file
│
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── models/            # Database schemas (5)
│   │   ├── controllers/       # Business logic (5)
│   │   ├── routes/            # API endpoints (5)
│   │   ├── middleware/        # Validation & errors
│   │   ├── utils/             # Balance algorithm
│   │   └── server.js          # Entry point
│   └── package.json
│
└── frontend/                  # React application
    ├── src/
    │   ├── components/        # UI components (5)
    │   ├── pages/             # Pages (2)
    │   ├── services/          # API integration
    │   └── utils/             # Helpers
    └── package.json
```

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Start MongoDB if not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### Issue: "Cannot connect to backend API"

**Solution:**
1. Check backend is running (Terminal 1)
2. Verify URL: http://localhost:5000/api/health
3. Check for CORS errors in browser console
4. Ensure both servers are running

### Issue: "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend won't start

**Solution:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

## API Testing (Optional)

If you want to test the API directly:

### Using curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Get all users
curl http://localhost:5000/api/users

# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com"}'
```

### Using Postman:
1. Import the examples from [API_EXAMPLES.md](API_EXAMPLES.md)
2. Set base URL: http://localhost:5000/api
3. Test each endpoint

## Next Steps

### Learn More
1. Read [README.md](README.md) for detailed documentation
2. Check [DESIGN.md](DESIGN.md) for technical details
3. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
4. Try [API_EXAMPLES.md](API_EXAMPLES.md) for API testing

### Explore Features
- Try all three split types
- Add multiple expenses
- View how balances are simplified
- Test settlement functionality
- Create multiple groups

### Development
- Modify UI in `frontend/src/components/`
- Add API endpoints in `backend/src/routes/`
- Update business logic in `backend/src/controllers/`
- Enhance algorithms in `backend/src/utils/`

## Key Features to Try

### 1. Balance Simplification
Create these expenses and watch balances simplify:
- Alice pays $30, split equally between Alice and Bob
- Bob pays $40, split equally between Bob and Carol
- Carol pays $20, split equally between Carol and Alice

The app will automatically minimize the number of transactions needed!

### 2. Different Split Types
Test all three in the same group:
- Equal: $90 dinner, 3 people
- Exact: $100 shopping, custom amounts
- Percentage: $300 hotel, by room size

### 3. Settlement Flow
1. Add several expenses
2. View balances
3. Settle one payment
4. See balances update
5. Check settlement history

## Development Mode

Both applications support hot reload:

**Backend** (with nodemon):
```bash
cd backend
npm run dev  # Auto-restarts on file changes
```

**Frontend** (React):
```bash
cd frontend
npm start  # Auto-refreshes on file changes
```

## Stopping the Application

To stop the servers:
1. Press `Ctrl+C` in each terminal
2. Stop MongoDB (optional):
   ```bash
   brew services stop mongodb-community  # macOS
   sudo systemctl stop mongod            # Linux
   ```

## Getting Help

### Check Documentation
1. This file (GETTING_STARTED.md)
2. README.md for comprehensive guide
3. DESIGN.md for technical details

### Debug Checklist
- [ ] MongoDB is running
- [ ] Backend started successfully (port 5000)
- [ ] Frontend started successfully (port 3000)
- [ ] No errors in terminal
- [ ] Browser console is clear

### Common Commands

```bash
# Check if servers are running
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# View MongoDB data (optional)
mongosh
> use expense-sharing
> db.users.find()
> db.groups.find()
> db.expenses.find()
> db.balances.find()

# Clear all data (fresh start)
mongosh
> use expense-sharing
> db.dropDatabase()
```

## Tips for Demo/Presentation

1. **Prepare Test Data**:
   - Create 3-4 users ahead of time
   - Create 1-2 groups
   - Have some expenses ready

2. **Show Key Features**:
   - Different split types
   - Balance simplification
   - Settlement process
   - Balance history

3. **Highlight Technical Aspects**:
   - Algorithm efficiency
   - Data validation
   - Error handling
   - Responsive design

## What Makes This Special

### Balance Simplification Algorithm
Unlike basic expense apps, this implements a sophisticated algorithm that:
- Minimizes number of transactions
- Handles complex circular debts
- Runs in O(n log n) time
- Automatically simplifies on every change

### Three Split Types
Most apps only support equal splits. This supports:
- Equal (automatic)
- Exact amounts (validated)
- Percentages (validated)

### Production-Ready Code
- Comprehensive error handling
- Input validation at multiple layers
- Clean architecture
- Extensive documentation
- Edge case handling

## Success Checklist

You're ready when:
- ✓ Both servers are running without errors
- ✓ You can create users
- ✓ You can create groups
- ✓ You can add expenses with all split types
- ✓ Balances show correctly
- ✓ You can settle balances

## Have Fun!

The application is designed to be intuitive. Explore the features, test edge cases, and see how the balance simplification works in action.

For detailed information on any aspect, refer to the other documentation files.

**Enjoy using the Expense Sharing Application!**

---

**Quick Reference**:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Health: http://localhost:5000/api/health
- Docs: README.md, DESIGN.md, ARCHITECTURE.md
