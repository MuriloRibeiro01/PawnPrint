import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Se estiver usando gradiente
import { Bell, Battery, Wifi } from "lucide-react-native";

// IMPORTS DA ARQUITETURA LIMPA
import { useTelemetryStore } from "../store/telemetry"; // Dados em tempo real
import { useUserStore } from "../store/userStore";     // Dados estáticos (Nome, Raça)
import { useTelemetryStream } from "../hooks/useTelemetryStream"; // Hook que liga a conexão
import { ImageWithFallback } from "../components/ui/ImageWithFallback"; // Seu componente de imagem

// Componentes internos (Cards) - Se você tiver separado eles, importe aqui.
// Se não, mantenha a estrutura visual que você já tinha.

export function PetDashboard() {
  // 1. O Componente se conecta sozinho (LIGAR A TORNEIRA DE DADOS)
  useTelemetryStream(); 

  // 2. BUSCAR DADOS DAS STORES (GELADEIRA)
  const pet = useUserStore((state) => state.pet);
  const telemetry = useTelemetryStore((state) => state.telemetry);
  const connectionStatus = useTelemetryStore((state) => state.connectionStatus);

  // 3. LOGICA DE EXIBIÇÃO
  // Status da Conexão formatado
  const isOnline = connectionStatus === 'open';
  const batteryLevel = 78; // Mock ou vindo da store se tiver

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* CABEÇALHO DO DASHBOARD */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Tutor!</Text>
          <Text style={styles.petName}>Como está o {pet.name}?</Text>
        </View>
        <ImageWithFallback 
            uri={pet.imageUrl} 
            style={styles.avatar} 
            fallbackLabel={pet.name} 
        />
      </View>

      {/* CARD DE STATUS RÁPIDO */}
      <View style={styles.statusCard}>
         <View style={styles.statusRow}>
            <View style={styles.statusItem}>
                <Wifi size={20} color={isOnline ? "#22c55e" : "#9ca3af"} />
                <Text style={styles.statusText}>
                    {isOnline ? "Conectado" : "Desconectado"}
                </Text>
            </View>
            <View style={styles.statusItem}>
                <Battery size={20} color="#f97316" />
                <Text style={styles.statusText}>{batteryLevel}% Bateria</Text>
            </View>
         </View>
      </View>

      {/* CARD DE DESTAQUE (Última atualização) */}
      <View style={[styles.card, styles.highlightCard]}>
         <Text style={styles.cardTitle}>Sinais Vitais Agora</Text>
         <View style={styles.vitalsRow}>
             <View style={styles.vitalItem}>
                 <Text style={styles.vitalLabel}>Coração</Text>
                 <Text style={styles.vitalValue}>
                    {telemetry.heartRate > 0 ? telemetry.heartRate : '--'} <Text style={styles.unit}>BPM</Text>
                 </Text>
             </View>
             <View style={styles.divider} />
             <View style={styles.vitalItem}>
                 <Text style={styles.vitalLabel}>Temp.</Text>
                 <Text style={styles.vitalValue}>
                    {telemetry.temperature > 0 ? telemetry.temperature.toFixed(1) : '--'} <Text style={styles.unit}>°C</Text>
                 </Text>
             </View>
         </View>
      </View>

      {/* OUTROS CARDS DO SEU DASHBOARD... */}
      <View style={styles.card}>
         <Text style={styles.cardTitle}>Atividade Hoje</Text>
         <Text style={{color: '#666', marginTop: 8}}>Passos estimados: 1.240</Text>
         {/* Aqui entraria aquele gráfico ou barra de progresso */}
      </View>

    </ScrollView>
  );
}

// ESTILOS (Mantenha ou ajuste conforme seu design)
const styles = StyleSheet.create({
  container: { padding: 20, gap: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  greeting: { fontSize: 16, color: '#6b7280' },
  petName: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  
  statusCard: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderRadius: 16, justifyContent: 'space-around', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  statusRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statusItem: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  statusText: { fontWeight: '600', color: '#374151' },

  card: { backgroundColor: 'white', padding: 20, borderRadius: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  highlightCard: { backgroundColor: '#ffedd5' }, // Laranja claro
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  
  vitalsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vitalItem: { alignItems: 'center', flex: 1 },
  vitalLabel: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  vitalValue: { fontSize: 32, fontWeight: 'bold', color: '#f97316' },
  unit: { fontSize: 14, color: '#6b7280', fontWeight: 'normal' },
  divider: { width: 1, height: 40, backgroundColor: '#fed7aa' }
});