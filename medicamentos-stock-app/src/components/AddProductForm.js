import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../services/api';
import validation from '../utils/validation';

const AddProductForm = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        const validationError = validation.validateProduct({ name, quantity, expirationDate });
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await api.addProduct({ name, quantity, expirationDate });
            setName('');
            setQuantity('');
            setExpirationDate('');
            setError('');
        } catch (err) {
            setError('Failed to add product. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Expiration Date (YYYY-MM-DD)"
                value={expirationDate}
                onChangeText={setExpirationDate}
            />
            <Button title="Add Product" onPress={handleSubmit} />
        </View>
    );
};


export default AddProductForm;