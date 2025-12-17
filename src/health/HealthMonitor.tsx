import { useMemo } from "react";
import {
  Activity,
  Droplets,
  Heart,
  TrendingUp,
} from "lucide-react-native";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Line as SvgLine, Polyline } from "react-native-svg";

import type { ConnectionStatus, TelemetryRecord } from "../store/telemetry";

interface HealthMonitorProps {
  petName: string;
  health: {
    heartRate: number;
    temperature: number;
    activityLevel: number;
    stepsToday: number;
    waterIntake: number;
    sleepHours: number;
  };
  history: TelemetryRecord[];
  connectionStatus: ConnectionStatus;
}

const { width } = Dimensions.get("window");
const CHART_WIDTH = Math.max(260, width - 80);
const CHART_HEIGHT = 160;

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

export function HealthMonitor({
  petName,
  health,
  history,
  connectionStatus,
}: HealthMonitorProps) {
  const stepsGoal = 8000;
  const waterGoal = 500;
  const sleepGoal = 12;

  const chartData = useMemo(() => {
    return history
      .filter((item) => item.heartRate > 0 && item.timestamp)
      .slice(-20)
      .map((item) => ({
        time: new Date(item.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        heartRate: item.heartRate,
        temperature: Number(item.temperature.toFixed(1)),
      }));
  }, [history]);

  const liveStatus = {
    idle: "Aguardando coleira",
    connecting: "Sincronizando dados",
    open: "Monitoramento ao vivo",
    closed: "Conexão encerrada",
    error: "Instável — verifique a coleira",
  }[connectionStatus];

  const heartValues = chartData.map((item) => item.heartRate);
  const tempValues = chartData.map((item) => item.temperature);

  const heartRange = {
    min: heartValues.length ? Math.min(50, ...heartValues) : 50,
    max: heartValues.length ? Math.max(160, ...heartValues) : 160,
  };

  const tempRange = {
    min: tempValues.length ? Math.min(35, ...tempValues) : 35,
    max: tempValues.length ? Math.max(42, ...tempValues) : 42,
  };

  const heartLine = chartData
    .map((item, index) => {
      if (chartData.length === 1) {
        return `${CHART_WIDTH / 2},${CHART_HEIGHT / 2}`;
      }
      const ratio = index / (chartData.length - 1);
      const x = ratio * CHART_WIDTH;
      const clamped = Math.min(heartRange.max, Math.max(heartRange.min, item.heartRate));
      const normalized = (clamped - heartRange.min) / (heartRange.max - heartRange.min || 1);
      const y = CHART_HEIGHT - normalized * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(" ");

  const temperatureLine = chartData
    .map((item, index) => {
      if (chartData.length === 1) {
        return `${CHART_WIDTH / 2},${CHART_HEIGHT / 2}`;
      }
      const ratio = index / (chartData.length - 1);
      const x = ratio * CHART_WIDTH;
      const clamped = Math.min(tempRange.max, Math.max(tempRange.min, item.temperature));
      const normalized = (clamped - tempRange.min) / (tempRange.max - tempRange.min || 1);
      const y = CHART_HEIGHT - normalized * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Monitoramento ao vivo de <Text style={styles.descriptionHighlight}>{petName}</Text>.
      </Text>

      <View style={[styles.card, styles.redGradient]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Heart color="#ef4444" size={22} />
            <Text style={styles.cardTitle}>Frequência Cardíaca</Text>
          </View>
          <Text style={styles.cardSubtitle}>{liveStatus}</Text>
        </View>
        <Text style={styles.primaryValue}>{health.heartRate} BPM</Text>
        <Text style={styles.secondaryText}>Faixa saudável: 60-140 BPM</Text>

        <View style={styles.chartWrapper}>
          {chartData.length > 0 ? (
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <SvgLine
                x1={0}
                y1={CHART_HEIGHT}
                x2={CHART_WIDTH}
                y2={CHART_HEIGHT}
                stroke="#e5e7eb"
                strokeDasharray="4 8"
              />
              <SvgLine x1={0} y1={0} x2={0} y2={CHART_HEIGHT} stroke="#e5e7eb" />
              <Polyline
                points={heartLine}
                stroke="#ef4444"
                strokeWidth={3}
                fill="none"
              />
              <Polyline
                points={temperatureLine}
                stroke="#f59e0b"
                strokeWidth={3}
                fill="none"
                strokeDasharray="6 6"
              />
            </Svg>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>
                Aguardando sinais vitais recentes da coleira.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.card, styles.orangeGradient]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Temperatura Corporal</Text>
          <Text style={styles.statusTag}>● Saudável</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.primaryValue}>{health.temperature}°C</Text>
          <Text style={styles.secondaryText}>(Normal: 38-39°C)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  description: {
    color: "#6b7280",
    fontSize: 12,
  },
  descriptionHighlight: {
    color: "#111827",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  redGradient: {
    backgroundColor: "#fee2e2",
  },
  orangeGradient: {
    backgroundColor: "#ffedd5",
  },
  yellowGradient: {
    backgroundColor: "#fef3c7",
  },
  sunsetGradient: {
    backgroundColor: "#fed7aa",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#6b7280",
    fontSize: 12,
  },
  primaryValue: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
  },
  secondaryText: {
    color: "#6b7280",
    fontSize: 12,
  },
  chartWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  emptyChart: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    height: CHART_HEIGHT,
    justifyContent: "center",
    width: CHART_WIDTH,
  },
  emptyChartText: {
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  statusTag: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "600",
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  metricBlock: {
    gap: 8,
    marginTop: 8,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  progressTrack: {
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    backgroundColor: "#fb923c",
    borderRadius: 999,
    height: "100%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  summaryColumn: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  weekGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 12,
  },
  weekColumn: {
    flexBasis: "48%",
    gap: 4,
  },
});
