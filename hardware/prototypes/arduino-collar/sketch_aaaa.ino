#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"
#include <TinyGPSPlus.h>

// Configurações do WiFi
const char* ssid = "testeESP32";
const char* password = "12345678";

// Configurações do DHT11
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Configurações do GPS
TinyGPSPlus gps;
#define gpsSerial Serial2

// URL do servidor - CORRIGIDA
const char* serverURL = "http://172.22.99.95:3000/api/telemetry";

// Variáveis GPS
float gps_latitude = 0;
float gps_longitude = 0;
int satellites = 0;
float altitude = 0;
float speed = 0;
float course = 0;
String gps_date = "";
String gps_time = "";
bool gpsValid = false;

// Variáveis de timing
unsigned long lastTelemetryUpdate = 0;
const unsigned long TELEMETRY_INTERVAL = 5000;  // 5 segundos

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Inicializar GPS
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17);
  Serial.println("Inicializando GPS...");

  // Conectar ao WiFi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConectado! IP: " + WiFi.localIP().toString());
  Serial.println("Aguardando dados do GPS...");
}

void loop() {
  unsigned long currentTime = millis();

  // Processar dados GPS
  processarGPS();

  if (WiFi.status() == WL_CONNECTED) {
    // Enviar telemetria completa periodicamente
    if (currentTime - lastTelemetryUpdate >= TELEMETRY_INTERVAL) {
      enviarTelemetriaParaServidor();
      lastTelemetryUpdate = currentTime;
    }
  } else {
    Serial.println("WiFi desconectado! Tentando reconectar...");
    WiFi.reconnect();
    delay(5000);
  }

  delay(100);
}

void processarGPS() {
  while (gpsSerial.available() > 0) {
    if (gps.encode(gpsSerial.read())) {
      displayLocationInfo();
    }
  }

  if (millis() > 10000 && gps.charsProcessed() < 10) {
    Serial.println("Aviso: GPS não detectado - verifique a fiação.");
    gpsValid = false;
  }
}

void displayLocationInfo() {
  if (gps.location.isValid()) {
    gps_latitude = gps.location.lat();
    gps_longitude = gps.location.lng();
    satellites = gps.satellites.value();
    altitude = gps.altitude.meters();
    speed = gps.speed.kmph();
    course = gps.course.deg();
    gpsValid = true;

    // Formatar data
    if (gps.date.isValid()) {
      gps_date = String(gps.date.day()) + "/" + String(gps.date.month()) + "/" + String(gps.date.year());
    } else {
      gps_date = "Invalid";
    }

    // Formatar hora
    if (gps.time.isValid()) {
      char timeBuffer[12];
      snprintf(timeBuffer, sizeof(timeBuffer), "%02d:%02d:%02d",
               gps.time.hour(), gps.time.minute(), gps.time.second());
      gps_time = String(timeBuffer);
    } else {
      gps_time = "Invalid";
    }

    static unsigned long lastDisplay = 0;
    if (millis() - lastDisplay >= 10000) {
      Serial.println("=== DADOS GPS ===");
      Serial.print("Latitude: "); Serial.println(gps_latitude, 6);
      Serial.print("Longitude: "); Serial.println(gps_longitude, 6);
      Serial.print("Satellites: "); Serial.println(satellites);
      Serial.print("Altitude: "); Serial.print(altitude); Serial.println(" m");
      Serial.print("Speed: "); Serial.print(speed); Serial.println(" km/h");
      Serial.println("=================");
      lastDisplay = millis();
    }
  } else {
    gpsValid = false;
  }
}

void enviarTelemetriaParaServidor() {
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  // Ler dados do sensor DHT11
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();

  if (isnan(temperatura)) temperatura = -999;
  if (isnan(umidade)) umidade = -999;

  // Criar JSON com todos os dados
  String json = "{";
  
  // Dados do sensor
  json += "\"temperature\":" + String(temperatura) + ",";
  json += "\"humidity\":" + String(umidade) + ",";
  
  // Dados GPS (apenas se válidos)
  if (gpsValid) {
    json += "\"latitude\":" + String(gps_latitude, 6) + ",";
    json += "\"longitude\":" + String(gps_longitude, 6) + ",";
    json += "\"altitude\":" + String(altitude, 2) + ",";
    json += "\"speed\":" + String(speed, 2) + ",";
    json += "\"course\":" + String(course, 2) + ",";
    json += "\"satellites\":" + String(satellites) + ",";
    json += "\"date\":\"" + gps_date + "\",";
    json += "\"time\":\"" + gps_time + "\",";
  }
  
  json += "\"source\":\"arduino\",";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\"";
  json += "}";

  Serial.print("📤 Enviando telemetria: ");
  Serial.println(json);

  int httpResponseCode = http.POST(json);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("✅ Dados enviados! Resposta: ");
    Serial.println(response);
  } else {
    Serial.print("❌ Erro no envio: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}