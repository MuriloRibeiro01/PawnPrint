import {
  Home,
  MapPin,
  Navigation,
  RadioTower,
} from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ConnectionStatus, TelemetryRecord } from "../store/telemetry";

interface LocationMapProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  petName: string;
  history: TelemetryRecord[];
  connectionStatus: ConnectionStatus;
}

const STATUS_COPY: Record<ConnectionStatus, { text: string; color: string }> = {
  idle: { text: "Aguardando", color: "#9ca3af" },
  connecting: { text: "Conectando", color: "#f59e0b" },
  open: { text: "Ao vivo", color: "#ef4444" },
  closed: { text: "Encerrado", color: "#9ca3af" },
  error: { text: "Instável", color: "#f97316" },
};

export function LocationMap({
  location,
  petName,
  history,
  connectionStatus,
}: LocationMapProps) {
  const statusLabel =
    STATUS_COPY[connectionStatus] ?? STATUS_COPY.idle;

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

  return (
    <View style={styles.container}>
      <View style={styles.mapCard}>
        <View style={styles.mapSurface}>
          <View style={styles.gridLayer}>
            <View style={[styles.horizontalLine, { top: "25%" }]} />
            <View style={[styles.horizontalLine, { top: "50%", height: 3 }]} />
            <View style={[styles.horizontalLine, { top: "75%" }]} />
            <View style={[styles.verticalLine, { left: "33%" }]} />
            <View style={[styles.verticalLine, { left: "66%" }]} />
          </View>

          <View style={styles.petMarkerWrapper}>
            <View style={styles.pulse} />
            <View style={styles.petMarker}>
              <MapPin color="#ffffff" size={24} />
            </View>
          </View>

          <View style={styles.homeMarker}>
            <Home color="#ffffff" size={18} />
          </View>
        </View>

        <View style={styles.mapHeader}>
          <RadioTower color="#f97316" size={18} />
          <Text style={styles.mapHeaderText}>{statusLabel.text}</Text>
          <View
            style={[styles.statusDot, { backgroundColor: statusLabel.color }]}
          />
        </View>

        <View style={styles.zoomControls}>
          <Pressable style={styles.zoomButton}>
            <Text style={styles.zoomText}>+</Text>
          </Pressable>
          <Pressable style={styles.zoomButton}>
            <Text style={styles.zoomText}>−</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.locationRow}>
          <MapPin color="#f97316" size={20} />
          <View style={styles.locationDetails}>
            <Text style={styles.locationTitle}>Localização de {petName}</Text>
            <Text style={styles.locationAddress}>{location.address}</Text>
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
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  mapCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    height: 340,
    overflow: "hidden",
    position: "relative",
  },
  mapSurface: {
    flex: 1,
    backgroundColor: "#fef3c7",
  },
  gridLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  horizontalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#d4d4d8",
  },
  verticalLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#d4d4d8",
  },
  petMarkerWrapper: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -40 }],
    alignItems: "center",
  },
  pulse: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "rgba(239,68,68,0.25)",
  },
  petMarker: {
    backgroundColor: "#ef4444",
    borderRadius: 999,
    padding: 12,
  },
  homeMarker: {
    position: "absolute",
    bottom: 60,
    left: "20%",
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
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
  mapHeaderText: {
    color: "#4b5563",
    fontSize: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  zoomControls: {
    position: "absolute",
    top: 16,
    right: 16,
    gap: 12,
  },
  zoomButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    elevation: 2,
    height: 44,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: 44,
  },
  zoomText: {
    color: "#111827",
    fontSize: 20,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  locationRow: {
    flexDirection: "row",
    gap: 12,
  },
  locationDetails: {
    flex: 1,
    gap: 4,
  },
  locationTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  locationAddress: {
    color: "#374151",
    fontSize: 14,
  },
  locationCoords: {
    color: "#6b7280",
    fontSize: 12,
  },
  navigateButton: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  navigateText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  historyTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyHistory: {
    color: "#6b7280",
    fontSize: 12,
  },
  historyList: {
    maxHeight: 160,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  historyContent: {
    gap: 2,
  },
  historyCoords: {
    color: "#111827",
    fontSize: 14,
  },
  historyTimestamp: {
    color: "#6b7280",
    fontSize: 12,
  },
});
