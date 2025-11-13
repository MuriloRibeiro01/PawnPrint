const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const API_PREFIX = "/api";

app.use(cors());
app.use(express.json());

let latestTelemetry = {
  heartRate: 0,
  temperature: 0,
  latitude: 0,
  longitude: 0,
  timestamp: new Date(0).toISOString(),
};

const sseClients = new Set();

function broadcastTelemetry(record) {
  const payload = JSON.stringify(record);
  for (const res of sseClients) {
    res.write(`data: ${payload}\n\n`);
  }
}

function normalizeTelemetry(update = {}) {
  const timestamp = update.timestamp || new Date().toISOString();
  const heartRate = Number.isFinite(Number(update.heartRate))
    ? Number(update.heartRate)
    : latestTelemetry.heartRate;
  const temperature = Number.isFinite(Number(update.temperature))
    ? Number(update.temperature)
    : latestTelemetry.temperature;
  const latitude = Number.isFinite(Number(update.latitude ?? update.lat))
    ? Number(update.latitude ?? update.lat)
    : latestTelemetry.latitude;
  const longitude = Number.isFinite(Number(update.longitude ?? update.lon))
    ? Number(update.longitude ?? update.lon)
    : latestTelemetry.longitude;

  latestTelemetry = {
    heartRate,
    temperature,
    latitude,
    longitude,
    timestamp,
  };

  broadcastTelemetry(latestTelemetry);

  return latestTelemetry;
}

app.get("/", (_req, res) => {
  res.json({ status: "PawnPrint API", endpoints: [`${API_PREFIX}/vitals`, `${API_PREFIX}/location`, `${API_PREFIX}/stream`] });
});

app.get(`${API_PREFIX}/vitals`, (_req, res) => {
  const { heartRate, temperature, timestamp } = latestTelemetry;
  res.json({ heartRate, temperature, timestamp });
});

app.get(`${API_PREFIX}/location`, (_req, res) => {
  const { latitude, longitude, timestamp } = latestTelemetry;
  res.json({ latitude, longitude, timestamp });
});

app.post(`${API_PREFIX}/telemetry`, (req, res) => {
  console.log("📡 Telemetria recebida:", req.body);
  const updated = normalizeTelemetry(req.body || {});
  res.json({ status: "ok", telemetry: updated });
});


app.get(`${API_PREFIX}/stream`, (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write(`data: ${JSON.stringify(latestTelemetry)}\n\n`);
  sseClients.add(res);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

let serialPort;
let serialParser;

try {
  const { SerialPort } = require("serialport");
  const { ReadlineParser } = require("@serialport/parser-readline");

  const serialPath = process.env.SERIAL_PORT || process.env.SERIAL_PORT_PATH;
  const baudRate = Number(process.env.SERIAL_BAUD_RATE || 115200);

  if (serialPath) {
    serialPort = new SerialPort({ path: serialPath, baudRate });
    serialParser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

    serialParser.on("data", (line) => {
      try {
        const data = JSON.parse(line);
        normalizeTelemetry(data);
        console.log("🔄 Telemetria recebida da serial:", data);
      } catch (error) {
        console.warn("⚠️  Não foi possível interpretar a linha da serial:", line);
      }
    });

    serialPort.on("open", () => {
      console.log(`✅ Porta serial conectada em ${serialPath} (${baudRate} baud)`);
    });

    serialPort.on("error", (error) => {
      console.error("Erro na porta serial:", error.message);
    });
  } else {
    console.log("ℹ️  Nenhuma porta serial configurada. Iniciando modo simulado.");
  }
} catch (error) {
  console.log("ℹ️  Pacote serialport não disponível. Iniciando modo simulado.");
}

if (!serialPort) {
  setInterval(() => {
    const simulated = {
      heartRate: 70 + Math.round(Math.random() * 30),
      temperature: latestTelemetry.temperature,       // real (do ESP32)
      latitude: latestTelemetry.latitude,             // real (do ESP32)
      longitude: latestTelemetry.longitude,           // real (do ESP32)
      timestamp: new Date().toISOString(),
    };

    normalizeTelemetry(simulated);
  }, 3000);
}

server.listen(PORT, () => {
  console.log(`🚀 API de telemetria disponível em http://localhost:${PORT}`);
  console.log(`🌐 Endpoints: ${API_PREFIX}/vitals, ${API_PREFIX}/location, ${API_PREFIX}/stream`);
});
