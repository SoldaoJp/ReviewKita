import httpService from './httpService';

export const getAllReviewers = async (limit = 100, cursor = null, sort = null) => {
    try {
        let url = `/reviewers?limit=${limit}`;
        if (cursor) url += `&cursor=${cursor}`;
        if (sort) url += `&sort=${sort}`;
        
        const response = await httpService.get(url);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getReviewerById = async (id) => {
    try {
        const response = await httpService.get(`/reviewers/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createReviewer = async (formData) => {
    try {
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

export const updateReviewer = async (id, data) => {
    try {
        const response = await httpService.put(`/reviewers/${id}`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteReviewer = async (id) => {
    try {
        const response = await httpService.delete(`/reviewers/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

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

export const reportReviewer = async (id, reportData) => {
    try {
        const response = await httpService.post(`/reviewers/${id}/report`, reportData);
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
    reportReviewer,
};

