# Expense Sharing Application - Features Documentation

## Overview
A comprehensive Splitwise-inspired expense sharing application with modern UI/UX, responsive design, and theme support.

## 🎨 UI/UX Features

### 1. **Theme Support (Light/Dark Mode)**
- Toggle between light and dark themes
- Theme preference saved to localStorage
- Smooth transitions between themes
- All components fully themed
- Access via Settings page

### 2. **Responsive Design**
- **Desktop**: Full sidebar navigation with all features visible
- **Tablet**: Collapsible sidebar with hamburger menu
- **Mobile**: Off-canvas navigation drawer
- Breakpoints:
  - Desktop: > 1024px
  - Tablet: 768px - 1024px
  - Mobile: < 768px

### 3. **Hamburger Navigation**
- Three-line animated hamburger icon
- Slide-in navigation drawer for mobile/tablet
- Backdrop overlay when menu is open
- Smooth animations
- Close button inside drawer

### 4. **Avatar System**
- 16 pre-defined emoji avatars
- Avatar selection in Settings
- Avatar displayed in navbar
- Persistent avatar storage
- Easy to customize

### 5. **Toast Notifications**
- Success toasts (green) for successful operations
- Error toasts (red) for failed operations
- Auto-dismiss after 3 seconds
- Non-intrusive, positioned at top-right
- Includes progress bar

## 📱 Core Features

### 1. **User Management**
- Create new users with name, email, and phone
- Select existing users to login
- User profile display with avatar
- User details in settings

### 2. **Group Management**
- Create groups with name and description
- Add multiple members to groups
- View all groups you're part of
- Select group to manage expenses
- Group categories (Apartment, House, Trip, Other)
- Member management

### 3. **Expense Management**
- Add expenses with description, amount, and category
- Three split types:
  - **Equal Split**: Divide equally among members
  - **Exact Amount**: Specify exact amounts per member
  - **Percentage**: Specify percentage for each member
- View all expenses in a group
- Delete expenses (with confirmation)
- Expense details include:
  - Who paid
  - Amount
  - Date
  - Category
  - Split breakdown

### 4. **Balance Tracking**
- Real-time balance calculations
- Net balance display (positive/negative)
- "You Owe" section showing debts
- "Owes You" section showing credits
- Total amounts for owes and owed
- Visual indicators with colors:
  - Green for positive balance
  - Red for negative balance

### 5. **Settlement System**
- Settle up individual debts
- Confirmation before settlement
- Automatic balance recalculation
- Settlement history tracking
- Success notifications

## ⚙️ Settings Features

### 1. **Profile Section**
- View current user information
- Display name, email, and phone
- Current avatar display

### 2. **Avatar Selection**
- Grid of 16 emoji avatars
- Visual selection indicator
- Instant update
- Success notification

### 3. **Theme Toggle**
- Light/Dark mode switch
- Visual toggle button
- Theme icon indicator (🌙/☀️)
- Instant theme switching

### 4. **Preferences**
- Currency selection (USD, EUR, GBP, INR)
- Additional settings expandable

### 5. **About Section**
- App version information
- Last updated date
- App description

## 🎯 User Experience Enhancements

### 1. **Loading States**
- Loading indicators for all async operations
- Skeleton screens for data fetching
- Smooth transitions

### 2. **Error Handling**
- Clear error messages
- Toast notifications for errors
- Error state displays
- Retry options

### 3. **Confirmation Dialogs**
- Confirm before deleting expenses
- Confirm before settling debts
- Prevent accidental actions

### 4. **Visual Feedback**
- Hover effects on interactive elements
- Active state indicators
- Smooth animations and transitions
- Color-coded information

### 5. **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Semantic HTML

## 📊 Technical Features

### 1. **State Management**
- React Context API for theme
- React Context API for user preferences
- Local state for component-specific data
- localStorage for persistence

### 2. **Responsive Grid System**
- CSS Grid for layouts
- Flexbox for components
- Mobile-first approach
- Breakpoint-based adjustments

### 3. **Performance**
- Optimized re-renders
- Lazy loading (ready to implement)
- Efficient API calls
- Minimal bundle size

### 4. **Code Organization**
- Component-based architecture
- Reusable components
- Separation of concerns
- Context providers

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "Cred Assignment"
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Configure environment**
- Backend runs on port 5001
- Frontend runs on port 3000
- MongoDB connection string in `backend/.env`

5. **Start the servers**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

6. **Access the application**
- Open browser to `http://localhost:3000`
- Create or select a user
- Start creating groups and adding expenses!

## 🎨 Design System

### Color Palette

**Light Theme:**
- Primary: #5BC5A7 (Teal green)
- Background: #F6F7FB
- Card Background: #FFFFFF
- Text: #1A1A1A
- Success: #4CAF50
- Error: #FF6B6B

**Dark Theme:**
- Primary: #5BC5A7 (Teal green)
- Background: #1A1A1A
- Card Background: #2A2A2A
- Text: #FFFFFF
- Success: #4CAF50
- Error: #FF6B6B

### Typography
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- Headings: 600 weight
- Body: 400 weight
- Small Text: 14px
- Regular Text: 16px
- Headings: 20px-32px

### Spacing
- Small: 8px
- Medium: 16px
- Large: 24px
- XL: 32px

### Border Radius
- Small: 6px
- Medium: 8px
- Large: 12px
- Circle: 50%

## 📝 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `GET /api/groups/:id` - Get group by ID
- `GET /api/groups/user/:userId` - Get user's groups
- `POST /api/groups/:id/members` - Add member
- `DELETE /api/groups/:id/members` - Remove member
- `DELETE /api/groups/:id` - Delete group

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get expense by ID
- `GET /api/expenses/group/:groupId` - Get group expenses
- `GET /api/expenses/user/:userId` - Get user expenses
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Balances
- `GET /api/balances` - Get all balances
- `GET /api/balances/group/:groupId` - Get group balances
- `GET /api/balances/user/:userId` - Get user balances
- `GET /api/balances/user/:userId/group/:groupId` - Get user balance in group

### Settlements
- `GET /api/settlements` - Get all settlements
- `POST /api/settlements` - Create settlement
- `GET /api/settlements/group/:groupId` - Get group settlements
- `GET /api/settlements/user/:userId` - Get user settlements
- `POST /api/settlements/group/:groupId/settle-all` - Settle all debts

## 🔮 Future Enhancements

1. **User Authentication**
   - JWT-based auth
   - Password protection
   - Email verification

2. **Advanced Features**
   - Receipt upload
   - Recurring expenses
   - Budget tracking
   - Expense categories with icons
   - Currency conversion
   - Export to CSV/PDF

3. **Social Features**
   - Activity feed
   - Notifications system
   - Comments on expenses
   - Group chat

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

5. **Analytics**
   - Spending trends
   - Category breakdowns
   - Monthly reports
   - Visualizations

## 📱 Mobile Responsiveness

### Mobile Navigation
- Hamburger menu in top-left
- Full-screen drawer
- Touch-friendly tap targets (minimum 44px)
- Swipe gestures (ready to implement)

### Mobile Layouts
- Single column layouts
- Stacked form fields
- Full-width buttons
- Optimized font sizes
- Reduced padding/margins

### Mobile Optimizations
- Touch events
- Viewport meta tag
- Disabled zoom on inputs
- Optimized images
- Reduced animations

## 🛠️ Development Tips

### Adding New Theme Colors
1. Add to both light and dark themes in `App.css`
2. Use CSS custom properties: `var(--your-color)`

### Creating New Components
1. Place in `src/components/`
2. Create accompanying CSS file
3. Import and use theme variables
4. Make responsive with media queries

### Testing Responsive Design
1. Use Chrome DevTools device toolbar
2. Test on actual devices
3. Check all breakpoints
4. Verify touch interactions

## 📄 License
MIT License

## 👥 Contributors
- Arnav Sao

## 📧 Support
For issues and questions, please create an issue in the repository.
