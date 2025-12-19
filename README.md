# ContriPlz - Expense Sharing Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for splitting expenses between groups, inspired by Splitwise.

## Features

- 👥 **Group Management**: Create and manage expense groups
- 💰 **Expense Tracking**: Add and track expenses with multiple split types (equal, exact, percentage)
- ⚖️ **Balance Calculation**: Automatic balance calculation with debt simplification algorithm
- 💳 **Settlement**: Settle up balances between group members
- 🎨 **Theme Support**: Light and dark mode
- 👤 **Avatar Selection**: Personalize your profile with emoji avatars
- 📱 **Responsive Design**: Mobile-first design with hamburger navigation
- ✏️ **Edit/Delete**: Edit and delete expenses (only by creator)
- 🔐 **Authorization**: Secure expense management with user authorization

## Deployment Issue - IMPORTANT

### The Error You're Seeing

```
Error: The uri parameter to openUri() must be a string, got "undefined"
```

This error means the `MONGODB_URI` environment variable is not set in Vercel.

### How to Fix

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Add Environment Variables**:
   - Go to Settings → Environment Variables
   - Add the following variables:
     - **Name**: `MONGODB_URI`
     - **Value**: `mongodb+srv://arnavsao:arnavsao1924@cluster0.dkwoiff.mongodb.net/`
     - **Environment**: Production, Preview, Development (check all)
   
   - **Name**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: Production

3. **Redeploy**:
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

### Why This Happens

- Vercel doesn't have access to your local `.env` file
- Environment variables must be configured in Vercel's dashboard
- The backend code reads `process.env.MONGODB_URI`, which is undefined without proper configuration

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Cred-Assignment
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables:

Create `.env` in `backend` directory:
```env
PORT=5001
MONGODB_URI=mongodb+srv://arnavsao:arnavsao1924@cluster0.dkwoiff.mongodb.net/
NODE_ENV=development
```

4. Start servers:
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory - in new terminal)
npm start
```

Application available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React Toastify
- React Icons (Material Design)
- Context API
- CSS3 with Variables

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- CORS
- Express Validator

## API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups/user/:userId` - Get user's groups

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/group/:groupId` - Get group expenses
- `PUT /api/expenses/:id` - Update expense (creator only)
- `DELETE /api/expenses/:id` - Delete expense (creator only)

### Balances
- `GET /api/balances/user/:userId/group/:groupId` - Get user balance in group

### Settlements
- `POST /api/settlements` - Create settlement

## Key Features

### Balance Simplification
Uses greedy algorithm to minimize transactions (`backend/src/utils/balanceSimplifier.js`)

### Authorization
- Only expense creators can edit/delete
- Enforced at frontend (UI) and backend (API)

### Responsive Design
- Desktop: Fixed sidebar
- Mobile: Hamburger menu with drawer
- Breakpoints: 1024px, 768px, 480px

## License

MIT License

---

**Version**: 1.0.0  
**Last Updated**: December 2024
