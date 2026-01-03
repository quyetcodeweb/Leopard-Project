import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customers';

export const customerService = {
    getAllCustomers: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    saveCustomer: async (customerData) => {
        const response = await axios.post(`${API_URL}/save`, customerData);
        return response.data;
    },

    deleteCustomer: async (id) => {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    },
    getHistory: async (customerId) => {
        const response = await axios.get(`${API_URL}/history/${customerId}`);
        return response.data;
    },

    getNotes: async (id) => {
        const response = await axios.get(`${API_URL}/${id}/notes`);
        return response.data;
    },
    addNote: async (id, noteData) => {
        const response = await axios.post(`${API_URL}/${id}/notes`, noteData);
        return response.data;
    },
    deleteNote: async (noteId) => {
        const response = await axios.delete(`${API_URL}/notes/${noteId}`);
        return response.data;
    }
};