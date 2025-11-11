import type { TelemetryRecord } from "../store/telemetry";

const DEFAULT_API_BASE = "http://localhost:3000";

const API_BASE =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL
    : DEFAULT_API_BASE;

export type TelemetryResponse = {
  heartRate: number;
  temperature: number;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
};

export async function fetchVitals(): Promise<TelemetryResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/api/vitals`);
    if (!response.ok) {
      throw new Error(`Failed to load vitals (${response.status})`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch vitals", error);
    return null;
  }
}

export async function fetchLocation(): Promise<TelemetryResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/api/location`);
    if (!response.ok) {
      throw new Error(`Failed to load location (${response.status})`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch location", error);
    return null;
  }
}

export type TelemetryStreamHandler = (record: TelemetryRecord) => void;

export function connectToTelemetryStream(handler: TelemetryStreamHandler) {
  const eventSource = new EventSource(`${API_BASE}/api/stream`);

  eventSource.onopen = () => {
    console.info("Telemetry stream connected");
  };

  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      handler(payload);
    } catch (error) {
      console.error("Failed to parse telemetry event", error);
    }
  };

  return eventSource;
}
