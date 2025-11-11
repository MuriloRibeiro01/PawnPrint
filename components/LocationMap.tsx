import { MapPin, Navigation, Home, RadioTower } from "lucide-react";

import type { ConnectionStatus, TelemetryRecord } from "../store/telemetry";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

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

export function LocationMap({
  location,
  petName,
  history,
  connectionStatus,
}: LocationMapProps) {
  const connectionLabel = {
    idle: { text: "Aguardando", color: "bg-gray-400" },
    connecting: { text: "Conectando", color: "bg-yellow-500" },
    open: { text: "Ao vivo", color: "bg-red-500" },
    closed: { text: "Encerrado", color: "bg-gray-400" },
    error: { text: "Instável", color: "bg-orange-500" },
  }[connectionStatus];

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
    <div className="flex flex-col gap-4 pb-6">
      {/* Map Container */}
      <Card
        className="relative overflow-hidden border-gray-200"
        style={{ height: "400px" }}
      >
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50">
          {/* Grid pattern to simulate map */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Streets simulation */}
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300/50" />
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400/60" />
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300/50" />
          <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-gray-300/50" />
          <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-gray-300/50" />

          {/* Pet location marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="relative">
              <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-ping" />
              <div className="relative bg-red-500 rounded-full p-3 shadow-lg">
                <MapPin className="w-6 h-6 text-white" fill="white" />
              </div>
            </div>
          </div>

          {/* Home marker */}
          <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-full">
            <div className="bg-gray-700 rounded-full p-2 shadow-md">
              <Home className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full bg-white shadow-lg"
          >
            +
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full bg-white shadow-lg"
          >
            −
          </Button>
        </div>

        {/* Live indicator */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2">
          <RadioTower className="w-4 h-4 text-orange-500" />
          <span className="text-xs text-gray-700">{connectionLabel.text}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "open"
                ? "bg-red-500 animate-pulse"
                : connectionLabel.color
            }`}
          />
        </div>
      </Card>

      {/* Location Details */}
      <Card className="p-4 bg-white/80 backdrop-blur-lg border-gray-200">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-orange-500 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Localização de {petName}</p>
            <p className="text-gray-900">{location.address}</p>
            <p className="text-xs text-gray-500 mt-2">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        </div>

        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Navigation className="w-4 h-4 mr-2" />
          Ir até {petName}
        </Button>
      </Card>

      {/* History Card */}
      <Card className="p-4 bg-white/80 backdrop-blur-lg border-gray-200">
        <p className="text-sm text-gray-700 mb-3">Últimas posições transmitidas</p>
        <div className="space-y-3">
          {recentLocations.length === 0 ? (
            <p className="text-xs text-gray-500">
              Aguardando pacotes de localização da coleira inteligente.
            </p>
          ) : (
            recentLocations.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    index === 0 ? "bg-red-500" : "bg-orange-400"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
                  </p>
                  <p className="text-xs text-gray-500">{item.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
