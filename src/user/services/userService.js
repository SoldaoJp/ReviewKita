import httpService from './httpService';

export const getUserProfile = async () => {
    try {
        console.log('Fetching user profile...');
        console.log('Token:', localStorage.getItem('authToken'));
        console.log('Base URL:', httpService.baseURL);
        const response = await httpService.get('/user/profile');
        console.log('User profile response:', response);
        return response.data || response;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateProfilePicture = async (file) => {
    try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('profile_picture', file);
        
        const response = await fetch(`${httpService.baseURL}/user/profile-picture`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update profile picture');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const changeUsername = async (newUsername) => {
    try {
        const response = await httpService.put('/user/change-username', { newUsername });
        return response.data || response;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await httpService.put('/user/change-password', { 
            currentPassword, 
            newPassword 
        });
        return response.data || response;
    } catch (error) {
        throw error;
    }
};

export default {
    getUserProfile,
    updateProfilePicture,
    changeUsername,
    changePassword,
};

