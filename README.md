# Expense Sharing Application

A full-stack expense sharing application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create groups, add shared expenses, track balances, and settle dues with support for multiple split types.

## Features

### Core Functionality
- **User Management**: Create and manage user accounts
- **Group Management**: Create groups with multiple members
- **Expense Tracking**: Add expenses with detailed information
- **Balance Tracking**: Automated balance calculation and simplification
- **Settlement System**: Record and track settlements between users

### Split Types
1. **Equal Split**: Divide expense equally among all participants
2. **Exact Amount**: Specify exact amounts for each participant
3. **Percentage Split**: Split based on percentage contribution

### Balance Simplification
The application uses a sophisticated algorithm to simplify balances:
- Calculates net balances for each user
- Minimizes the number of transactions needed
- Uses a greedy algorithm to match largest creditors with largest debtors

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
expense-sharing/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Group.js             # Group schema
│   │   │   ├── Expense.js           # Expense schema
│   │   │   ├── Balance.js           # Balance schema
│   │   │   └── Settlement.js        # Settlement schema
│   │   ├── controllers/
│   │   │   ├── userController.js    # User operations
│   │   │   ├── groupController.js   # Group operations
│   │   │   ├── expenseController.js # Expense operations
│   │   │   ├── balanceController.js # Balance operations
│   │   │   └── settlementController.js # Settlement operations
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── groupRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   ├── balanceRoutes.js
│   │   │   └── settlementRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── validator.js         # Input validation
│   │   ├── utils/
│   │   │   └── balanceSimplifier.js # Balance simplification algorithm
│   │   └── server.js                # Express app setup
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── GroupList.js         # Display groups
    │   │   ├── CreateGroup.js       # Create new group
    │   │   ├── AddExpense.js        # Add expense form
    │   │   ├── ExpenseList.js       # Display expenses
    │   │   └── BalanceSheet.js      # Display balances
    │   ├── pages/
    │   │   ├── UserSelection.js     # User login/creation
    │   │   └── Dashboard.js         # Main dashboard
    │   ├── services/
    │   │   └── api.js               # API calls
    │   ├── utils/
    │   │   └── helpers.js           # Utility functions
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-sharing
NODE_ENV=development
```

5. Ensure MongoDB is running:
```bash
# For macOS with Homebrew
brew services start mongodb-community

# For Linux
sudo systemctl start mongod

# For Windows, start MongoDB service from Services
```

6. Start the backend server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Documentation

### User Endpoints

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Group Endpoints

- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `GET /api/groups/user/:userId` - Get user's groups
- `POST /api/groups/:id/members` - Add member to group
- `DELETE /api/groups/:id/members` - Remove member from group
- `DELETE /api/groups/:id` - Delete group

### Expense Endpoints

- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `GET /api/expenses/group/:groupId` - Get expenses by group
- `GET /api/expenses/user/:userId` - Get expenses by user
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Balance Endpoints

- `GET /api/balances` - Get all balances
- `GET /api/balances/group/:groupId` - Get balances by group
- `GET /api/balances/user/:userId` - Get balances by user
- `GET /api/balances/user/:userId/group/:groupId` - Get user balance in group

### Settlement Endpoints

- `POST /api/settlements` - Create a settlement
- `GET /api/settlements` - Get all settlements
- `GET /api/settlements/group/:groupId` - Get settlements by group
- `GET /api/settlements/user/:userId` - Get settlements by user
- `POST /api/settlements/group/:groupId/settle-all` - Settle all balances in group

## Usage Guide

### 1. Create or Select User
- On the home page, either select an existing user or create a new one
- Enter name, email, and optionally phone number

### 2. Create a Group
- Click "Create Group" in the navigation
- Enter group name and description
- Select at least one other member (minimum 2 members total)
- Click "Create Group"

### 3. Add an Expense
- Select a group from "Groups"
- Click "Add Expense"
- Fill in expense details:
  - Description
  - Amount
  - Who paid
  - Category
  - Split type (Equal, Exact, or Percentage)
- For Exact or Percentage splits, enter individual amounts/percentages
- Click "Add Expense"

### 4. View Balances
- Select a group
- Click "Balances" to view:
  - Net balance (total you owe or are owed)
  - Who you owe money to
  - Who owes you money
  - Simplified transactions

### 5. Settle Balances
- In the Balances view, click "Settle Up" next to any amount you owe
- Confirm the settlement
- Balances will be updated automatically

## Algorithm Details

### Balance Simplification Algorithm

The application implements an efficient balance simplification algorithm:

1. **Calculate Net Balances**
   - For each user, calculate: (money owed to them) - (money they owe)
   - Users with positive balance are creditors
   - Users with negative balance are debtors

2. **Greedy Matching**
   - Sort creditors and debtors in descending order by amount
   - Match largest creditor with largest debtor
   - Create transaction for minimum of what debtor owes and creditor is owed
   - Update remaining balances and continue

3. **Benefits**
   - Minimizes number of transactions
   - Reduces complexity from O(n²) to O(n log n)
   - Example: 4 people with 6 potential transactions reduced to 3 or fewer

### Edge Cases Handled

1. **Floating Point Precision**: Uses 0.01 threshold for comparisons
2. **Split Validation**: Ensures splits sum to total amount
3. **Self-payments**: Users can pay for themselves in a split
4. **Empty Groups**: Prevents groups with less than 2 members
5. **Member Removal**: Blocks removal of members with unsettled balances
6. **Circular Dependencies**: Simplification algorithm resolves automatically

## Testing

### Manual Testing Steps

1. **User Creation**
   - Create 3-4 test users
   - Verify duplicate email prevention

2. **Group Creation**
   - Create a group with 2 users
   - Try creating a group with 1 user (should fail)
   - Add a member to existing group

3. **Equal Split**
   - Add expense of $100 with 4 people
   - Verify each person's share is $25

4. **Exact Split**
   - Add expense where amounts are specified
   - Try invalid amounts (should fail validation)

5. **Percentage Split**
   - Add expense with percentages
   - Try percentages not summing to 100% (should fail)

6. **Balance Verification**
   - Add multiple expenses
   - Check balances are calculated correctly
   - Verify balances are simplified

7. **Settlement**
   - Settle a balance
   - Verify balance updates correctly
   - Check settlement history

## Security Considerations

### Current Implementation
- Input validation on all endpoints
- MongoDB injection prevention through Mongoose
- Error handling without exposing sensitive data

### Production Recommendations
- Add authentication (JWT or sessions)
- Add authorization checks
- Implement rate limiting
- Use HTTPS
- Add CSRF protection
- Sanitize user inputs
- Add logging and monitoring

## Future Enhancements

- User authentication and authorization
- Email notifications
- Group chat functionality
- Receipt image uploads
- Export data to CSV/PDF
- Multi-currency support
- Recurring expenses
- Mobile application
- Payment integration (Stripe, PayPal)
- Expense categories and analytics
- Search and filter functionality

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running

**Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Change PORT in .env or kill process using port 5000

### Frontend Issues

**API Connection Error**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Check for CORS errors in browser console

**Build Errors**
- Delete node_modules and package-lock.json
- Run `npm install` again

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created as part of CRED Engineering Design Assignment

## Acknowledgments

- Inspired by Splitwise
- Built with MERN stack
- Uses MongoDB for data persistence
- Implements efficient balance simplification algorithm
# Cred-Assignement
# Cred-Assignment
# Cred-Assignment
