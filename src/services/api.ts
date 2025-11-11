import { Platform } from "react-native";

import type { TelemetryRecord } from "../store/telemetry";

const DEFAULT_API_BASE = "http://localhost:3000";

const API_BASE =
  typeof process !== "undefined" &&
  process.env &&
  typeof process.env.EXPO_PUBLIC_API_BASE_URL === "string" &&
  process.env.EXPO_PUBLIC_API_BASE_URL.length > 0
    ? process.env.EXPO_PUBLIC_API_BASE_URL
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

export function connectToTelemetryStream(
  handler: TelemetryStreamHandler,
): EventSource | null {
  if (Platform.OS !== "web" || typeof EventSource === "undefined") {
    return null;
  }

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

export function startTelemetryPolling(
  handler: TelemetryStreamHandler,
  intervalMs = 5000,
) {
  let isActive = true;

  async function poll() {
    if (!isActive) {
      return;
    }

    try {
      const [vitals, location] = await Promise.all([
        fetchVitals(),
        fetchLocation(),
      ]);

      const timestamp = new Date().toISOString();

      if (vitals) {
        handler({
          heartRate: vitals.heartRate,
          temperature: vitals.temperature,
          latitude: location?.latitude ?? 0,
          longitude: location?.longitude ?? 0,
          timestamp: vitals.timestamp ?? location?.timestamp ?? timestamp,
        });
      } else if (location) {
        handler({
          heartRate: 0,
          temperature: 0,
          latitude: location.latitude ?? 0,
          longitude: location.longitude ?? 0,
          timestamp: location.timestamp ?? timestamp,
        });
      }
    } catch (error) {
      console.error("Failed to poll telemetry", error);
    } finally {
      if (isActive) {
        setTimeout(poll, intervalMs);
      }
    }
  }

  poll();

  return () => {
    isActive = false;
  };
}
