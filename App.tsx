import { useMemo, useState } from "react";
import { Activity, Home, MapPin, User } from "lucide-react";

import { HealthMonitor } from "./components/HealthMonitor";
import { LocationMap } from "./components/LocationMap";
import { PetDashboard } from "./components/PetDashboard";
import { ProfileScreen } from "./components/ProfileScreen";
import { useTelemetryStream } from "./hooks/useTelemetryStream";
import { useTelemetryStore } from "./store/telemetry";

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

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  useTelemetryStream();

  const telemetry = useTelemetryStore((state) => state.telemetry);
  const vitalsHistory = useTelemetryStore((state) => state.vitalsHistory);
  const locationHistory = useTelemetryStore((state) => state.locationHistory);
  const connectionStatus = useTelemetryStore(
    (state) => state.connectionStatus,
  );

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
      {/* iPhone Frame */}
      <div className="relative w-[390px] h-[844px] bg-black rounded-[60px] shadow-2xl p-3">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />

        {/* Screen */}
        <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white rounded-[48px] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-8 pt-3 pb-2 bg-transparent">
            <span className="text-sm text-gray-900">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="11"
                  rx="2.5"
                  stroke="currentColor"
                  className="text-gray-900"
                />
                <path
                  d="M16.5 4V8C17.5 7.5 17.5 4.5 16.5 4Z"
                  fill="currentColor"
                  className="text-gray-900"
                />
                <rect
                  x="1.5"
                  y="1.5"
                  width="13"
                  height="9"
                  rx="1.5"
                  fill="currentColor"
                  className="text-gray-900"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="px-6 py-4">
            <h1 className="text-gray-900">pawnprint</h1>
            <p className="text-sm text-gray-600">Cuide do seu melhor amigo</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6">{renderContent()}</div>

          {/* Bottom Navigation */}
          <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200 px-6 py-3 safe-area-bottom">
            <div className="flex items-center justify-around">
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  activeTab === "home" ? "text-orange-500" : "text-gray-500"
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs">Início</span>
              </button>

              <button
                onClick={() => setActiveTab("map")}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  activeTab === "map" ? "text-orange-500" : "text-gray-500"
                }`}
              >
                <MapPin className="w-6 h-6" />
                <span className="text-xs">Mapa</span>
              </button>

              <button
                onClick={() => setActiveTab("health")}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  activeTab === "health" ? "text-orange-500" : "text-gray-500"
                }`}
              >
                <Activity className="w-6 h-6" />
                <span className="text-xs">Saúde</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  activeTab === "profile" ? "text-orange-500" : "text-gray-500"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
