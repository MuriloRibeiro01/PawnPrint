const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ===== DADOS DO SENSOR =====
let dadosSensor = {
  temperatura: 0,
  umidade: 0,
  ultimaAtualizacao: null
};

// ===== DADOS DE LOCALIZAÇÃO (GPS) =====
let dadosLocalizacao = {
  latitude: 0,
  longitude: 0,
  altitude: 0,
  speed: 0,
  course: 0,
  satellites: 0,
  date: "",
  time: "",
  source: "gps",
  ultimaAtualizacao: null
};

// ===== ENDPOINT: SENSOR =====
app.post('/data', (req, res) => {
  const { temperatura, umidade } = req.body;

  dadosSensor = {
    temperatura: temperatura || 0,
    umidade: umidade || 0,
    ultimaAtualizacao: new Date().toLocaleString('pt-BR')
  };

  console.log(`📊 Sensor → Temp: ${temperatura}°C | Umid: ${umidade}%`);
  res.json({ status: 'success', message: 'Dados do sensor recebidos' });
});

// ===== ENDPOINT: LOCALIZAÇÃO =====
app.post('/location', (req, res) => {
  const { latitude, longitude, altitude, speed, course, satellites, date, time, source } = req.body;

  dadosLocalizacao = {
    latitude: latitude || 0,
    longitude: longitude || 0,
    altitude: altitude || 0,
    speed: speed || 0,
    course: course || 0,
    satellites: satellites || 0,
    date: date || "",
    time: time || "",
    source: source || "gps",
    ultimaAtualizacao: new Date().toLocaleString('pt-BR')
  };

  console.log(`📍 GPS → Lat: ${latitude}, Lon: ${longitude}`);
  console.log(`   Alt: ${altitude}m | Vel: ${speed}km/h | Satélites: ${satellites}`);
  console.log(`   Data: ${date} | Hora: ${time}`);
  res.json({ status: 'success', message: 'Localização GPS recebida' });
});

// PÁGINA HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// ===== ENDPOINTS JSON =====
app.get('/dados-sensor', (req, res) => res.json(dadosSensor));
app.get('/dados-localizacao', (req, res) => res.json(dadosLocalizacao));

// ===== STATUS =====
app.get('/status', (req, res) => {
  res.json({
    servidor: 'Online',
    porta: port,
    timestamp: new Date().toISOString(),
    dadosSensor,
    dadosLocalizacao
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`📍 Servidor rodando em http://localhost:${port}`);
  console.log(`📡 Aguardando dados do ESP32...`);
});
