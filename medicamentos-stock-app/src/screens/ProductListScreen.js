import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { fetchProducts } from '../services/api';

const ProductListScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const productList = await fetchProducts();
            setProducts(productList);
        };

        loadProducts();
    }, []);

    const renderProductItem = ({ item }) => (
        <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>Quantidade: {item.quantity}</Text>
            <Text>Validade: {item.expirationDate}</Text>
            <Button
                title="Editar"
                onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Button
                title="Adicionar Produto"
                onPress={() => navigation.navigate('AddProduct')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    productItem: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductListScreen;