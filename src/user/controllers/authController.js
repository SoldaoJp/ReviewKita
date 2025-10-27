import authService from '../services/authService.js';

class AuthController {
  // Handle login
  async handleLogin(formData, navigate, setError, setLoading) {
    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    if (!this.isValidEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    try {
      setLoading(true);
      setError('');

      console.log('AuthController: Starting login process for:', email);
      
      const response = await authService.login(email, password);
      
      console.log('AuthController: Login response received:', response);
      
      if (response.token) {
        // Login successful; prefer backend user role for routing
        const role = response?.user?.role || 'user';
        console.log('AuthController: Login successful, role:', role);
        navigate(role === 'admin' ? '/admin' : '/dashboard');
        return true;
      } else {
        setError('Login failed: No authentication token received');
        return false;
      }
    } catch (error) {
      console.error('AuthController: Login failed with error:', error);
      
      // Handle specific backend errors
      if (error.message.includes('JWT_SECRET')) {
        setError('Backend authentication service configuration error. Please contact support.');
      } else if (error.message.includes('verify your email')) {
        setError('Please verify your email address before logging in. Check your inbox for the verification link.');
      } else if (error.message.includes('Invalid email or password')) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Handle registration
  async handleRegister(formData, navigate, setError, setLoading, setSuccess) {
    const { username, email, password, confirmPassword } = formData;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return false;
    }

    if (!this.isValidEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    try {
      setLoading(true);
      setError('');

      const response = await authService.register({
        username,
        email,
        password,
        confirmPassword
      });
      
      // Registration successful
      setSuccess('Registration successful! Please check your email to verify your account before logging in.');
      
      // Optional: Auto-redirect to login after delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Handle logout
  handleLogout(navigate) {
    authService.logout();
    navigate('/login');
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return authService.isAuthenticated();
  }

  // Get current user
  getCurrentUser() {
    return authService.getCurrentUser();
  }
}

export default new AuthController();
