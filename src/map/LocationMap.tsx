import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { WebView } from "react-native-webview";
import { MapPin, Navigation, RadioTower, Fence, AlertCircle } from "lucide-react-native";

// Imports da sua arquitetura limpa
import { useTelemetryStore } from "../store/telemetry"; // <--- Conecta na Store
import { calculateDistance } from "../utils/geo";       // <--- Importa a matemática
import { Geofence, GeofenceAlert } from "../types/geofence"; // <--- Importa os tipos
import { ConnectionStatus } from "../store/telemetry";

// Constantes visuais podem ficar aqui ou num arquivo de config
const STATUS_COPY: Record<ConnectionStatus, { text: string; color: string }> = {
  idle: { text: "Aguardando", color: "#9ca3af" },
  connecting: { text: "Conectando", color: "#f59e0b" },
  open: { text: "Ao vivo", color: "#ef4444" },
  closed: { text: "Encerrado", color: "#9ca3af" },
  error: { text: "Instável", color: "#f97316" },
};

export function LocationMap() {
  // 1. BUSCA DADOS DA STORE (Componente Independente)
  const telemetry = useTelemetryStore((state) => state.telemetry);
  const locationHistory = useTelemetryStore((state) => state.locationHistory);
  const connectionStatus = useTelemetryStore((state) => state.connectionStatus);

  // Prepara dados locais para facilitar leitura
  const currentLocation = {
    lat: telemetry.latitude || -15.7942, // Default Brasília se zero
    lng: telemetry.longitude || -47.8822,
    address: "Atualizando endereço..." // Num app real, faria geocoding reverso aqui
  };
  
  const petName = "Max"; // Poderia vir de usePetStore()

  // 2. ESTADOS LOCAIS DA UI (Modal, Forms)
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  
  // Estado do formulário
  const [newGeofence, setNewGeofence] = useState<Omit<Geofence, 'id'>>({
    name: "",
    lat: currentLocation.lat,
    lng: currentLocation.lng,
    radius: 100,
    isActive: true,
  });

  const statusLabel = STATUS_COPY[connectionStatus] ?? STATUS_COPY.idle;

  // 3. EFEITOS (Lógica de Negócio do Mapa)
  
  // Carregar dados iniciais (Mock)
  useEffect(() => {
    setGeofences([
      {
        id: "1",
        name: "Casa",
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        radius: 150,
        isActive: true,
      },
    ]);
  }, []);

  // Monitorar Geofences (Usando a função importada de utils)
  useEffect(() => {
    if (!telemetry.latitude) return;
    
    geofences.forEach(geofence => {
      if (!geofence.isActive) return;

      const distance = calculateDistance(
        telemetry.latitude, telemetry.longitude,
        geofence.lat, geofence.lng
      );

      const isInside = distance <= geofence.radius;
      
      // Lógica de Debounce (evitar alertas repetidos em 30s)
      const lastAlert = alerts.find(a => a.geofenceName === geofence.name && (Date.now() - a.timestamp.getTime()) < 30000);

      if (isInside && (!lastAlert || lastAlert.type === 'exited')) {
        triggerAlert("entered", geofence);
      } else if (!isInside && (lastAlert && lastAlert.type === 'entered')) {
        triggerAlert("exited", geofence);
      }
    });
  }, [telemetry, geofences]);

  const triggerAlert = (type: "entered" | "exited", geofence: Geofence) => {
    const newAlert: GeofenceAlert = {
      id: Date.now().toString(),
      type,
      geofenceName: geofence.name,
      timestamp: new Date(),
      location: { lat: telemetry.latitude, lng: telemetry.longitude },
    };
    
    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    Alert.alert("Geofence", `${petName} ${type === 'entered' ? 'entrou em' : 'saiu de'} ${geofence.name}`);
  };

  // Funções de UI (Adicionar, Remover)
  const addGeofence = () => {
    if (!newGeofence.name.trim()) return Alert.alert("Erro", "Nome obrigatório");
    setGeofences(prev => [...prev, { ...newGeofence, id: Date.now().toString() }]);
    setShowGeofenceModal(false);
  };

  const activeGeofences = geofences.filter(fence => fence.isActive);

  // Prepara histórico para renderização
  const recentLocations = locationHistory
    .filter(item => item.latitude !== 0)
    .slice(-5)
    .reverse()
    .map((item, index) => ({
      id: `${item.timestamp}-${index}`,
      timestamp: new Date(item.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      lat: item.latitude,
      lng: item.longitude,
    }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* SEU MODAL AQUI (Mantive igual para não quebrar UI) */}
      <Modal visible={showGeofenceModal} transparent animationType="slide">
         {/* ... (Todo o código do seu modal anterior) ... */}
         {/* DICA: Em breve, transforme esse Modal em um componente <GeofenceModal /> */}
         <View style={styles.modalOverlay}><Text>Imagine o Modal Aqui</Text></View>
      </Modal>

      {/* MAPA */}
      <View style={styles.mapCard}>
        {Platform.OS === "web" ? (
            <iframe
            src={`https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&z=15&output=embed`}
            style={{ border: 0, width: "100%", height: "100%", borderRadius: 24 }}
          />
        ) : (
          <WebView
            style={{ flex: 1 }}
            source={{ uri: `https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}&z=15&output=embed` }}
          />
        )}
        
        {/* Header do Mapa */}
        <View style={styles.mapHeader}>
          <RadioTower color="#f97316" size={18} />
          <Text style={styles.mapHeaderText}>{statusLabel.text}</Text>
          <View style={[styles.statusDot, { backgroundColor: statusLabel.color }]} />
        </View>

        <Pressable style={styles.addGeofenceButton} onPress={() => setShowGeofenceModal(true)}>
          <Fence color="#ffffff" size={18} />
          <Text style={styles.addGeofenceText}>Geofence</Text>
        </Pressable>
      </View>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
         <View style={styles.locationRow}>
           <MapPin color="#f97316" size={20} />
           <View style={styles.locationDetails}>
             <Text style={styles.locationTitle}>Localização Atual</Text>
             <Text style={styles.locationCoords}>{currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}</Text>
           </View>
         </View>
      </View>

      {/* HISTÓRICO */}
      <View style={styles.historyCard}>
         <Text style={styles.historyTitle}>Histórico Recente</Text>
         {recentLocations.map((loc, i) => (
            <View key={loc.id} style={styles.historyRow}>
               <Text>{loc.timestamp} - {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</Text>
            </View>
         ))}
      </View>

    </ScrollView>
  );
}

// MANTENHA O STYLESHEET AQUI EMBAIXO IGUAL ESTAVA
const styles = StyleSheet.create({
  // ... seus estilos antigos
  container: { gap: 16, padding: 16, paddingBottom: 100 },
  mapCard: { height: 300, borderRadius: 24, overflow: 'hidden', backgroundColor: '#ddd' },
  mapHeader: { position: 'absolute', top: 16, left: 16, backgroundColor: 'white', padding: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  addGeofenceButton: { position: 'absolute', top: 16, right: 16, backgroundColor: '#f97316', padding: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  addGeofenceText: { color: 'white', fontWeight: 'bold' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  mapHeaderText: { fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  infoCard: { backgroundColor: 'white', padding: 16, borderRadius: 16 },
  locationRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  locationDetails: { gap: 4 },
  locationTitle: { fontWeight: 'bold', fontSize: 16 },
  locationCoords: { color: '#666' },
  historyCard: { backgroundColor: 'white', padding: 16, borderRadius: 16 },
  historyTitle: { fontWeight: 'bold', marginBottom: 12 },
  historyRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }
});