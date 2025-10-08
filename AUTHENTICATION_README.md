# ReviewKita Frontend Authentication

## Overview
This implementation connects the ReviewKita frontend to the backend authentication system using a complete MVC architecture.

## Architecture

### Models
- **UserModel** (`src/models/userModel.js`): Handles user data structure and validation

### Services  
- **AuthService** (`src/services/authService.js`): Handles API calls to backend auth endpoints
- **HttpService** (`src/services/httpService.js`): Generic HTTP service with authentication headers

### Controllers
- **AuthController** (`src/controllers/authController.js`): Contains business logic for login/signup

### Context
- **AuthContext** (`src/context/AuthContext.js`): Global authentication state management

### Components
- **Login** (`src/components/auth/Login.js`): Login form connected to backend
- **Signup** (`src/components/auth/signup.js`): Registration form connected to backend
- **ProtectedRoute** (`src/components/common/ProtectedRoute.js`): Route protection
- **RedirectIfAuthenticated** (`src/components/common/RedirectIfAuthenticated.js`): Prevents authenticated users from accessing auth pages

## Backend Integration

### API Endpoints Used
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout

### Authentication Flow
1. User submits login/signup form
2. Frontend validates input
3. API call to backend with credentials
4. Backend returns JWT token on success
5. Token stored in localStorage
6. Protected routes now accessible
7. Token included in future API calls

## Features

### ✅ Implemented
- User registration with validation
- User login with JWT tokens
- Protected routes
- Automatic redirect for authenticated users
- Logout functionality
- Error handling and loading states
- Form validation
- Persistent authentication state

### Security Features
- JWT token storage
- Automatic token inclusion in API calls
- 401 handling with automatic logout
- Input validation on frontend and backend
- Protected route access

## Usage

### Login
```javascript
// Users can login with email and password
// Automatically redirected to /profile on success
// Errors displayed for invalid credentials
```

### Signup  
```javascript
// Users can register with username, email, password
// Email verification required before login
// Success message displayed with auto-redirect
```

### Protected Routes
All routes except auth pages require authentication:
- `/profile`
- `/reviewer` 
- `/datascalability`
- `/quantitative-methods`
- `/advanced-database`
- `/networking-2`
- `/advanced-programming`
- `/ias`

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend Requirements
- Backend server running on port 5000
- CORS enabled for frontend domain
- Authentication endpoints implemented as per backend structure

## Error Handling
- Network errors
- Validation errors
- Authentication failures  
- Server errors
- Token expiration

All errors display user-friendly messages in the UI.