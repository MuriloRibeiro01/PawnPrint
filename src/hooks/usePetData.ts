import { useMemo } from "react";
import { useTelemetryStore } from "../store/telemetry";

// export
export const usePetData = () => {
    const telemetry = useTelemetryStore((state) => state.telemetry); // obter dados de telemetria do estado global
    const vitalsHistory = useTelemetryStore((state) => state.vitalsHistory); // obter histórico de sinais vitais do estado global

    // Dados temporários do perfil do pet
    const petProfile = {
        // Informações básicas do pet
    };

    const healthData = useMemo(() => {
        // Mover a lógica do healthData para cá
        // Aparentemente é melhor usar uma conta matemática direta pra calcular alguns dados que sejam voláteis
    }, [telemetry, vitalsHistory]);

    const locationData = useMemo(() => {
        // Mover a lógica do locationData para cá
    }, [telemetry]);

    return {
        petProfile,
        healthData,
        locationData,
        isLoading: false, // loading state pro futuro
    };
};