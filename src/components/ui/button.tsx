import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

// propriedades do botão
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  isLoading?: boolean;
}

// componente de botão reutilizável usando as propriedades definidas no ButtonProps
export function Button({ title, onPress, variant = 'primary', isLoading = false}: ButtonProps) {
    // lógica para definir estilos com base na variante do botão
    // Boa prática: usar variáveis para melhorar a legibilidade do código
    const isOutLine = variant === 'outline';
    const isDanger = variant === 'danger';
    
    // Validação das cores de fundo e texto
    // Cria variáveis que carregam validações para definir as cores do botão
    const bg = isOutLine ? 'transparent' : (isDanger ? '#ef4444' : '#f97316');
    const text = isOutLine ? '#f97316' : '#ffffff';
    const border = isOutLine ? '#f97316' : 'transparent';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: bg, borderColor: border, borderWidth: isOutLine ? 1 : 0 }]} // Validação em camadas para estiliação do corpo do botão.
            onPress={onPress} // Ação ao pressionar o botão
            disabled={isLoading} // Desabilita o botão se isLoading for verdadeiro, propriedade do TouchableOpacity
            activeOpacity={0.7} // Define uma transparência ao pressionar o botão
        >
            // Se isLoading for verdadeiro, troca o componente Text por um ActivityIndicator, indicanto um carregamento
            {isLoading ? <ActivityIndicator color={text} /> : <Text style={[styles.text, { color: text }]}>{title}</Text>}
        </TouchableOpacity>
    );
}

// estilos do botão com valores sendo passados dinamicamente com base nas propriedades
const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});