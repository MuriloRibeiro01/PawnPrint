#include <TinyGPSPlus.h>
#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;

#define gpsSerial Serial2

struct Telemetry {
  int heartRate;
  float temperature;
  double latitude;
  double longitude;
  String timestamp;
};

unsigned long lastTelemetrySent = 0;
const unsigned long TELEMETRY_INTERVAL = 2000;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17);
  dht.begin();

  Serial.println("PawnPrint firmware inicializada. Aguardando sensores...");
}

void loop() {
  processGPS();

  if (millis() - lastTelemetrySent >= TELEMETRY_INTERVAL) {
    Telemetry telemetry = readTelemetry();
    sendTelemetry(telemetry);
    lastTelemetrySent = millis();
  }
}

void processGPS() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }
}

Telemetry readTelemetry() {
  Telemetry t;

  float temperature = dht.readTemperature();
  if (isnan(temperature)) {
    temperature = 37.5 + random(-10, 10) / 10.0;
  }

  t.temperature = temperature;
  t.heartRate = 70 + random(-15, 25);

  if (gps.location.isValid()) {
    t.latitude = gps.location.lat();
    t.longitude = gps.location.lng();
  } else {
    t.latitude = 0.0;
    t.longitude = 0.0;
  }

  if (gps.date.isValid() && gps.time.isValid()) {
    char buffer[25];
    snprintf(
      buffer,
      sizeof(buffer),
      "%02d-%02d-%04dT%02d:%02d:%02dZ",
      gps.date.day(),
      gps.date.month(),
      gps.date.year(),
      gps.time.hour(),
      gps.time.minute(),
      gps.time.second()
    );
    t.timestamp = String(buffer);
  } else {
    t.timestamp = isoTimestampFromMillis();
  }

  return t;
}

String isoTimestampFromMillis() {
  unsigned long now = millis();
  unsigned long seconds = now / 1000;
  unsigned long minutes = seconds / 60;
  unsigned long hours = minutes / 60;
  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  char buffer[25];
  snprintf(buffer, sizeof(buffer), "1970-01-01T%02lu:%02lu:%02luZ", hours, minutes, seconds);
  return String(buffer);
}

void sendTelemetry(const Telemetry& telemetry) {
  char payload[200];
  snprintf(
    payload,
    sizeof(payload),
    "{\"heartRate\":%d,\"temperature\":%.2f,\"latitude\":%.6f,\"longitude\":%.6f,\"timestamp\":\"%s\"}",
    telemetry.heartRate,
    telemetry.temperature,
    telemetry.latitude,
    telemetry.longitude,
    telemetry.timestamp.c_str()
  );

  Serial.println(payload);
}
