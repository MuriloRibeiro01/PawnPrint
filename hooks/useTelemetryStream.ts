import { useEffect } from "react";
import { Platform } from "react-native";

import {
  fetchLocation,
  fetchVitals,
  connectToTelemetryStream,
  startTelemetryPolling,
} from "../services/api";
import { useTelemetryStore } from "../store/telemetry";
import type { TelemetryRecord } from "../store/telemetry";

export function useTelemetryStream() {
  const updateTelemetry = useTelemetryStore((state) => state.updateTelemetry);
  const setConnectionStatus = useTelemetryStore(
    (state) => state.setConnectionStatus,
  );

  useEffect(() => {
    let isMounted = true;
    let stopPolling: (() => void) | null = null;

    async function loadInitialData() {
      setConnectionStatus("connecting");

      const [vitals, location] = await Promise.all([
        fetchVitals(),
        fetchLocation(),
      ]);

      if (!isMounted) return;

      if (vitals) {
        const vitalPatch: Partial<TelemetryRecord> = {
          heartRate: vitals.heartRate,
          temperature: vitals.temperature,
        };
        if (typeof vitals.timestamp === "string") {
          vitalPatch.timestamp = vitals.timestamp;
        }
        updateTelemetry(vitalPatch);
      }

      if (location) {
        const locationPatch: Partial<TelemetryRecord> = {};
        if (typeof location.latitude === "number") {
          locationPatch.latitude = location.latitude;
        }
        if (typeof location.longitude === "number") {
          locationPatch.longitude = location.longitude;
        }
        if (typeof location.timestamp === "string") {
          locationPatch.timestamp = location.timestamp;
        }
        updateTelemetry(locationPatch);
      }

      if (!vitals && !location) {
        setConnectionStatus("error");
      }

      if (Platform.OS === "web") {
        const eventSource = connectToTelemetryStream((record) => {
          updateTelemetry(record);
          setConnectionStatus("open");
        });

        if (eventSource) {
          eventSource.onerror = (event) => {
            console.error("Telemetry stream error", event);
            setConnectionStatus("error");
          };

          eventSource.onopen = () => {
            setConnectionStatus("open");
          };

          return eventSource;
        }
      }

      stopPolling = startTelemetryPolling((record) => {
        updateTelemetry(record);
        setConnectionStatus("open");
      });

      return null;
    }

    let source: ReturnType<typeof connectToTelemetryStream> = null;

    loadInitialData().then((createdSource) => {
      source = createdSource;
    });

    return () => {
      isMounted = false;
      if (source) {
        source.close();
      }
      if (stopPolling) {
        stopPolling();
      }
      setConnectionStatus("closed");
    };
  }, [setConnectionStatus, updateTelemetry]);
}
