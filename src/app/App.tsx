import { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Activity, Home, MapPin, User } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

import { HealthMonitor } from "../components/HealthMonitor";
import { LocationMap } from "../components/LocationMap";
import { PetDashboard } from "../components/PetDashboard";
import { ProfileScreen } from "../components/ProfileScreen";
import { useTelemetryStream } from "../hooks/useTelemetryStream";
import { useTelemetryStore } from "../store/telemetry";

const petProfile = {
  pet: {
    name: "Max",
    breed: "Golden Retriever",
    age: 3,
    weight: 32,
    gender: "Macho",
    imageUrl:
      "https://images.unsplash.com/photo-1687211818108-667d028f1ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MXx8fHwxNzYwMzk3NzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    birthDate: "15/03/2022",
    microchipId: "982-000-123-456-789",
  },
  location: {
    lat: -23.5505,
    lng: -46.6333,
    address: "Rua das Flores, 123 - Jardim Paulista, São Paulo - SP",
  },
  collar: {
    battery: 78,
  },
  healthDefaults: {
    heartRate: 72,
    temperature: 38.5,
    activityLevel: 68,
    stepsToday: 6240,
    waterIntake: 380,
    sleepHours: 10.5,
  },
  owner: {
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "+55 (11) 98765-4321",
    address: "Rua das Flores, 123 - Jardim Paulista, São Paulo - SP",
  },
};

type Tab = "home" | "map" | "health" | "profile";

function formatRelativeTimestamp(timestamp?: string) {
  if (!timestamp) return "aguardando dados";
  const lastUpdateDate = new Date(timestamp);
  const lastUpdate = lastUpdateDate.getTime();
  if (Number.isNaN(lastUpdate) || lastUpdate === 0) {
    return "aguardando dados";
  }
  const now = Date.now();
  const diff = Math.max(0, now - lastUpdate);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return "agora";
  if (seconds < 60) return `há ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `há ${days} d`;
}

const tabs: { key: Tab; label: string; icon: (props: { size: number; color: string }) => JSX.Element }[] = [
  { key: "home", label: "Início", icon: ({ size, color }) => <Home size={size} color={color} /> },
  { key: "map", label: "Mapa", icon: ({ size, color }) => <MapPin size={size} color={color} /> },
  { key: "health", label: "Saúde", icon: ({ size, color }) => <Activity size={size} color={color} /> },
  { key: "profile", label: "Perfil", icon: ({ size, color }) => <User size={size} color={color} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  useTelemetryStream();

  const telemetry = useTelemetryStore((state) => state.telemetry);
  const vitalsHistory = useTelemetryStore((state) => state.vitalsHistory);
  const locationHistory = useTelemetryStore((state) => state.locationHistory);
  const connectionStatus = useTelemetryStore((state) => state.connectionStatus);

  const healthData = useMemo(() => {
    const heartRate = telemetry.heartRate || petProfile.healthDefaults.heartRate;
    const temperature =
      telemetry.temperature || petProfile.healthDefaults.temperature;
    const derivedActivity = Math.min(
      100,
      Math.max(0, Math.round(((heartRate - 60) / 90) * 100)),
    );
    const stepsToday = Math.min(
      16000,
      Math.round(
        petProfile.healthDefaults.stepsToday + vitalsHistory.length * 8,
      ),
    );

    return {
      heartRate,
      temperature,
      activityLevel:
        vitalsHistory.length > 4
          ? derivedActivity
          : petProfile.healthDefaults.activityLevel,
      stepsToday,
      waterIntake: petProfile.healthDefaults.waterIntake,
      sleepHours: petProfile.healthDefaults.sleepHours,
    };
  }, [telemetry, vitalsHistory]);

  const locationData = {
    lat:
      telemetry.latitude !== 0
        ? telemetry.latitude
        : petProfile.location.lat,
    lng:
      telemetry.longitude !== 0
        ? telemetry.longitude
        : petProfile.location.lng,
    address: petProfile.location.address,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <PetDashboard
            petData={{
              ...petProfile.pet,
              location: locationData,
              health: healthData,
              collar: {
                battery: petProfile.collar.battery,
                lastSync: formatRelativeTimestamp(telemetry.timestamp),
              },
            }}
            connectionStatus={connectionStatus}
          />
        );
      case "map":
        return (
          <LocationMap
            location={locationData}
            petName={petProfile.pet.name}
            history={locationHistory}
            connectionStatus={connectionStatus}
          />
        );
      case "health":
        return (
          <HealthMonitor
            petName={petProfile.pet.name}
            health={{
              ...healthData,
            }}
            history={vitalsHistory}
            connectionStatus={connectionStatus}
          />
        );
      case "profile":
        return <ProfileScreen pet={petProfile.pet} owner={petProfile.owner} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={["#fef3c7", "#ffedd5", "#fecdd3"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.phoneFrame}>
          <View style={styles.notch} />
          <View style={styles.screen}>
            <View style={styles.statusBar}>
              <Text style={styles.statusTime}>9:41</Text>
              <View style={styles.statusIcons}>
                <View style={styles.signalGroup}>
                  {[0.4, 0.6, 0.8, 1].map((opacity, index) => (
                    <View
                      key={`signal-${index}`}
                      style={[styles.signalBar, { opacity, height: 6 + index * 3 }]}
                    />
                  ))}
                </View>
                <View style={styles.wifiIcon}>
                  <View style={styles.wifiOuter} />
                  <View style={styles.wifiInner} />
                  <View style={styles.wifiDot} />
                </View>
                <View style={styles.batteryIcon}>
                  <View style={styles.batteryBody}>
                    <View style={styles.batteryFill} />
                  </View>
                  <View style={styles.batteryCap} />
                </View>
              </View>
            </View>

            <View style={styles.header}>
              <Text style={styles.brand}>pawnprint</Text>
              <Text style={styles.subtitle}>Cuide do seu melhor amigo</Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderContent()}
            </ScrollView>

            <View style={styles.tabBar}>
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab;
                const color = isActive ? "#f97316" : "#6b7280";
                return (
                  <Pressable
                    key={tab.key}
                    style={({ pressed }) => [
                      styles.tabItem,
                      isActive && styles.tabItemActive,
                      pressed && styles.tabItemPressed,
                    ]}
                    onPress={() => setActiveTab(tab.key)}
                  >
                    {tab.icon({ size: 24, color })}
                    <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  phoneFrame: {
    backgroundColor: "#111827",
    borderRadius: 52,
    padding: 18,
    width: 390,
    height: 820,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  notch: {
    alignSelf: "center",
    backgroundColor: "#111827",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 24,
    position: "absolute",
    top: 0,
    width: 140,
    zIndex: 2,
  },
  screen: {
    backgroundColor: "#f8fafc",
    borderRadius: 40,
    flex: 1,
    paddingTop: 44,
    paddingHorizontal: 24,
  },
  statusBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusTime: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  statusIcons: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  signalGroup: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 2,
  },
  signalBar: {
    backgroundColor: "#111827",
    borderRadius: 2,
    width: 3,
  },
  wifiIcon: {
    alignItems: "center",
    height: 16,
    justifyContent: "center",
    width: 18,
  },
  wifiOuter: {
    borderColor: "#111827",
    borderRadius: 9,
    borderWidth: 2,
    height: 16,
    position: "absolute",
    transform: [{ scaleX: 1.1 }],
    width: 18,
    opacity: 0.4,
  },
  wifiInner: {
    borderColor: "#111827",
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    position: "absolute",
    width: 14,
    opacity: 0.6,
  },
  wifiDot: {
    backgroundColor: "#111827",
    borderRadius: 4,
    height: 4,
    width: 4,
  },
  batteryIcon: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  batteryCap: {
    backgroundColor: "#111827",
    borderRadius: 1,
    height: 8,
    width: 3,
  },
  batteryBody: {
    borderColor: "#111827",
    borderRadius: 3,
    borderWidth: 2,
    height: 14,
    justifyContent: "center",
    padding: 1,
    width: 24,
  },
  batteryFill: {
    backgroundColor: "#111827",
    borderRadius: 2,
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  brand: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 13,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  tabBar: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderColor: "rgba(148,163,184,0.35)",
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  tabItem: {
    alignItems: "center",
    borderRadius: 20,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabItemActive: {
    backgroundColor: "rgba(249,115,22,0.12)",
  },
  tabItemPressed: {
    opacity: 0.8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
