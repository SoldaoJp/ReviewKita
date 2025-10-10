// src/controllers/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';
import UserModel from '../models/userModel.js';

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
		const checkAuth = () => {
			try {
				const isAuth = authService.isAuthenticated();
				const userData = authService.getCurrentUser();
        
				if (isAuth && userData) {
					const userModel = new UserModel(userData);
					setUser(userModel);
					setIsAuthenticated(true);
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
				const userData = {
					email: email,
					isAuthenticated: true
				};
				const userModel = new UserModel(userData);
				setUser(userModel);
				setIsAuthenticated(true);
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

	const value = {
		user,
		isAuthenticated,
		loading,
		login,
		register,
		logout
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

