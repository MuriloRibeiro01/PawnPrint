import React, { useMemo } from "react";
import { Activity, Heart } from "lucide-react-native";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Line as SvgLine, Polyline } from "react-native-svg";

// 1. IMPORTS ORGANIZADOS
import { useTelemetryStore } from "../store/telemetry"; // Busca dados sozinho
import { generateChartPath } from "../utils/chart";     // Importa a matemática
import { ProgressBar } from "../components/ui/progressBar"; // Importa o LEGO
import { ConnectionStatus } from "../store/telemetry"; // Importa tipos

// Constantes visuais
const { width } = Dimensions.get("window");
const CHART_WIDTH = Math.max(260, width - 80);
const CHART_HEIGHT = 160;

const STATUS_TEXT: Record<ConnectionStatus, string> = {
  idle: "Aguardando",
  connecting: "Sincronizando...",
  open: "Ao vivo",
  closed: "Desconectado",
  error: "Erro de sinal",
};

export function HealthMonitor() {
  // 2. BUSCA DE DADOS (Independência)
  const telemetry = useTelemetryStore((state) => state.telemetry);
  const history = useTelemetryStore((state) => state.vitalsHistory);
  const connectionStatus = useTelemetryStore((state) => state.connectionStatus);

  // Dados Mockados que viriam de um perfil
  const petName = "Max";
  
  // 3. PREPARAÇÃO DOS DADOS (Regra de Negócio Visual)
  const chartData = useMemo(() => {
    // Pega os últimos 20 registros válidos
    return history
      .filter((item) => item.heartRate > 0)
      .slice(-20);
  }, [history]);

  // Separa os arrays para o gráfico
  const heartValues = chartData.map(d => d.heartRate);
  const tempValues = chartData.map(d => d.temperature);

  // 4. GERAÇÃO DO GRÁFICO (Usando o Utilitário)
  // Note como ficou limpo: "Gera o caminho, dados X, tamanho Y"
  const heartLinePath = useMemo(() => 
    generateChartPath(heartValues, CHART_WIDTH, CHART_HEIGHT, 50, 160), 
  [heartValues]);

  const tempLinePath = useMemo(() => 
    generateChartPath(tempValues, CHART_WIDTH, CHART_HEIGHT, 35, 42), 
  [tempValues]);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Monitoramento ao vivo de <Text style={styles.descriptionHighlight}>{petName}</Text>.
      </Text>

      {/* CARD CARDÍACO */}
      <View style={[styles.card, styles.redGradient]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Heart color="#ef4444" size={22} />
            <Text style={styles.cardTitle}>Frequência Cardíaca</Text>
          </View>
          <Text style={styles.cardSubtitle}>
             {STATUS_TEXT[connectionStatus] || "Offline"}
          </Text>
        </View>
        
        <Text style={styles.primaryValue}>
            {telemetry.heartRate > 0 ? `${telemetry.heartRate} BPM` : '--'}
        </Text>
        <Text style={styles.secondaryText}>Faixa saudável: 60-140 BPM</Text>

        {/* GRÁFICO SVG */}
        <View style={styles.chartWrapper}>
          {chartData.length > 1 ? (
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              {/* Linhas de grade */}
              <SvgLine x1={0} y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} stroke="#e5e7eb" strokeDasharray="4 8" />
              <SvgLine x1={0} y1={0} x2={0} y2={CHART_HEIGHT} stroke="#e5e7eb" />
              
              {/* Linha Temperatura (Laranja) */}
              <Polyline
                points={tempLinePath}
                stroke="#f59e0b"
                strokeWidth={3}
                fill="none"
                strokeDasharray="6 6"
              />
              {/* Linha Coração (Vermelha) */}
              <Polyline
                points={heartLinePath}
                stroke="#ef4444"
                strokeWidth={3}
                fill="none"
              />
            </Svg>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>Coletando dados...</Text>
            </View>
          )}
        </View>
      </View>

      {/* CARD TEMPERATURA */}
      <View style={[styles.card, styles.orangeGradient]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Temperatura Corporal</Text>
          <Text style={styles.statusTag}>
             {telemetry.temperature > 39.5 ? "⚠️ Febre" : "● Saudável"}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.primaryValue}>
             {telemetry.temperature > 0 ? `${telemetry.temperature.toFixed(1)}°C` : '--'}
          </Text>
          <Text style={styles.secondaryText}>(Normal: 38-39°C)</Text>
        </View>
        
        {/* Exemplo de uso do componente reutilizável */}
        <View style={{ marginTop: 10 }}>
            <Text style={{fontSize: 12, marginBottom: 5}}>Nível de Hidratação (Simulado)</Text>
            <ProgressBar value={75} color="#3b82f6" />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  // ... (MANTENHA OS ESTILOS ANTIGOS AQUI, SÓ REMOVA OS DO ProgressBar)
  // Cole aqui o styles.container, styles.card, etc...
  container: { gap: 16, paddingBottom: 24 },
  description: { color: "#6b7280", fontSize: 12 },
  descriptionHighlight: { color: "#111827", fontWeight: "600" },
  card: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 24, padding: 20, gap: 12 },
  redGradient: { backgroundColor: "#fee2e2" },
  orangeGradient: { backgroundColor: "#ffedd5" },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { color: "#111827", fontSize: 16, fontWeight: "600" },
  cardSubtitle: { color: "#6b7280", fontSize: 12 },
  primaryValue: { color: "#111827", fontSize: 28, fontWeight: "700" },
  secondaryText: { color: "#6b7280", fontSize: 12 },
  chartWrapper: { alignItems: "center", marginTop: 8 },
  emptyChart: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 16, height: 160, justifyContent: "center", width: 260 },
  emptyChartText: { color: "#9ca3af", fontSize: 12 },
  statusTag: { color: "#16a34a", fontSize: 12, fontWeight: "600" },
  metricRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
});