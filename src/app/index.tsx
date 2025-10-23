import { View, Text, StyleSheet, Alert } from "react-native"

import { Button } from "../components/button"

// Um componete sempre começa com letra maiúscula
export default function Index(){ // Seguir esse padrão, o nome do componente deve ser igual ao nome do arquivo
    // Funções internas do componente
    function teste() {
        const nome = "Murilo"
        Alert.alert(`Salve, ${nome}!`)
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Olá Murilo!</Text>
            <Button title="Entrar"/>
            <Button title="Cadastrar"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Não precisa usar 'px' para unidades de medida
        padding: 32,
        // Quando o conteúdo de uma regra é texto, usa aspas duplas
        justifyContent: "center",
        gap: 16
    },
    title: {
        // Usa padrão camelCase para propriedades com mais de uma palavra
        fontSize: 24,
        fontWeight: "bold"
    }
})