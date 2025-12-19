# API Testing Examples

This document provides sample API requests for testing all endpoints. You can use tools like Postman, curl, or any HTTP client.

## Base URL
```
http://localhost:5000/api
```

## 1. User APIs

### Create User
```bash
POST /users
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890"
}
```

### Get All Users
```bash
GET /users
```

### Get User by ID
```bash
GET /users/:userId
```

### Update User
```bash
PUT /users/:userId
Content-Type: application/json

{
  "name": "Alice Smith",
  "phone": "+1234567891"
}
```

### Delete User
```bash
DELETE /users/:userId
```

## 2. Group APIs

### Create Group
```bash
POST /groups
Content-Type: application/json

{
  "name": "Vacation Trip",
  "description": "Summer vacation expenses",
  "members": ["userId1", "userId2", "userId3"],
  "createdBy": "userId1"
}
```

### Get All Groups
```bash
GET /groups
```

### Get Group by ID
```bash
GET /groups/:groupId
```

### Get User's Groups
```bash
GET /groups/user/:userId
```

### Add Member to Group
```bash
POST /groups/:groupId/members
Content-Type: application/json

{
  "userId": "userId4"
}
```

### Remove Member from Group
```bash
DELETE /groups/:groupId/members
Content-Type: application/json

{
  "userId": "userId4"
}
```

### Delete Group
```bash
DELETE /groups/:groupId
```

## 3. Expense APIs

### Create Expense - Equal Split
```bash
POST /expenses
Content-Type: application/json

{
  "description": "Dinner at restaurant",
  "amount": 120.00,
  "paidBy": "userId1",
  "group": "groupId",
  "splitType": "EQUAL",
  "category": "Food",
  "splits": [
    { "user": "userId1", "amount": 0 },
    { "user": "userId2", "amount": 0 },
    { "user": "userId3", "amount": 0 }
  ]
}
```

### Create Expense - Exact Split
```bash
POST /expenses
Content-Type: application/json

{
  "description": "Shopping",
  "amount": 150.00,
  "paidBy": "userId1",
  "group": "groupId",
  "splitType": "EXACT",
  "category": "Shopping",
  "splits": [
    { "user": "userId1", "amount": 50.00 },
    { "user": "userId2", "amount": 75.00 },
    { "user": "userId3", "amount": 25.00 }
  ]
}
```

### Create Expense - Percentage Split
```bash
POST /expenses
Content-Type: application/json

{
  "description": "Hotel booking",
  "amount": 300.00,
  "paidBy": "userId2",
  "group": "groupId",
  "splitType": "PERCENTAGE",
  "category": "Accommodation",
  "splits": [
    { "user": "userId1", "percentage": 40 },
    { "user": "userId2", "percentage": 35 },
    { "user": "userId3", "percentage": 25 }
  ]
}
```

### Get All Expenses
```bash
GET /expenses
```

### Get Expense by ID
```bash
GET /expenses/:expenseId
```

### Get Expenses by Group
```bash
GET /expenses/group/:groupId
```

### Get Expenses by User
```bash
GET /expenses/user/:userId
```

### Update Expense
```bash
PUT /expenses/:expenseId
Content-Type: application/json

{
  "description": "Updated description",
  "category": "Updated category"
}
```

### Delete Expense
```bash
DELETE /expenses/:expenseId
```

## 4. Balance APIs

### Get All Balances
```bash
GET /balances
```

### Get Balances by Group
```bash
GET /balances/group/:groupId
```

### Get Balances by User
```bash
GET /balances/user/:userId
```

### Get User Balance in Specific Group
```bash
GET /balances/user/:userId/group/:groupId
```

## 5. Settlement APIs

### Create Settlement
```bash
POST /settlements
Content-Type: application/json

{
  "group": "groupId",
  "paidBy": "userId2",
  "paidTo": "userId1",
  "amount": 50.00,
  "note": "Settling dinner expenses"
}
```

### Get All Settlements
```bash
GET /settlements
```

### Get Settlements by Group
```bash
GET /settlements/group/:groupId
```

### Get Settlements by User
```bash
GET /settlements/user/:userId
```

### Settle All Balances in Group
```bash
POST /settlements/group/:groupId/settle-all
```

## Complete Test Scenario

Here's a complete workflow for testing:

### Step 1: Create Users
```bash
# Create User 1
POST /users
{
  "name": "Alice",
  "email": "alice@test.com"
}
# Save returned userId as USER1_ID

# Create User 2
POST /users
{
  "name": "Bob",
  "email": "bob@test.com"
}
# Save returned userId as USER2_ID

# Create User 3
POST /users
{
  "name": "Carol",
  "email": "carol@test.com"
}
# Save returned userId as USER3_ID
```

### Step 2: Create Group
```bash
POST /groups
{
  "name": "Roommates",
  "description": "Shared apartment expenses",
  "members": ["USER1_ID", "USER2_ID", "USER3_ID"],
  "createdBy": "USER1_ID"
}
# Save returned groupId as GROUP_ID
```

### Step 3: Add Expenses

```bash
# Expense 1: Alice pays for groceries - Equal Split
POST /expenses
{
  "description": "Groceries",
  "amount": 90.00,
  "paidBy": "USER1_ID",
  "group": "GROUP_ID",
  "splitType": "EQUAL",
  "category": "Food",
  "splits": [
    { "user": "USER1_ID", "amount": 0 },
    { "user": "USER2_ID", "amount": 0 },
    { "user": "USER3_ID", "amount": 0 }
  ]
}
# Each person owes $30

# Expense 2: Bob pays for utilities - Exact Split
POST /expenses
{
  "description": "Electricity & Water",
  "amount": 120.00,
  "paidBy": "USER2_ID",
  "group": "GROUP_ID",
  "splitType": "EXACT",
  "category": "Utilities",
  "splits": [
    { "user": "USER1_ID", "amount": 40.00 },
    { "user": "USER2_ID", "amount": 40.00 },
    { "user": "USER3_ID", "amount": 40.00 }
  ]
}

# Expense 3: Carol pays for internet - Percentage Split
POST /expenses
{
  "description": "Internet Bill",
  "amount": 60.00,
  "paidBy": "USER3_ID",
  "group": "GROUP_ID",
  "splitType": "PERCENTAGE",
  "category": "Utilities",
  "splits": [
    { "user": "USER1_ID", "percentage": 33.33 },
    { "user": "USER2_ID", "percentage": 33.33 },
    { "user": "USER3_ID", "percentage": 33.34 }
  ]
}
```

### Step 4: Check Balances
```bash
# Get Alice's balance
GET /balances/user/USER1_ID/group/GROUP_ID

# Expected result:
# - Alice owes Bob: $40 (from utilities)
# - Alice owes Carol: $20 (from internet)
# - Bob owes Alice: $30 (from groceries)
# - Carol owes Alice: $30 (from groceries)
#
# Simplified:
# - Alice owes Bob: $10
# - Alice owes Carol: $20
# - Carol owes Alice: $10 (net: Alice owes Carol $10)
```

### Step 5: Settle Balances
```bash
# Alice settles with Bob
POST /settlements
{
  "group": "GROUP_ID",
  "paidBy": "USER1_ID",
  "paidTo": "USER2_ID",
  "amount": 10.00,
  "note": "Settling up"
}

# Alice settles with Carol
POST /settlements
{
  "group": "GROUP_ID",
  "paidBy": "USER1_ID",
  "paidTo": "USER3_ID",
  "amount": 10.00,
  "note": "Settling up"
}
```

### Step 6: Verify Settlement
```bash
# Check Alice's balance again
GET /balances/user/USER1_ID/group/GROUP_ID

# Should show all settled (no balances)
```

## Error Cases to Test

### 1. Invalid Split - Exact Not Matching Total
```bash
POST /expenses
{
  "description": "Test",
  "amount": 100.00,
  "paidBy": "USER1_ID",
  "group": "GROUP_ID",
  "splitType": "EXACT",
  "splits": [
    { "user": "USER1_ID", "amount": 30.00 },
    { "user": "USER2_ID", "amount": 30.00 }
  ]
}
# Expected: 400 Error - Sum must equal total
```

### 2. Invalid Split - Percentage Not 100%
```bash
POST /expenses
{
  "description": "Test",
  "amount": 100.00,
  "paidBy": "USER1_ID",
  "group": "GROUP_ID",
  "splitType": "PERCENTAGE",
  "splits": [
    { "user": "USER1_ID", "percentage": 50 },
    { "user": "USER2_ID", "percentage": 30 }
  ]
}
# Expected: 400 Error - Percentages must sum to 100
```

### 3. Group with Less Than 2 Members
```bash
POST /groups
{
  "name": "Solo Group",
  "members": ["USER1_ID"],
  "createdBy": "USER1_ID"
}
# Expected: 400 Error - Minimum 2 members required
```

### 4. Duplicate Email
```bash
POST /users
{
  "name": "Alice Duplicate",
  "email": "alice@test.com"
}
# Expected: 400 Error - Email already exists
```

### 5. Settlement More Than Owed
```bash
POST /settlements
{
  "group": "GROUP_ID",
  "paidBy": "USER2_ID",
  "paidTo": "USER1_ID",
  "amount": 1000.00
}
# Expected: 400 Error - Amount exceeds owed balance
```

## Using cURL

### Example cURL Commands

```bash
# Create User
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }'

# Get All Users
curl http://localhost:5000/api/users

# Create Group
curl -X POST http://localhost:5000/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Group",
    "members": ["USER_ID_1", "USER_ID_2"],
    "createdBy": "USER_ID_1"
  }'

# Create Equal Split Expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Lunch",
    "amount": 60.00,
    "paidBy": "USER_ID_1",
    "group": "GROUP_ID",
    "splitType": "EQUAL",
    "splits": [
      {"user": "USER_ID_1", "amount": 0},
      {"user": "USER_ID_2", "amount": 0}
    ]
  }'

# Get Balances
curl http://localhost:5000/api/balances/user/USER_ID_1

# Create Settlement
curl -X POST http://localhost:5000/api/settlements \
  -H "Content-Type: application/json" \
  -d '{
    "group": "GROUP_ID",
    "paidBy": "USER_ID_2",
    "paidTo": "USER_ID_1",
    "amount": 30.00
  }'
```

## Response Examples

### Successful User Creation
```json
{
  "success": true,
  "data": {
    "_id": "6589a1b2c3d4e5f6a7b8c9d0",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+1234567890",
    "groups": [],
    "createdAt": "2024-12-25T10:30:00.000Z",
    "updatedAt": "2024-12-25T10:30:00.000Z"
  }
}
```

### Balance Response
```json
{
  "success": true,
  "data": {
    "group": "Vacation Trip",
    "owes": [
      {
        "_id": "6589a1b2c3d4e5f6a7b8c9d1",
        "owesTo": {
          "_id": "6589a1b2c3d4e5f6a7b8c9d2",
          "name": "Bob",
          "email": "bob@example.com"
        },
        "amount": 45.50
      }
    ],
    "owed": [
      {
        "_id": "6589a1b2c3d4e5f6a7b8c9d3",
        "user": {
          "_id": "6589a1b2c3d4e5f6a7b8c9d4",
          "name": "Carol",
          "email": "carol@example.com"
        },
        "amount": 30.00
      }
    ],
    "summary": {
      "totalOwes": 45.50,
      "totalOwed": 30.00,
      "netBalance": -15.50
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Sum of exact splits must equal total amount"
}
```

## Postman Collection

You can import these requests into Postman as a collection. Create environment variables:
- `baseUrl`: `http://localhost:5000/api`
- `userId1`, `userId2`, `userId3`: Store created user IDs
- `groupId`: Store created group ID

This allows you to easily test all endpoints and chain requests together.
