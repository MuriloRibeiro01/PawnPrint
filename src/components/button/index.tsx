import { TouchableOpacity, Text } from 'react-native';

import { styles } from './styles'

// Tipagem das props
type Props = {
    title?: string
}

export function Button({ title }: Props) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.button}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
        
    )
}