import { Heart, Activity, MapPin, Battery, Thermometer } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { ConnectionStatus } from "../store/telemetry";

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

export function PetDashboard({ petData, connectionStatus }: PetDashboardProps) {
  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "text-green-500";
    if (battery > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const connectionLabel =
    {
      idle: { text: "Iniciando", color: "bg-gray-400" },
      connecting: { text: "Conectando", color: "bg-yellow-500" },
      open: { text: "Ao vivo", color: "bg-red-500" },
      closed: { text: "Pausado", color: "bg-gray-400" },
      error: { text: "Instável", color: "bg-orange-500" },
    }[connectionStatus] ?? {
      text: "Sem conexão",
      color: "bg-gray-400",
    };

  const getActivityStatus = (level: number) => {
    if (level > 70) return { text: "Muito Ativo", color: "bg-orange-500" };
    if (level > 40) return { text: "Ativo", color: "bg-yellow-500" };
    return { text: "Descansando", color: "bg-gray-500" };
  };

  const activityStatus = getActivityStatus(petData.health.activityLevel);

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Pet Info Card */}
      <Card className="p-4 bg-white/80 backdrop-blur-lg border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <ImageWithFallback
              src={petData.imageUrl}
              alt={petData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900">{petData.name}</h2>
            <p className="text-sm text-gray-600">{petData.breed}</p>
            <Badge className={`${activityStatus.color} text-white mt-1 border-0`}>
              {activityStatus.text}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-white ${connectionLabel.color}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === "open"
                      ? "bg-white animate-pulse"
                      : "bg-white/70"
                  }`}
                />
                {connectionLabel.text}
              </span>
            </div>
            <div className={`${getBatteryColor(petData.collar.battery)} text-sm`}>Bateria</div>
            <div className={`${getBatteryColor(petData.collar.battery)}`}>
              <Battery className="w-6 h-6" />
              <p className="text-xs text-center">{petData.collar.battery}%</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 px-3 py-2 text-xs text-gray-600">
          Último pacote: <span className="font-medium text-gray-900">{petData.collar.lastSync}</span>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-700">Batimentos</span>
          </div>
          <p className="text-gray-900">{petData.health.heartRate} BPM</p>
          <p className="text-xs text-gray-600 mt-1">Normal</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-700">Temperatura</span>
          </div>
          <p className="text-gray-900">{petData.health.temperature}°C</p>
          <p className="text-xs text-gray-600 mt-1">Saudável</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-700">Atividade</span>
          </div>
          <p className="text-gray-900">{petData.health.activityLevel}%</p>
          <p className="text-xs text-gray-600 mt-1">Hoje</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-700">Passos</span>
          </div>
          <p className="text-gray-900">{petData.health.stepsToday.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">Meta: 8000</p>
        </Card>
      </div>

      {/* Location Card */}
      <Card className="p-4 bg-white/80 backdrop-blur-lg border-gray-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-1">Localização Atual</p>
            <p className="text-sm text-gray-900">{petData.location.address}</p>
            <p className="text-xs text-gray-500 mt-2">
              {petData.location.lat.toFixed(5)}, {petData.location.lng.toFixed(5)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Última atualização: {petData.collar.lastSync}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
