import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

// Propriedades do componente Input
interface InputProps {
    label: string;
    value: string;
    placeholder?: string;
    onChangeText: (text: string) => void; // Função chamada quando o texto muda
    secureTextEntry?: boolean; // Define se o campo é para senha
}

export function input ({ label, value, placeholder, onChangeText, secureTextEntry = false }: InputProps) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#9ca3af"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        fontSize: 16,
        color: '#111827',
        padding: 12,
    }
});