// src/controllers/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';
import UserModel from '../model/userModel.js';
import userService from '../services/userService.js';

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is already authenticated on app start
		const checkAuth = async () => {
			try {
				const isAuth = authService.isAuthenticated();
				const userData = authService.getCurrentUser();
				if (isAuth) {
					// Try to load full profile (to get role, username, etc.)
					try {
						const profile = await userService.getUserProfile();
						const apiUser = profile?.user || profile;
						const userModel = UserModel.fromApiResponse(apiUser || {});
						setUser(userModel);
						setIsAuthenticated(true);
						// persist enriched user
						localStorage.setItem('user', JSON.stringify(userModel.toPlainObject()));
					} catch (err) {
						// Fallback to stored minimal user if available
						if (userData) {
							const userModel = new UserModel(userData);
							setUser(userModel);
							setIsAuthenticated(true);
						} else {
							authService.logout();
						}
					}
				}
			} catch (error) {
				console.error('Error checking authentication:', error);
				// Clear invalid auth data
				authService.logout();
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (email, password) => {
		try {
			const response = await authService.login(email, password);

			if (response.token) {
				// After login, fetch profile for role and details
				try {
					// Prefer user from login response if available
					const immediateUser = response.user ? UserModel.fromApiResponse(response.user) : null;
					let userModel;
					try {
						const profile = await userService.getUserProfile();
						const apiUser = profile?.user || profile;
						userModel = UserModel.fromApiResponse(apiUser || { email });
					} catch {
						userModel = immediateUser || new UserModel({ email, isAuthenticated: true });
					}
					setUser(userModel);
					setIsAuthenticated(true);
					localStorage.setItem('user', JSON.stringify(userModel.toPlainObject()));
				} catch (e) {
					// Fallback minimal user if profile fails
					const userModel = new UserModel({ email, isAuthenticated: true });
					setUser(userModel);
					setIsAuthenticated(true);
				}
				return true;
			}
			return false;
		} catch (error) {
			throw error;
		}
	};

	const register = async (userData) => {
		try {
			const response = await authService.register(userData);
			return response;
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		authService.logout();
		setUser(null);
		setIsAuthenticated(false);
	};

	const refreshUser = async () => {
		try {
			const profile = await userService.getUserProfile();
			const apiUser = profile?.user || profile?.data || profile;
			const userModel = UserModel.fromApiResponse(apiUser || {});
			setUser(userModel);
			localStorage.setItem('user', JSON.stringify(userModel.toPlainObject()));
			return userModel;
		} catch (error) {
			console.error('Error refreshing user:', error);
			throw error;
		}
	};

	const value = {
		user,
		isAuthenticated,
		loading,
		login,
		register,
		logout,
		refreshUser
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

