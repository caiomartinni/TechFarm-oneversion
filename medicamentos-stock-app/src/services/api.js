import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const addProduct = async (product) => {
    try {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    } catch (error) {
        throw new Error('Error adding product: ' + error.message);
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
};

export const updateProduct = async (productId, updatedProduct) => {
    try {
        const response = await axios.put(`${API_URL}/products/${productId}`, updatedProduct);
        return response.data;
    } catch (error) {
        throw new Error('Error updating product: ' + error.message);
    }
};

export const deleteProduct = async (productId) => {
    try {
        await axios.delete(`${API_URL}/products/${productId}`);
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
};