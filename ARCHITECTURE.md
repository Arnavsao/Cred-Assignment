# System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Browser                          │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API Calls
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      React Frontend                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages Layer                                              │  │
│  │  - UserSelection  - Dashboard                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components Layer                                         │  │
│  │  - GroupList      - CreateGroup    - AddExpense          │  │
│  │  - ExpenseList    - BalanceSheet                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services Layer                                           │  │
│  │  - API Client (Axios)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests (JSON)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Express.js Backend                            │
│                   http://localhost:5000                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                             │  │
│  │  /api/users  /api/groups  /api/expenses                  │  │
│  │  /api/balances  /api/settlements                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                         │  │
│  │  - CORS        - Body Parser    - Error Handler          │  │
│  │  - Validator                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controllers Layer                                        │  │
│  │  - userController      - groupController                 │  │
│  │  - expenseController   - balanceController               │  │
│  │  - settlementController                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                     │  │
│  │  - Balance Simplification Algorithm                       │  │
│  │  - Split Calculation Logic                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Models Layer (Mongoose ODM)                             │  │
│  │  - User    - Group    - Expense                          │  │
│  │  - Balance - Settlement                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Mongoose Queries
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      MongoDB Database                            │
│                  mongodb://localhost:27017                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Collections                                              │  │
│  │  - users          - groups        - expenses             │  │
│  │  - balances       - settlements                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Creating an Expense

```
User → React Component (AddExpense)
         ↓
     Validate Input
         ↓
     API Call (POST /api/expenses)
         ↓
Express Router → expenseController.createExpense()
         ↓
     Validate Request Body
         ↓
     Create Expense Document
         ↓
     Save to MongoDB
         ↓
     Trigger: updateGroupBalances()
         ↓
   ┌─────────────────────────────────────┐
   │  Balance Calculation Process        │
   │  1. Fetch all group expenses        │
   │  2. Calculate balances from expenses│
   │  3. Simplify using algorithm        │
   │  4. Delete old balance records      │
   │  5. Insert new simplified balances  │
   └─────────────────────────────────────┘
         ↓
     Return Success Response
         ↓
     React Component Updates UI
         ↓
     User Sees New Expense & Updated Balances
```

### 2. Balance Simplification Flow

```
Input: Raw Balances
┌─────────────────────────────────────┐
│ A owes B: $30                       │
│ A owes C: $20                       │
│ D owes B: $40                       │
│ D owes C: $10                       │
└─────────────────────────────────────┘
         ↓
Calculate Net Balances
┌─────────────────────────────────────┐
│ A: -$50 (debtor)                    │
│ B: +$70 (creditor)                  │
│ C: +$30 (creditor)                  │
│ D: -$50 (debtor)                    │
└─────────────────────────────────────┘
         ↓
Separate & Sort
┌─────────────────────────────────────┐
│ Creditors: [B: $70, C: $30]         │
│ Debtors:   [A: $50, D: $50]         │
└─────────────────────────────────────┘
         ↓
Greedy Matching
┌─────────────────────────────────────┐
│ Match B($70) with A($50)            │
│   → Transaction: A → B: $50         │
│   → Remaining: B($20), D($50)       │
│                                     │
│ Match C($30) with D($50)            │
│   → Transaction: D → C: $30         │
│   → Remaining: B($20), D($20)       │
│                                     │
│ Match B($20) with D($20)            │
│   → Transaction: D → B: $20         │
│   → Remaining: None                 │
└─────────────────────────────────────┘
         ↓
Output: Simplified Balances
┌─────────────────────────────────────┐
│ A → B: $50                          │
│ D → C: $30                          │
│ D → B: $20                          │
│                                     │
│ Total: 3 transactions               │
│ (vs 4 original debts)               │
└─────────────────────────────────────┘
```

### 3. User Journey: Complete Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. User Authentication                        │
│  User selects/creates account → Sets currentUser in state       │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    2. Group Management                           │
│  View Groups → Select Group OR Create New Group                 │
│  - Fetch user's groups                                          │
│  - Display group list                                           │
│  - Create group with members                                    │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    3. Expense Management                         │
│  Add Expense → Choose Split Type → Enter Details                │
│  - Equal: Auto-calculate splits                                 │
│  - Exact: Enter amounts per person                              │
│  - Percentage: Enter % per person                               │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    4. Balance Calculation                        │
│  Automatic on every expense add/delete                          │
│  - Calculate all debts                                          │
│  - Simplify transactions                                        │
│  - Update balance records                                       │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    5. View Balances                              │
│  Navigate to Balances Tab                                       │
│  - See who you owe                                              │
│  - See who owes you                                             │
│  - View net balance                                             │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    6. Settlement                                 │
│  Click "Settle Up" → Create Settlement Record                   │
│  - Record payment                                               │
│  - Update balances                                              │
│  - Show updated state                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

### Frontend Component Hierarchy

```
App
├── UserSelection (Page)
│   ├── User List
│   └── Create User Form
│
└── Dashboard (Page)
    ├── Navigation Bar
    │   ├── Groups
    │   ├── Create Group
    │   ├── Expenses (conditional)
    │   ├── Add Expense (conditional)
    │   └── Balances (conditional)
    │
    └── Main Content Area
        ├── GroupList (Component)
        │   └── Group Cards
        │
        ├── CreateGroup (Component)
        │   ├── Form Inputs
        │   └── Member Selection
        │
        ├── ExpenseList (Component)
        │   └── Expense Cards
        │       ├── Expense Details
        │       └── Delete Button
        │
        ├── AddExpense (Component)
        │   ├── Basic Info Form
        │   ├── Split Type Selector
        │   └── Split Details (conditional)
        │       ├── Equal (auto)
        │       ├── Exact (manual amounts)
        │       └── Percentage (manual %)
        │
        └── BalanceSheet (Component)
            ├── Net Balance Summary
            ├── You Owe Section
            │   └── Settle Up Buttons
            └── Owes You Section
```

## Database Schema Relationships

```
┌──────────────┐
│    User      │
│──────────────│
│ _id          │◄─────┐
│ name         │      │
│ email        │      │
│ phone        │      │
│ groups[]     │──┐   │
└──────────────┘  │   │
                  │   │
                  │   │
┌──────────────┐  │   │         ┌──────────────┐
│    Group     │◄─┘   │         │   Expense    │
│──────────────│      │         │──────────────│
│ _id          │──────┼────────►│ _id          │
│ name         │      │         │ description  │
│ description  │      │         │ amount       │
│ members[]    │──────┘         │ paidBy       │──┐
│ createdBy    │──────┐         │ group        │  │
│ expenses[]   │◄─────┼─────────│ splitType    │  │
└──────────────┘      │         │ splits[]     │  │
                      │         │ date         │  │
                      │         └──────────────┘  │
                      │                           │
                      │                           │
┌──────────────┐      │         ┌──────────────┐ │
│   Balance    │      │         │  Settlement  │ │
│──────────────│      │         │──────────────│ │
│ _id          │      │         │ _id          │ │
│ group        │◄─────┘         │ group        │ │
│ user         │──────┐         │ paidBy       │◄┘
│ owesTo       │◄─────┘         │ paidTo       │
│ amount       │                │ amount       │
└──────────────┘                │ date         │
                                │ note         │
                                └──────────────┘

Relationships:
─────► : One-to-Many
◄────► : Many-to-Many
```

## API Request/Response Flow

```
Client Request
     ↓
┌─────────────────────────────────────┐
│  Express Middleware Chain           │
│  1. CORS                            │
│  2. Body Parser (JSON)              │
│  3. Request Logger (optional)       │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Route Handler                      │
│  - Match URL pattern                │
│  - Match HTTP method                │
│  - Extract params                   │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Validation Middleware (optional)   │
│  - Validate request body            │
│  - Validate parameters              │
│  - Return 400 if invalid            │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Controller Function                │
│  - Extract data from request        │
│  - Call business logic              │
│  - Interact with database           │
│  - Format response                  │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Error Handling                     │
│  - Catch errors                     │
│  - Format error response            │
│  - Log errors                       │
│  - Return appropriate status        │
└────────────┬────────────────────────┘
             ↓
Client Response (JSON)
```

## State Management Flow (Frontend)

```
Component Mount
     ↓
useEffect Hook Triggered
     ↓
Fetch Data from API
     ↓
┌─────────────────────────────────────┐
│  Update Local State                 │
│  useState hook stores:              │
│  - Data (array/object)              │
│  - Loading (boolean)                │
│  - Error (string/null)              │
└────────────┬────────────────────────┘
             ↓
Component Re-renders
     ↓
Display Updated UI
     ↓
User Interaction (e.g., form submit)
     ↓
Event Handler Called
     ↓
API Call Made
     ↓
Response Received
     ↓
State Updated (via setState)
     ↓
Parent Component Notified (via callback)
     ↓
Parent Re-fetches Data
     ↓
Cascade Update to Child Components
```

## Security & Validation Flow

```
User Input
     ↓
┌─────────────────────────────────────┐
│  Frontend Validation                │
│  - Required fields                  │
│  - Format validation                │
│  - Type checking                    │
│  - Range validation                 │
└────────────┬────────────────────────┘
             ↓ (if valid)
     API Request
             ↓
┌─────────────────────────────────────┐
│  Express Validator Middleware       │
│  - Schema validation                │
│  - Data sanitization                │
│  - Custom validators                │
└────────────┬────────────────────────┘
             ↓ (if valid)
┌─────────────────────────────────────┐
│  Controller Validation              │
│  - Business logic validation        │
│  - Database constraints check       │
│  - Relationship validation          │
└────────────┬────────────────────────┘
             ↓ (if valid)
┌─────────────────────────────────────┐
│  Mongoose Schema Validation         │
│  - Type checking                    │
│  - Required fields                  │
│  - Custom validators                │
│  - Pre-save hooks                   │
└────────────┬────────────────────────┘
             ↓ (if valid)
     Database Write
             ↓
     Success Response

(Any validation failure returns 400 error)
```

## Deployment Architecture (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Load Balancer                            │
│                        (nginx/AWS ELB)                           │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
┌───────────────┐   ┌───────────────┐
│  App Server 1 │   │  App Server 2 │
│  (Node.js)    │   │  (Node.js)    │
└───────┬───────┘   └───────┬───────┘
        │                   │
        └────────┬──────────┘
                 ↓
        ┌─────────────────┐
        │  Redis Cache    │
        │  (Sessions)     │
        └─────────────────┘
                 │
                 ↓
    ┌─────────────────────────┐
    │  MongoDB Replica Set    │
    │  ┌─────────┐            │
    │  │ Primary │            │
    │  └────┬────┘            │
    │       │                 │
    │  ┌────┴────┬────────┐  │
    │  │         │        │  │
    │  ↓         ↓        ↓  │
    │  S1       S2       S3  │
    │  (Secondary Replicas)  │
    └─────────────────────────┘
```

## Performance Optimization Points

1. **Database Level**
   - Indexes on frequently queried fields
   - Compound indexes for complex queries
   - Lean queries (no Mongoose overhead)
   - Connection pooling

2. **Application Level**
   - Async/await for non-blocking I/O
   - Batch operations (insertMany vs multiple inserts)
   - Caching frequently accessed data
   - Pagination for large datasets

3. **Frontend Level**
   - Component memoization (React.memo)
   - Lazy loading routes
   - Debouncing user inputs
   - Optimistic UI updates

4. **Network Level**
   - Compression (gzip)
   - CDN for static assets
   - HTTP/2
   - Minimize payload size

This architecture provides a solid foundation that can scale from development to production with appropriate modifications.
