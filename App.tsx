import { useState } from "react";
import { Home, MapPin, Activity, User } from "lucide-react";
import { PetDashboard } from "./components/PetDashboard";
import { LocationMap } from "./components/LocationMap";
import { HealthMonitor } from "./components/HealthMonitor";
import { ProfileScreen } from "./components/ProfileScreen";

// Mock data
const mockData = {
  pet: {
    name: "Max",
    breed: "Golden Retriever",
    age: 3,
    weight: 32,
    gender: "Macho",
    imageUrl: "https://images.unsplash.com/photo-1687211818108-667d028f1ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MXx8fHwxNzYwMzk3NzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    birthDate: "15/03/2022",
    microchipId: "982-000-123-456-789",
  },
  location: {
    lat: -23.5505,
    lng: -46.6333,
    address: "Rua das Flores, 123 - Jardim Paulista, São Paulo - SP",
  },
  health: {
    heartRate: 72,
    temperature: 38.5,
    activityLevel: 68,
    stepsToday: 6240,
    waterIntake: 380,
    sleepHours: 10.5,
  },
  collar: {
    battery: 78,
    lastSync: "há 2 minutos",
  },
  owner: {
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "+55 (11) 98765-4321",
    address: "Rua das Flores, 123 - Jardim Paulista, São Paulo - SP",
  },
};

type Tab = "home" | "map" | "health" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <PetDashboard
            petData={{
              ...mockData.pet,
              location: mockData.location,
              health: mockData.health,
              collar: mockData.collar,
            }}
          />
        );
      case "map":
        return <LocationMap location={mockData.location} petName={mockData.pet.name} />;
      case "health":
        return <HealthMonitor petName={mockData.pet.name} health={mockData.health} />;
      case "profile":
        return <ProfileScreen pet={mockData.pet} owner={mockData.owner} />;
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
                <rect x="0.5" y="0.5" width="15" height="11" rx="2.5" stroke="currentColor" className="text-gray-900"/>
                <path d="M16.5 4V8C17.5 7.5 17.5 4.5 16.5 4Z" fill="currentColor" className="text-gray-900"/>
                <rect x="1.5" y="1.5" width="13" height="9" rx="1.5" fill="currentColor" className="text-gray-900"/>
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="px-6 py-4">
            <h1 className="text-gray-900">pawnprint</h1>
            <p className="text-sm text-gray-600">Cuide do seu melhor amigo</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6">
            {renderContent()}
          </div>

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
