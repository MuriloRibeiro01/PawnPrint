import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

// Proprieadades do compomente Card
interface CardProps {
    children: React.ReactNode; // Conteúdo filho que será renderizado dentro do Card
    style?: ViewStyle; // Estilização adicional opcional para o Card
}

// Função de componente Card que envolve seu conteúdo em uma View estilizada
export function Card({ children, style }: CardProps) {
    return (
        // Pega a estilização padrão do card que está dentro da variável styles
        <View style={[styles.card, style]}>
            // passa os elementos filhos para dentro do card
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // sombra para Android
    }
});