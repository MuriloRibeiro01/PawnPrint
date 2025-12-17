import { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  Alert
} from "react-native";
import { Activity, Home, MapPin, User } from "lucide-react-native";

import { HealthMonitor } from "./src/health/HealthMonitor";
import { LocationMap } from "./src/map/LocationMap";
import { PetDashboard } from "./src/dashboard/PetDashboard";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { useTelemetryStream } from "./src/hooks/useTelemetryStream";
import { useTelemetryStore } from "./src/store/telemetry";

// Área com dados fictícios do pet - ver lógica para popular o app com dados reais
const petProfile = {
  // Dados do pet em si
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
  // Dados de localização do pet
  location: {
    lat: -23.5505,
    lng: -46.6333,
    address: "Rua das Flores, 123 - Jardim Paulista, São Paulo - SP",
  },
  // Dados da coleira inteligente
  collar: {
    battery: 78,
  },
  // Dados médicos fixos do pet
  healthDefaults: {
    heartRate: 72,
    temperature: 38.5,
    activityLevel: 68,
    stepsToday: 6240,
    waterIntake: 380,
    sleepHours: 10.5,
  },
  // Dados do dono do pet
  owner: {
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "+55 (11) 98765-4321",
    address: "Rua das Flores, 123 - Jardim Paulista, São Paulo - SP",
  },
};

// Abas disponíveis no app
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

// Informações das abas do app
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
          <View style={styles.screen}>
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
      </SafeAreaView>
    </LinearGradient>
  );
}

// Estilos dos componentes
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  screen: {
    backgroundColor: "#f8fafc",
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
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
