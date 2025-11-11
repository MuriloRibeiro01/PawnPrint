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

// URLs dos servidores
const char* locationServerURL = "http://192.168.0.199:3000/location";
const char* sensorServerURL = "http://192.168.0.199:3000/data";

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
unsigned long lastLocationUpdate = 0;
unsigned long lastSensorUpdate = 0;
unsigned long lastGPSUpdate = 0;
const unsigned long LOCATION_INTERVAL = 30000;  // 30 segundos
const unsigned long SENSOR_INTERVAL = 1000;     // 1 segundo
const unsigned long GPS_INTERVAL = 5000;        // 5 segundos

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
    // Atualizar localização periodicamente apenas se GPS estiver válido
    if (currentTime - lastLocationUpdate >= LOCATION_INTERVAL) {
      if (gpsValid) {
        enviarLocalizacaoParaServidor();
        lastLocationUpdate = currentTime;
      } else {
        Serial.println("GPS não disponível - aguardando fix...");
      }
    }

    // Processar e enviar dados GPS detalhados periodicamente
    if (currentTime - lastGPSUpdate >= GPS_INTERVAL && gpsValid) {
      enviarDadosGPSParaServidor();
      lastGPSUpdate = currentTime;
    }

    // Ler e enviar dados do sensor periodicamente
    if (currentTime - lastSensorUpdate >= SENSOR_INTERVAL) {
      float h = dht.readHumidity();
      float t = dht.readTemperature();

      if (!isnan(h) && !isnan(t)) {
        enviarDadosSensorParaServidor(t, h);
        lastSensorUpdate = currentTime;
      } else {
        Serial.println("Erro na leitura do sensor DHT11!");
      }
    }

  } else {
    Serial.println("WiFi desconectado! Tentando reconectar...");
    WiFi.reconnect();
    delay(5000);
  }

  delay(100);  // Pequeno delay para evitar sobrecarga
}

// ========== FUNÇÕES GPS ==========

void processarGPS() {
  while (gpsSerial.available() > 0) {
    if (gps.encode(gpsSerial.read())) {
      displayLocationInfo();
    }
  }

  // Verificar se o GPS não está respondendo
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

    // Exibir informações no serial apenas a cada 10 segundos para evitar spam
    static unsigned long lastDisplay = 0;
    if (millis() - lastDisplay >= 10000) {
      Serial.println("=== DADOS GPS ===");
      Serial.print("Latitude:  ");
      Serial.print(gps_latitude, 6);
      Serial.println(gps.location.rawLat().negative ? " S" : " N");

      Serial.print("Longitude: ");
      Serial.print(gps_longitude, 6);
      Serial.println(gps.location.rawLng().negative ? " W" : " E");

      Serial.print("Fix Quality: ");
      Serial.println("Valid");
      Serial.print("Satellites: ");
      Serial.println(satellites);
      Serial.print("Altitude: ");
      Serial.print(altitude);
      Serial.println(" m");
      Serial.print("Speed: ");
      Serial.print(speed);
      Serial.println(" km/h");
      Serial.print("Course: ");
      Serial.print(course);
      Serial.println("°");
      Serial.print("Date: ");
      Serial.println(gps_date);
      Serial.print("Time (UTC): ");
      Serial.println(gps_time);
      Serial.println("=================");
      lastDisplay = millis();
    }

  } else {
    gpsValid = false;
    static unsigned long lastWarning = 0;
    if (millis() - lastWarning >= 15000) {
      Serial.println("GPS: Aguardando fix de satélites...");
      lastWarning = millis();
    }
  }
}

void enviarDadosGPSParaServidor() {
  if (!gpsValid) return;

  HTTPClient http;
  http.begin(locationServerURL);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"latitude\":" + String(gps_latitude, 6) + ",";
  json += "\"longitude\":" + String(gps_longitude, 6) + ",";
  json += "\"altitude\":" + String(altitude, 2) + ",";
  json += "\"speed\":" + String(speed, 2) + ",";
  json += "\"course\":" + String(course, 2) + ",";
  json += "\"satellites\":" + String(satellites) + ",";
  json += "\"date\":\"" + gps_date + "\",";
  json += "\"time\":\"" + gps_time + "\",";
  json += "\"source\":\"gps\"";
  json += "}";

  int httpResponseCode = http.POST(json);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("Dados GPS enviados! Resposta: ");
    Serial.println(response);
  } else {
    Serial.print("Erro no envio dos dados GPS: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

void enviarLocalizacaoParaServidor() {
  if (!gpsValid) return;

  HTTPClient http;
  http.begin(locationServerURL);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"latitude\":" + String(gps_latitude, 6) + ",";
  json += "\"longitude\":" + String(gps_longitude, 6) + ",";
  json += "\"altitude\":" + String(altitude, 2) + ",";
  json += "\"speed\":" + String(speed, 2) + ",";
  json += "\"satellites\":" + String(satellites) + ",";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"source\":\"gps\"";
  json += "}";

  int httpResponseCode = http.POST(json);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("Localização enviada! Resposta: ");
    Serial.println(response);
  } else {
    Serial.print("Erro no envio da localização: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

// ========== FUNÇÕES DO SENSOR DHT11 ==========

void enviarDadosSensorParaServidor(float temperatura, float umidade) {
  HTTPClient http;

  http.begin(sensorServerURL);
  http.addHeader("Content-Type", "application/json");

  String json = "{\"temperatura\":" + String(temperatura) + ",\"umidade\":" + String(umidade) + "}";

  int httpResponseCode = http.POST(json);

  if (httpResponseCode > 0) {
    String response = http.getString();

    Serial.print("Dados enviados - Temp: ");
    Serial.print(temperatura);
    Serial.print("°C, Hum: ");
    Serial.print(umidade);
    Serial.print("%, Resposta: ");
    Serial.println(response);
  } else {
    Serial.print("Erro no envio dos dados do sensor: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}