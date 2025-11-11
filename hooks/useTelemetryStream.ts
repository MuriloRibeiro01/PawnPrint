import { useEffect } from "react";

import { fetchLocation, fetchVitals, connectToTelemetryStream } from "../services/api";
import { useTelemetryStore } from "../store/telemetry";

export function useTelemetryStream() {
  const updateTelemetry = useTelemetryStore((state) => state.updateTelemetry);
  const setConnectionStatus = useTelemetryStore(
    (state) => state.setConnectionStatus,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setConnectionStatus("connecting");

      const [vitals, location] = await Promise.all([
        fetchVitals(),
        fetchLocation(),
      ]);

      if (!isMounted) return;

      if (vitals) {
        updateTelemetry({
          heartRate: vitals.heartRate,
          temperature: vitals.temperature,
          timestamp: vitals.timestamp,
        });
      }

      if (location) {
        updateTelemetry({
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp,
        });
      }

      if (!vitals && !location) {
        setConnectionStatus("error");
      }

      const eventSource = connectToTelemetryStream((record) => {
        updateTelemetry(record);
        setConnectionStatus("open");
      });

      eventSource.onerror = (event) => {
        console.error("Telemetry stream error", event);
        setConnectionStatus("error");
      };

      eventSource.onopen = () => {
        setConnectionStatus("open");
      };

      return eventSource;
    }

    let source: EventSource | null = null;

    loadInitialData().then((createdSource) => {
      source = createdSource ?? null;
    });

    return () => {
      isMounted = false;
      if (source) {
        source.close();
      }
      setConnectionStatus("closed");
    };
  }, [setConnectionStatus, updateTelemetry]);
}
