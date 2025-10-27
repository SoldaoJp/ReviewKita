class UserModel {
  constructor(userData = {}) {
    this.id = userData.id || null;
    this.username = userData.username || '';
    this.email = userData.email || '';
    this.role = userData.role || 'user';
    this.isVerified = userData.isVerified || false;
    this.isAuthenticated = userData.isAuthenticated || false;
    this.profilePicture = userData.profilePicture || null;
    this.createdAt = userData.createdAt || null;
  }

  // Create user from API response
  static fromApiResponse(apiData) {
    return new UserModel({
      id: apiData.id || apiData._id,
      username: apiData.username,
      email: apiData.email,
      role: apiData.role,
      isVerified: apiData.isVerified,
      profilePicture: apiData.profilePicture || apiData.profile_picture,
      createdAt: apiData.createdAt,
      isAuthenticated: true
    });
  }

  // Convert to plain object for storage
  toPlainObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      isVerified: this.isVerified,
      isAuthenticated: this.isAuthenticated,
      profilePicture: this.profilePicture,
      createdAt: this.createdAt
    };
  }

  // Validation methods
  static validateLoginData(email, password) {
    const errors = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRegistrationData(username, email, password, confirmPassword) {
    const errors = [];

    if (!username) {
      errors.push('Username is required');
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    } else if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long');
    }

    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!confirmPassword) {
      errors.push('Please confirm your password');
    } else if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get display name
  getDisplayName() {
    return this.username || this.email.split('@')[0];
  }

  // Check if user has role
  hasRole(role) {
    return this.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.role === 'admin';
  }
}

export default UserModel;
