import {
  MapPin,
  Navigation,
  RadioTower,
  Fence,
  AlertCircle,
} from "lucide-react-native";
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
import React, { useEffect, useState } from "react";
import type { ConnectionStatus, TelemetryRecord } from "../store/telemetry";

interface LocationMapProps {
  location: { lat: number; lng: number; address?: string };
  petName: string;
  history: TelemetryRecord[];
  connectionStatus: ConnectionStatus;
}

interface Geofence {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // em metros
  isActive: boolean;
}

interface GeofenceAlert {
  id: string;
  type: "entered" | "exited";
  geofenceName: string;
  timestamp: Date;
  location: { lat: number; lng: number };
}

const STATUS_COPY: Record<ConnectionStatus, { text: string; color: string }> = {
  idle: { text: "Aguardando", color: "#9ca3af" },
  connecting: { text: "Conectando", color: "#f59e0b" },
  open: { text: "Ao vivo", color: "#ef4444" },
  closed: { text: "Encerrado", color: "#9ca3af" },
  error: { text: "Instável", color: "#f97316" },
};

// Função para calcular distância entre duas coordenadas (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Raio da Terra em metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function LocationMap({
  location,
  petName,
  history,
  connectionStatus,
}: LocationMapProps) {
  const statusLabel = STATUS_COPY[connectionStatus] ?? STATUS_COPY.idle;
  const [address, setAddress] = useState(location.address || "Carregando endereço...");
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [newGeofence, setNewGeofence] = useState<Omit<Geofence, 'id'>>({
    name: "",
    lat: location.lat,
    lng: location.lng,
    radius: 100,
    isActive: true,
  });

  // Carregar geofences do localStorage
  useEffect(() => {
    loadGeofences();
  }, []);

  // Monitorar localização para detectar entradas/saídas de geofences
  useEffect(() => {
    checkGeofences(location.lat, location.lng);
  }, [location.lat, location.lng, geofences]);

  const loadGeofences = () => {
    // Simular carregamento de geofences salvas
    const savedGeofences: Geofence[] = [
      {
        id: "1",
        name: "Casa",
        lat: location.lat,
        lng: location.lng,
        radius: 150,
        isActive: true,
      },
    ];
    setGeofences(savedGeofences);
  };

  const checkGeofences = (currentLat: number, currentLng: number) => {
    geofences.forEach(geofence => {
      if (!geofence.isActive) return;

      const distance = calculateDistance(
        currentLat, currentLng,
        geofence.lat, geofence.lng
      );

      const isInside = distance <= geofence.radius;
      const wasInside = alerts.some(alert => 
        alert.geofenceName === geofence.name && 
        alert.type === "entered" &&
        (Date.now() - alert.timestamp.getTime()) < 30000 // Últimos 30 segundos
      );

      if (isInside && !wasInside) {
        // Entrou na geofence
        const alert: GeofenceAlert = {
          id: Date.now().toString(),
          type: "entered",
          geofenceName: geofence.name,
          timestamp: new Date(),
          location: { lat: currentLat, lng: currentLng },
        };
        setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Manter apenas últimos 10 alertas
        
        // Mostrar alerta visual
        Alert.alert(
          "🚨 Geofence Alert",
          `${petName} entrou na área: ${geofence.name}`,
          [{ text: "OK" }]
        );
      } else if (!isInside && wasInside) {
        // Saiu da geofence
        const alert: GeofenceAlert = {
          id: Date.now().toString(),
          type: "exited",
          geofenceName: geofence.name,
          timestamp: new Date(),
          location: { lat: currentLat, lng: currentLng },
        };
        setAlerts(prev => [alert, ...prev.slice(0, 9)]);
        
        Alert.alert(
          "🚨 Geofence Alert",
          `${petName} saiu da área: ${geofence.name}`,
          [{ text: "OK" }]
        );
      }
    });
  };

  const addGeofence = () => {
    if (!newGeofence.name.trim()) {
      Alert.alert("Erro", "Por favor, digite um nome para a geofence");
      return;
    }

    const geofence: Geofence = {
      ...newGeofence,
      id: Date.now().toString(),
    };

    setGeofences(prev => [...prev, geofence]);
    setNewGeofence({
      name: "",
      lat: location.lat,
      lng: location.lng,
      radius: 100,
      isActive: true,
    });
    setShowGeofenceModal(false);
  };

  const toggleGeofence = (id: string) => {
    setGeofences(prev =>
      prev.map(fence =>
        fence.id === id ? { ...fence, isActive: !fence.isActive } : fence
      )
    );
  };

  const deleteGeofence = (id: string) => {
    Alert.alert(
      "Excluir Geofence",
      "Tem certeza que deseja excluir esta geofence?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => setGeofences(prev => prev.filter(fence => fence.id !== id))
        },
      ]
    );
  };

  const recentLocations = history
    .filter((item) => item.latitude !== 0 || item.longitude !== 0)
    .slice(-5)
    .reverse()
    .map((item, index) => ({
      id: `${item.timestamp}-${index}`,
      timestamp: new Date(item.timestamp).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      lat: item.latitude,
      lng: item.longitude,
    }));

  const activeGeofences = geofences.filter(fence => fence.isActive);

  return (
    <View style={styles.container}>
      {/* Modal para adicionar geofence */}
      <Modal
        visible={showGeofenceModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Geofence</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome da área (ex: Casa, Parque)"
              value={newGeofence.name}
              onChangeText={(text) => setNewGeofence(prev => ({ ...prev, name: text }))}
            />
            
            <View style={styles.coordRow}>
              <View style={styles.coordInput}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput
                  style={styles.input}
                  value={newGeofence.lat.toString()}
                  onChangeText={(text) => setNewGeofence(prev => ({ ...prev, lat: parseFloat(text) || 0 }))}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.coordInput}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput
                  style={styles.input}
                  value={newGeofence.lng.toString()}
                  onChangeText={(text) => setNewGeofence(prev => ({ ...prev, lng: parseFloat(text) || 0 }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.radiusContainer}>
              <Text style={styles.label}>Raio: {newGeofence.radius}m</Text>
              <TextInput
                style={styles.input}
                value={newGeofence.radius.toString()}
                onChangeText={(text) => setNewGeofence(prev => ({ ...prev, radius: parseInt(text) || 100 }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGeofenceModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, styles.saveButton]}
                onPress={addGeofence}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.mapCard}>
        {Platform.OS === "web" ? (
          <iframe
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            style={{
              border: 0,
              width: "100%",
              height: "100%",
              borderRadius: 24,
            }}
            loading="lazy"
          />
        ) : (
          <WebView
            style={{ flex: 1 }}
            source={{
              uri: `https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`,
            }}
          />
        )}

        <View style={styles.mapHeader}>
          <RadioTower color="#f97316" size={18} />
          <Text style={styles.mapHeaderText}>{statusLabel.text}</Text>
          <View
            style={[styles.statusDot, { backgroundColor: statusLabel.color }]}
          />
        </View>

        {/* Botão para adicionar geofence */}
        <Pressable 
          style={styles.addGeofenceButton}
          onPress={() => setShowGeofenceModal(true)}
        >
          <Fence color="#ffffff" size={18} />
          <Text style={styles.addGeofenceText}>Geofence</Text>
        </Pressable>
      </View>

      {/* Card de Geofences Ativas */}
      {activeGeofences.length > 0 && (
        <View style={styles.geofenceCard}>
          <View style={styles.geofenceHeader}>
            <Fence color="#f97316" size={18} />
            <Text style={styles.geofenceTitle}>Áreas de Monitoramento</Text>
            <View style={styles.geofenceCount}>
              <Text style={styles.geofenceCountText}>{activeGeofences.length}</Text>
            </View>
          </View>
          
          <ScrollView style={styles.geofenceList}>
            {geofences.map(geofence => (
              <View key={geofence.id} style={styles.geofenceItem}>
                <View style={styles.geofenceInfo}>
                  <Text style={styles.geofenceName}>{geofence.name}</Text>
                  <Text style={styles.geofenceDetails}>
                    {geofence.radius}m • {geofence.lat.toFixed(5)}, {geofence.lng.toFixed(5)}
                  </Text>
                </View>
                <View style={styles.geofenceActions}>
                  <Pressable 
                    style={[
                      styles.geofenceToggle,
                      geofence.isActive ? styles.geofenceActive : styles.geofenceInactive
                    ]}
                    onPress={() => toggleGeofence(geofence.id)}
                  >
                    <Text style={styles.geofenceToggleText}>
                      {geofence.isActive ? "Ativa" : "Inativa"}
                    </Text>
                  </Pressable>
                  <Pressable 
                    style={styles.deleteButton}
                    onPress={() => deleteGeofence(geofence.id)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Card de Alertas de Geofence */}
      {alerts.length > 0 && (
        <View style={styles.alertsCard}>
          <View style={styles.alertsHeader}>
            <AlertCircle color="#ef4444" size={18} />
            <Text style={styles.alertsTitle}>Alertas Recentes</Text>
          </View>
          <ScrollView style={styles.alertsList}>
            {alerts.slice(0, 5).map(alert => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={[
                  styles.alertDot,
                  alert.type === "entered" ? styles.alertEntered : styles.alertExited
                ]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertText}>
                    {petName} {alert.type === "entered" ? "entrou" : "saiu"} de {alert.geofenceName}
                  </Text>
                  <Text style={styles.alertTime}>
                    {alert.timestamp.toLocaleTimeString("pt-BR")}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.infoCard}>
        <View style={styles.locationRow}>
          <MapPin color="#f97316" size={20} />
          <View style={styles.locationDetails}>
            <Text style={styles.locationTitle}>Localização de {petName}</Text>
            <Text style={styles.locationAddress}>{address}</Text>
            <Text style={styles.locationCoords}>
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </Text>
          </View>
        </View>
        <Pressable style={styles.navigateButton}>
          <Navigation color="#ffffff" size={16} />
          <Text style={styles.navigateText}>Ir até {petName}</Text>
        </Pressable>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Últimas posições transmitidas</Text>
        {recentLocations.length === 0 ? (
          <Text style={styles.emptyHistory}>
            Aguardando pacotes de localização da coleira inteligente.
          </Text>
        ) : (
          <ScrollView style={styles.historyList}>
            {recentLocations.map((item, index) => (
              <View key={item.id} style={styles.historyRow}>
                <View
                  style={[
                    styles.historyDot,
                    { backgroundColor: index === 0 ? "#ef4444" : "#fb923c" },
                  ]}
                />
                <View style={styles.historyContent}>
                  <Text style={styles.historyCoords}>
                    {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
                  </Text>
                  <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, paddingBottom: 24 },
  mapCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    height: 340,
    overflow: "hidden",
    position: "relative",
  },
  mapHeader: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mapHeaderText: { color: "#4b5563", fontSize: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 999 },
  
  // Botão de adicionar geofence
  addGeofenceButton: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f97316",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addGeofenceText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  coordRow: {
    flexDirection: "row",
    gap: 12,
  },
  coordInput: {
    flex: 1,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
  },
  radiusContainer: {
    gap: 8,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  saveButton: {
    backgroundColor: "#f97316",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  // Geofence card styles
  geofenceCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  geofenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  geofenceTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  geofenceCount: {
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  geofenceCountText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  geofenceList: {
    maxHeight: 200,
  },
  geofenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  geofenceInfo: {
    flex: 1,
  },
  geofenceName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },
  geofenceDetails: {
    color: "#6b7280",
    fontSize: 12,
  },
  geofenceActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  geofenceToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  geofenceActive: {
    backgroundColor: "#dcfce7",
  },
  geofenceInactive: {
    backgroundColor: "#f3f4f6",
  },
  geofenceToggleText: {
    fontSize: 12,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    color: "#ef4444",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Alerts card styles
  alertsCard: {
    backgroundColor: "rgba(254,226,226,0.9)",
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  alertsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertsTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  alertsList: {
    maxHeight: 120,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  alertEntered: {
    backgroundColor: "#ef4444",
  },
  alertExited: {
    backgroundColor: "#f97316",
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    color: "#111827",
    fontSize: 14,
  },
  alertTime: {
    color: "#6b7280",
    fontSize: 12,
  },

  // Existing styles
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  locationRow: { flexDirection: "row", gap: 12 },
  locationDetails: { flex: 1, gap: 4 },
  locationTitle: { color: "#111827", fontSize: 16, fontWeight: "600" },
  locationAddress: { color: "#374151", fontSize: 14 },
  locationCoords: { color: "#6b7280", fontSize: 12 },
  navigateButton: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  navigateText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
  historyCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  historyTitle: { color: "#111827", fontSize: 16, fontWeight: "600" },
  emptyHistory: { color: "#6b7280", fontSize: 12 },
  historyList: { maxHeight: 160 },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  historyDot: { width: 10, height: 10, borderRadius: 999 },
  historyContent: { gap: 2 },
  historyCoords: { color: "#111827", fontSize: 14 },
  historyTimestamp: { color: "#6b7280", fontSize: 12 },
});