# 🔐 Authentication System - QuickJuice

## ✅ What's Been Created

### 1. **Login Page** (`/login`)
A fully functional login page with:
- ✅ Email and password fields with validation
- ✅ Show/hide password toggle
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Loading states during authentication
- ✅ Error handling with toast notifications
- ✅ **Quick Demo Login Buttons**:
  - Demo User (customer role)
  - Demo Admin (admin role)
- ✅ Redirect to appropriate page based on user role:
  - Admin → `/admin`
  - Rider → `/rider`
  - Customer → Previous page or home
- ✅ Beautiful gradient background
- ✅ Mobile responsive design
- ✅ Integration with backend `/api/auth/login`

### 2. **Signup Page** (`/signup`)
A complete registration page with:
- ✅ Full name field
- ✅ Email address field
- ✅ Phone number field
- ✅ Password field with show/hide toggle
- ✅ Confirm password field
- ✅ Password matching validation
- ✅ Minimum 6 character password requirement
- ✅ Terms of service agreement checkbox
- ✅ Loading states during registration
- ✅ Error handling with toast notifications
- ✅ Auto-login after successful signup
- ✅ Integration with backend `/api/auth/signup`

### 3. **Auth API Module** (`src/api/auth.api.js`)
Complete authentication API integration:
- ✅ `login()` - User authentication
- ✅ `signup()` - User registration
- ✅ `logout()` - User logout
- ✅ `refreshToken()` - Token refresh
- ✅ `getMe()` - Get current user
- ✅ `updateProfile()` - Update user profile
- ✅ `forgotPassword()` - Password reset request
- ✅ `resetPassword()` - Password reset completion

### 4. **Updated App.jsx**
- ✅ Added `/login` and `/signup` routes
- ✅ Conditional rendering of Navbar/Footer (hidden on auth pages)
- ✅ Clean, full-page auth experience

### 5. **Auth Store Integration**
Both pages integrate with the existing Zustand auth store:
- ✅ Saves user data to store
- ✅ Saves tokens (access + refresh)
- ✅ Persists to localStorage
- ✅ Updates app-wide authentication state

## 🚀 How to Use

### For Users:
1. **Login**: Visit http://localhost:5173/login
2. **Signup**: Visit http://localhost:5173/signup
3. **Quick Demo**: Click "Demo User" or "Demo Admin" buttons on login page

### Demo Credentials (from backend .env):
```
Admin Account:
Email: admin@quickjuice.com
Password: Admin@123

Customer Account (if created):
Email: demo@example.com
Password: Demo@123
```

## 🔗 Backend Integration

### Login Flow:
1. User enters email/password
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend returns: `{ user, token, refreshToken }`
5. Frontend saves to auth store
6. User redirected based on role

### Signup Flow:
1. User fills registration form
2. Frontend validates passwords match
3. Frontend sends POST to `/api/auth/signup`
4. Backend creates user account
5. Backend returns: `{ user, token, refreshToken }`
6. Frontend auto-logs in user
7. User redirected to home page

## 🎨 Features

### User Experience:
- ✅ Beautiful gradient backgrounds
- ✅ Smooth animations with Framer Motion
- ✅ Lucide React icons
- ✅ Toast notifications for feedback
- ✅ Loading states with spinners
- ✅ Form validation
- ✅ Show/hide password toggles
- ✅ Mobile responsive

### Security:
- ✅ Password validation (min 6 chars)
- ✅ Password confirmation matching
- ✅ Secure token storage
- ✅ Auto token refresh on 401 errors
- ✅ HTTPS ready (for production)

### Developer Experience:
- ✅ Reusable auth API module
- ✅ Zustand state management
- ✅ Axios interceptors for auth
- ✅ Environment variables for API URL
- ✅ Clean component structure

## 📝 Routes Added

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login.jsx | User authentication page |
| `/signup` | Signup.jsx | User registration page |

## 🔄 Protected Routes (Next Steps)

To protect routes (e.g., `/profile`, `/checkout`), create a `ProtectedRoute` component:

```jsx
// Example: src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

Then wrap protected routes:
```jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

## 🐛 Troubleshooting

### Backend not responding:
1. Make sure MongoDB is running
2. Start backend: `cd server && npm run dev`
3. Check backend console for errors
4. Verify `.env` file is configured

### Login fails:
1. Check backend logs for error messages
2. Verify credentials match backend `.env`
3. Check browser console for network errors
4. Ensure API_URL is correct in frontend `.env`

### Token issues:
1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Login again

## 🎯 Next Steps

1. ✅ Login/Signup pages - **DONE**
2. 🔜 Implement protected routes
3. 🔜 Add password reset flow
4. 🔜 Add email verification
5. 🔜 Add OAuth (Google, Facebook)
6. 🔜 Add user profile edit page
7. 🔜 Add order history page

## 📚 API Documentation

See `server/README.md` or `FOLDER_STRUCTURE.md` for complete API documentation.

---

**Your authentication system is now fully functional!** 🎉

Users can register, login, and the app will maintain their session across page refreshes thanks to localStorage persistence in the auth store.
