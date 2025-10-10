import httpService from './httpService';

// Get all reviewers for the logged-in user
export const getAllReviewers = async (page = 1, limit = 100) => {
    try {
        const response = await httpService.get(`/reviewers?page=${page}&limit=${limit}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get a specific reviewer by ID
export const getReviewerById = async (id) => {
    try {
        const response = await httpService.get(`/reviewers/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Create a new reviewer
export const createReviewer = async (formData) => {
    try {
        // For multipart/form-data, we need to use fetch directly with proper headers
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('No authentication token found. Please login again.');
        }
        
        const response = await fetch(`${httpService.baseURL}/reviewers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please login again.');
            }
            throw new Error(data.message || 'Failed to create reviewer');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

// Update a reviewer
export const updateReviewer = async (id, data) => {
    try {
        const response = await httpService.put(`/reviewers/${id}`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

// Delete a reviewer
export const deleteReviewer = async (id) => {
    try {
        const response = await httpService.delete(`/reviewers/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Re-enhance reviewer content using current model (or provided model_id)
export const reenhanceReviewerContent = async (id, { revisionNotes = '', model_id } = {}) => {
    try {
        const payload = { revisionNotes };
        if (model_id) payload.model_id = model_id;
        const response = await httpService.post(`/reviewers/${id}/reenhanceContent`, payload);
        return response;
    } catch (error) {
        throw error;
    }
};

export default {
    getAllReviewers,
    getReviewerById,
    createReviewer,
    updateReviewer,
    deleteReviewer,
    reenhanceReviewerContent,
};
