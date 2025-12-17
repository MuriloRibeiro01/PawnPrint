import {
  Activity,
  Battery,
  Heart,
  MapPin,
  Thermometer,
} from "lucide-react-native";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ConnectionStatus } from "../store/telemetry";
import { ImageWithFallback } from "../components/ImageWithFallback";

interface PetDashboardProps {
  petData: {
    name: string;
    breed: string;
    age: number;
    imageUrl: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    health: {
      heartRate: number;
      temperature: number;
      activityLevel: number;
      stepsToday: number;
    };
    collar: {
      battery: number;
      lastSync: string;
    };
  };
  connectionStatus: ConnectionStatus;
}

const STATUS_COPY: Record<ConnectionStatus, { text: string; color: string }> = {
  idle: { text: "Iniciando", color: "#9ca3af" },
  connecting: { text: "Conectando", color: "#f59e0b" },
  open: { text: "Ao vivo", color: "#ef4444" },
  closed: { text: "Pausado", color: "#9ca3af" },
  error: { text: "Instável", color: "#f97316" },
};

export function PetDashboard({ petData, connectionStatus }: PetDashboardProps) {
  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "#22c55e";
    if (battery > 20) return "#f59e0b";
    return "#ef4444";
  };

  const getActivityStatus = (level: number) => {
    if (level > 70) return { text: "Muito ativo", color: "#f97316" };
    if (level > 40) return { text: "Ativo", color: "#f59e0b" };
    return { text: "Descansando", color: "#6b7280" };
  };

  const activityStatus = getActivityStatus(petData.health.activityLevel);
  const statusLabel =
    STATUS_COPY[connectionStatus] ?? STATUS_COPY.idle;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.petHeader}>
          <View style={styles.avatarWrapper}>
            <ImageWithFallback
              uri={petData.imageUrl}
              style={styles.avatar}
              fallbackLabel="Pet"
            />
          </View>
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{petData.name}</Text>
            <Text style={styles.petBreed}>{petData.breed}</Text>
            <View
              style={[styles.activityBadge, { backgroundColor: activityStatus.color }]}
            >
              <Text style={styles.activityBadgeText}>{activityStatus.text}</Text>
            </View>
          </View>
          <View style={styles.statusColumn}>
            <View style={styles.connectionBadgeContainer}>
              <View style={[styles.connectionDot, { backgroundColor: statusLabel.color }]} />
              <Text style={[styles.connectionText, { color: statusLabel.color }]}>
                {statusLabel.text}
              </Text>
            </View>
            <View style={styles.batteryContainer}>
              <Text style={[styles.batteryLabel, { color: getBatteryColor(petData.collar.battery) }]}>Bateria</Text>
              <Battery
                color={getBatteryColor(petData.collar.battery)}
                size={24}
              />
              <Text style={[styles.batteryValue, { color: getBatteryColor(petData.collar.battery) }]}>
                {petData.collar.battery}%
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.syncBanner}>
          <Text style={styles.syncText}>
            Último pacote: <Text style={styles.syncHighlight}>{petData.collar.lastSync}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.redCard]}>
          <View style={styles.statHeader}>
            <Heart color="#ef4444" size={20} />
            <Text style={styles.statLabel}>Batimentos</Text>
          </View>
          <Text style={styles.statValue}>{petData.health.heartRate} BPM</Text>
          <Text style={styles.statDescription}>Normal</Text>
        </View>

        <View style={[styles.statCard, styles.orangeCard]}>
          <View style={styles.statHeader}>
            <Thermometer color="#f97316" size={20} />
            <Text style={styles.statLabel}>Temperatura</Text>
          </View>
          <Text style={styles.statValue}>{petData.health.temperature}°C</Text>
          <Text style={styles.statDescription}>Saudável</Text>
        </View>

        <View style={[styles.statCard, styles.yellowCard]}>
          <View style={styles.statHeader}>
            <Activity color="#facc15" size={20} />
            <Text style={styles.statLabel}>Atividade</Text>
          </View>
          <Text style={styles.statValue}>{petData.health.activityLevel}%</Text>
          <Text style={styles.statDescription}>Hoje</Text>
        </View>

        <View style={[styles.statCard, styles.sunsetCard]}>
          <View style={styles.statHeader}>
            <Activity color="#f97316" size={20} />
            <Text style={styles.statLabel}>Passos</Text>
          </View>
          <Text style={styles.statValue}>
            {petData.health.stepsToday.toLocaleString("pt-BR")}
          </Text>
          <Text style={styles.statDescription}>Meta: 8000</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.locationHeader}>
          <MapPin color="#f97316" size={20} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Localização Atual</Text>
            <Text style={styles.locationAddress}>{petData.location.address}</Text>
            <Text style={styles.locationCoords}>
              {petData.location.lat.toFixed(5)}, {petData.location.lng.toFixed(5)}
            </Text>
            <Text style={styles.locationTimestamp}>
              Última atualização: {petData.collar.lastSync}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  petHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    borderRadius: 999,
    height: 80,
    overflow: "hidden",
    width: 80,
  },
  avatar: {
    height: "100%",
    width: "100%",
  },
  petInfo: {
    flex: 1,
    gap: 4,
  },
  petName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  petBreed: {
    fontSize: 14,
    color: "#6b7280",
  },
  activityBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activityBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  statusColumn: {
    alignItems: "center",
    gap: 8,
  },
  connectionBadgeContainer: {
    alignItems: "center",
    gap: 4,
  },
  connectionDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  batteryContainer: {
    alignItems: "center",
    gap: 4,
  },
  batteryLabel: {
    fontSize: 12,
  },
  batteryValue: {
    fontSize: 12,
  },
  syncBanner: {
    backgroundColor: "rgba(253,224,71,0.35)",
    borderRadius: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  syncText: {
    color: "#4b5563",
    fontSize: 12,
  },
  syncHighlight: {
    color: "#111827",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    borderRadius: 20,
    flexBasis: "47%",
    padding: 16,
  },
  statHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    color: "#374151",
    fontSize: 14,
  },
  statValue: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "600",
  },
  statDescription: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },
  redCard: {
    backgroundColor: "#fee2e2",
  },
  orangeCard: {
    backgroundColor: "#ffedd5",
  },
  yellowCard: {
    backgroundColor: "#fef3c7",
  },
  sunsetCard: {
    backgroundColor: "#fde68a",
  },
  locationHeader: {
    flexDirection: "row",
    gap: 12,
  },
  locationInfo: {
    flex: 1,
    gap: 4,
  },
  locationLabel: {
    color: "#fb923c",
    fontSize: 14,
    fontWeight: "600",
  },
  locationAddress: {
    color: "#111827",
    fontSize: 14,
  },
  locationCoords: {
    color: "#6b7280",
    fontSize: 12,
  },
  locationTimestamp: {
    color: "#6b7280",
    fontSize: 12,
  },
});
