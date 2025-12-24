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