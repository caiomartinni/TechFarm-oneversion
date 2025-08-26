import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Bem-vindo ao Controle de Estoque de Medicamentos!</Text>
            <Button
                title="Adicionar Produto"
                onPress={() => navigation.navigate('AddProduct')}
            />
            <Button
                title="Lista de Produtos"
                onPress={() => navigation.navigate('ProductList')}
            />
        </View>
    );
};

export default HomeScreen;