# Design Document: Expense Sharing Application

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Data Models](#data-models)
4. [API Design](#api-design)
5. [Balance Simplification Algorithm](#balance-simplification-algorithm)
6. [Edge Cases](#edge-cases)
7. [Design Decisions](#design-decisions)

## System Overview

### Purpose
A simplified expense sharing application that allows users to track shared expenses within groups, calculate balances, and settle dues efficiently.

### Key Requirements
- Support for multiple users and groups
- Three types of expense splits: Equal, Exact, and Percentage
- Automated balance calculation with simplification
- Settlement tracking
- Clean and intuitive user interface

### Technology Choices

**Backend: Node.js + Express.js**
- Asynchronous and event-driven
- Large ecosystem of packages
- JavaScript consistency across stack
- Good for I/O intensive operations

**Database: MongoDB**
- Flexible schema for evolving requirements
- Good performance for read-heavy operations
- Native JSON support
- Easy to scale horizontally

**Frontend: React**
- Component-based architecture
- Virtual DOM for performance
- Large community and ecosystem
- Easy state management

## Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (React Frontend)                │
│  - Components                           │
│  - State Management                     │
│  - API Integration                      │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────┐
│         Application Layer               │
│         (Express.js Backend)            │
│  - Routes                               │
│  - Controllers                          │
│  - Business Logic                       │
│  - Validation                           │
└────────────────┬────────────────────────┘
                 │ Mongoose ODM
┌────────────────▼────────────────────────┐
│         Data Layer                      │
│         (MongoDB)                       │
│  - Collections                          │
│  - Indexes                              │
│  - Relationships                        │
└─────────────────────────────────────────┘
```

### Component Relationships

```
User ←→ Group ←→ Expense
  ↓       ↓        ↓
  └───→ Balance ←──┘
          ↓
     Settlement
```

## Data Models

### 1. User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (optional),
  groups: [ObjectId (ref: Group)],
  timestamps: { createdAt, updatedAt }
}
```

**Indexes:**
- `email`: Unique index for fast lookups
- `_id`: Default index

### 2. Group Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (optional),
  members: [ObjectId (ref: User)] (min: 2),
  createdBy: ObjectId (ref: User),
  expenses: [ObjectId (ref: Expense)],
  timestamps: { createdAt, updatedAt }
}
```

**Indexes:**
- `members`: Multi-key index for member queries
- `createdBy`: Index for creator queries

**Validation:**
- Minimum 2 members required
- All members must exist as users

### 3. Expense Model
```javascript
{
  _id: ObjectId,
  description: String (required),
  amount: Number (required, positive),
  paidBy: ObjectId (ref: User),
  group: ObjectId (ref: Group),
  splitType: Enum ['EQUAL', 'EXACT', 'PERCENTAGE'],
  splits: [{
    user: ObjectId (ref: User),
    amount: Number,
    percentage: Number
  }],
  date: Date (default: now),
  category: String (default: 'General'),
  timestamps: { createdAt, updatedAt }
}
```

**Indexes:**
- `group`: Index for group queries
- `paidBy`: Index for user queries
- `date`: Index for chronological queries

**Validation:**
- EQUAL: Amounts calculated automatically
- EXACT: Sum of splits must equal total amount
- PERCENTAGE: Percentages must sum to 100%

### 4. Balance Model
```javascript
{
  _id: ObjectId,
  group: ObjectId (ref: Group),
  user: ObjectId (ref: User),
  owesTo: ObjectId (ref: User),
  amount: Number (positive),
  timestamps: { createdAt, updatedAt }
}
```

**Indexes:**
- Compound index: `{group, user, owesTo}` (unique)
- `group`: Index for group queries
- `user`: Index for user queries

**Validation:**
- User cannot owe themselves
- Amount must be positive

### 5. Settlement Model
```javascript
{
  _id: ObjectId,
  group: ObjectId (ref: Group),
  paidBy: ObjectId (ref: User),
  paidTo: ObjectId (ref: User),
  amount: Number (positive),
  date: Date (default: now),
  note: String (optional),
  timestamps: { createdAt, updatedAt }
}
```

**Indexes:**
- `group`: Index for group queries
- Compound index: `{paidBy, paidTo}`

## API Design

### RESTful Principles
- Resources identified by URLs
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- JSON data format

### Response Format
```javascript
// Success
{
  success: true,
  data: { ... },
  count: 10 // for list endpoints
}

// Error
{
  success: false,
  message: "Error description",
  errors: [ ... ] // for validation errors
}
```

### Endpoint Design Philosophy
- **Noun-based URLs**: `/api/users` not `/api/getUsers`
- **Hierarchical structure**: `/api/groups/:id/members`
- **Query parameters**: For filtering and pagination
- **HTTP status codes**: Proper use of 200, 201, 400, 404, 500

## Balance Simplification Algorithm

### Problem Statement
When multiple expenses occur in a group, users accumulate debts to each other. Without simplification, the number of transactions can become large (up to n² for n users). Our goal is to minimize the number of transactions needed to settle all debts.

### Algorithm: Greedy Creditor-Debtor Matching

#### Step 1: Calculate Net Balances
For each user, calculate their net balance:
```
net_balance = (total money owed to user) - (total money user owes)
```

**Example:**
```
Alice paid $100, Bob owes Alice $50, Carol owes Alice $50
Alice's net balance: +$100
Bob's net balance: -$50
Carol's net balance: -$50
```

#### Step 2: Separate Creditors and Debtors
```javascript
creditors = users with positive net balance
debtors = users with negative net balance (use absolute value)
```

#### Step 3: Greedy Matching
```
Sort creditors and debtors in descending order
While creditors and debtors exist:
  Match largest creditor with largest debtor
  transaction_amount = min(creditor.amount, debtor.amount)
  Create transaction: debtor → creditor for transaction_amount
  Reduce both amounts by transaction_amount
  Remove any with zero balance
```

#### Complexity Analysis
- **Time Complexity**: O(n log n) for sorting + O(n) for matching = O(n log n)
- **Space Complexity**: O(n) for storing balances
- **Transaction Count**: At most (n-1) transactions for n users

#### Example Walkthrough

**Scenario:** 4 people sharing expenses
```
Initial Balances (from expenses):
A owes B: $30
A owes C: $20
D owes B: $40
D owes C: $10
```

**Step 1: Calculate Net Balances**
```
A: -(30+20) = -50 (debtor)
B: +(30+40) = +70 (creditor)
C: +(20+10) = +30 (creditor)
D: -(40+10) = -50 (debtor)
```

**Step 2: Sort**
```
Creditors: [B: 70, C: 30]
Debtors: [A: 50, D: 50]
```

**Step 3: Match**
```
1. Match B(70) with A(50)
   Transaction: A → B: $50
   Remaining: B(20), C(30), D(50)

2. Match C(30) with D(50)
   Transaction: D → C: $30
   Remaining: B(20), D(20)

3. Match B(20) with D(20)
   Transaction: D → B: $20
   Remaining: none
```

**Result:** 3 transactions instead of 4 original debts

### Why This Algorithm Works
1. **Optimal or Near-Optimal**: Greedy approach produces minimal or near-minimal transactions
2. **Efficient**: O(n log n) is fast even for large groups
3. **Simple to Implement**: Clear logic, easy to test and debug
4. **Predictable**: Always produces same result for same input

### Alternative Approaches Considered

**1. Graph-based Min-Cost Flow**
- More optimal but complex (O(n³))
- Overkill for typical group sizes
- Harder to implement and maintain

**2. Iterative Cancellation**
- Cancel opposing debts iteratively
- Can be slow for complex graphs
- May not find minimal solution

## Edge Cases

### 1. Floating Point Precision
**Problem:** JavaScript floating point arithmetic can cause precision errors
```javascript
0.1 + 0.2 === 0.3 // false!
```

**Solution:**
- Use threshold of 0.01 for comparisons
- Round to 2 decimal places
- Store amounts as numbers, not cents

### 2. Circular Dependencies
**Scenario:** A owes B, B owes C, C owes A

**Solution:**
- Balance simplification automatically resolves circles
- Net balance calculation eliminates circular debts

### 3. Self-Payment in Splits
**Scenario:** User pays for an expense but is also in the split

**Solution:**
- Allow user to be both payer and recipient
- Skip creating balance when user pays for themselves
- Calculate their share like any other member

### 4. Zero or Negative Amounts
**Problem:** Invalid expense amounts

**Solution:**
- Validation: Amount must be > 0
- Split amounts must be non-negative
- Balances with amount < 0.01 are ignored

### 5. Split Validation Failures
**EQUAL:** No validation needed (auto-calculated)

**EXACT:** Sum must equal total
```javascript
if (Math.abs(sum_of_splits - total_amount) > 0.01) {
  throw ValidationError
}
```

**PERCENTAGE:** Sum must equal 100%
```javascript
if (Math.abs(sum_of_percentages - 100) > 0.01) {
  throw ValidationError
}
```

### 6. Group Member Changes
**Adding Member:**
- No impact on existing balances
- New member can be added to future expenses

**Removing Member:**
- Check for unsettled balances
- Prevent removal if balances exist
- Allow removal after settlement

### 7. Expense Deletion
**Problem:** Deleting expense affects existing balances

**Solution:**
- Recalculate all balances from scratch
- Delete old balance records
- Create new simplified balances
- Maintains data consistency

### 8. Concurrent Updates
**Problem:** Multiple users adding expenses simultaneously

**Solution:**
- MongoDB atomic operations
- Balance recalculation is idempotent
- Eventual consistency acceptable for this use case

## Design Decisions

### 1. Embedded vs Referenced Documents

**Decision:** Use references (ObjectIds) for relationships

**Rationale:**
- Groups can have many members (unbounded array)
- Expenses can grow large over time
- Users belong to multiple groups
- References prevent document size limits
- Easier to query and update independently

**Trade-off:** Additional database queries (mitigated by `.populate()`)

### 2. Real-time Balance Calculation

**Decision:** Recalculate balances on every expense change

**Rationale:**
- Ensures consistency
- Avoids drift from incremental updates
- Simplification algorithm needs full view
- Performance acceptable for typical group sizes

**Alternative Considered:** Incremental updates (rejected due to complexity)

### 3. Settlement as Separate Model

**Decision:** Track settlements separately, don't modify expenses

**Rationale:**
- Preserves expense history
- Allows settlement audit trail
- Can reverse settlements if needed
- Clear separation of concerns

**Alternative Considered:** Mark expenses as "settled" (rejected - less flexible)

### 4. Client-Side State Management

**Decision:** Minimal state management, rely on API calls

**Rationale:**
- Simpler implementation
- Avoids sync issues
- Refresh-based updates acceptable
- Can add Redux/Context later if needed

**Trade-off:** More API calls (acceptable for this scale)

### 5. Split Type Validation Location

**Decision:** Validate splits in Mongoose pre-save hook

**Rationale:**
- Centralized validation logic
- Works regardless of how data is created
- Prevents invalid data at database level
- Clear error messages

**Location:** `backend/src/models/Expense.js:pre('save')`

### 6. Authentication Strategy

**Decision:** Not implemented in MVP

**Rationale:**
- Focus on core functionality first
- User selection simulates authentication
- Easy to add JWT/sessions later
- Keeps initial implementation simple

**Production Need:** Must add before deployment

### 7. Error Handling Approach

**Decision:** Centralized error handling middleware

**Rationale:**
- Consistent error responses
- Separates error handling from business logic
- Easier to log and monitor
- Prevents exposing sensitive info

**Location:** `backend/src/middleware/errorHandler.js`

### 8. Frontend Component Structure

**Decision:** Feature-based component organization

**Rationale:**
- Components grouped by functionality
- Pages compose components
- Services layer for API calls
- Clear separation of concerns

```
components/ - Reusable UI components
pages/ - Route-level components
services/ - API integration
utils/ - Helper functions
```

### 9. CSS Approach

**Decision:** Plain CSS with component-scoped classes

**Rationale:**
- No additional dependencies
- Fast implementation
- Sufficient for MVP
- Can migrate to CSS-in-JS/Tailwind later

**Trade-off:** Global namespace (managed with BEM-like naming)

### 10. Database Indexing Strategy

**Decision:** Index all foreign keys and frequently queried fields

**Indexes Created:**
- User: email (unique)
- Group: members, createdBy
- Expense: group, paidBy, date
- Balance: compound (group, user, owesTo)

**Rationale:**
- Optimize common queries
- Prevent full collection scans
- Balance index ensures uniqueness
- Email index enables fast lookups

## Performance Considerations

### Backend Optimizations
1. **Populate Only Required Fields**
   ```javascript
   .populate('members', 'name email') // Not all fields
   ```

2. **Batch Operations**
   ```javascript
   Balance.insertMany(balances) // Not individual inserts
   ```

3. **Async/Await Pattern**
   - Non-blocking I/O
   - Proper error handling
   - Clean code structure

### Frontend Optimizations
1. **Component Memoization** (Future)
   - React.memo for expensive components
   - useMemo for calculated values

2. **Lazy Loading** (Future)
   - Code splitting with React.lazy
   - Load routes on demand

3. **Debouncing** (Future)
   - Search inputs
   - Form validation

## Scalability Considerations

### Current Limitations
- Single server instance
- No caching layer
- Synchronous balance calculations

### Scale-up Path
1. **Application Layer**
   - Horizontal scaling with load balancer
   - Stateless API servers
   - Session management with Redis

2. **Database Layer**
   - MongoDB replica set for HA
   - Read replicas for queries
   - Sharding by group_id

3. **Caching Layer**
   - Redis for balances
   - Cache invalidation on updates
   - Session storage

4. **Async Processing**
   - Message queue for balance calculations
   - Background workers
   - Webhooks for notifications

## Testing Strategy

### Unit Tests (Recommended)
- Model validation
- Balance simplification algorithm
- Split calculation logic
- Helper functions

### Integration Tests (Recommended)
- API endpoints
- Database operations
- Error handling

### E2E Tests (Recommended)
- User workflows
- Component interactions
- Full application flows

### Manual Testing (Provided in README)
- User scenarios
- Edge cases
- UI/UX validation

## Security Considerations

### Current Implementation
- Input validation
- MongoDB injection prevention
- Error message sanitization

### Production Requirements
- Authentication (JWT/OAuth)
- Authorization middleware
- Rate limiting
- HTTPS enforcement
- CSRF protection
- Input sanitization
- Audit logging
- Secrets management

## Conclusion

This design provides a solid foundation for an expense sharing application with:
- Clean separation of concerns
- Efficient algorithms
- Comprehensive edge case handling
- Clear path to production
- Room for future enhancements

The architecture balances simplicity with functionality, making it maintainable and extensible.
