import { create } from "zustand";

export type TelemetryRecord = {
  heartRate: number;
  temperature: number;
  latitude: number;
  longitude: number;
  timestamp: string;
};

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closed"
  | "error";

type TelemetryState = {
  telemetry: TelemetryRecord;
  vitalsHistory: TelemetryRecord[];
  locationHistory: TelemetryRecord[];
  connectionStatus: ConnectionStatus;
  updateTelemetry: (record: Partial<TelemetryRecord>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  resetHistory: () => void;
};

const EMPTY_RECORD: TelemetryRecord = {
  heartRate: 0,
  temperature: 0,
  latitude: 0,
  longitude: 0,
  timestamp: new Date(0).toISOString(),
};

export const useTelemetryStore = create<TelemetryState>((set) => ({
  telemetry: EMPTY_RECORD,
  vitalsHistory: [],
  locationHistory: [],
  connectionStatus: "idle",
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  resetHistory: () => set({ vitalsHistory: [], locationHistory: [] }),
  updateTelemetry: (partialRecord) =>
    set((state) => {
      const timestamp =
        partialRecord.timestamp ?? new Date().toISOString();
      const nextTelemetry: TelemetryRecord = {
        ...state.telemetry,
        ...partialRecord,
        timestamp,
      };

      const shouldAppendVitals =
        typeof partialRecord.heartRate === "number" ||
        typeof partialRecord.temperature === "number";
      const updatedVitalsHistory = shouldAppendVitals
        ? [...state.vitalsHistory, nextTelemetry].slice(-120)
        : state.vitalsHistory;

      const shouldAppendLocation =
        typeof partialRecord.latitude === "number" ||
        typeof partialRecord.longitude === "number";
      const updatedLocationHistory = shouldAppendLocation
        ? [...state.locationHistory, nextTelemetry].slice(-200)
        : state.locationHistory;

      return {
        telemetry: nextTelemetry,
        vitalsHistory: updatedVitalsHistory,
        locationHistory: updatedLocationHistory,
      };
    }),
}));
