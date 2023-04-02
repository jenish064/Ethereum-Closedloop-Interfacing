/*
 * Created by ArduinoGetStarted.com
 *
 * This example code is in the public domain
 *
 * Tutorial page: https://arduinogetstarted.com/tutorials/arduino-cooling-system-using-dht-sensor
 */

#include "DHT.h"

#define IN1 7 //pwm
#define IN2 8 //dir
#define DHTPIN 12           // Arduino pin connected to relay which connected to DHT sensor
#define DHTTYPE DHT11

const int TEMP_THRESHOLD_UPPER =30; // upper threshold of temperature, change to your desire value
const int TEMP_THRESHOLD_LOWER = 20; // lower threshold of temperature, change to your desire value

DHT dht(DHTPIN, DHTTYPE);

float temperature;    // temperature in Celsius

void setup()
{
  Serial.begin(9600); // initialize serial
  dht.begin();        // initialize the sensor
  pinMode(IN1, OUTPUT); // initialize digital pin as an output
  pinMode(IN2, OUTPUT); // initialize digital pin as an output
  digitalWrite(IN2, LOW);
}

void loop()
{
  // wait a few seconds between measurements.
  delay(2000);

  temperature = dht.readTemperature();;  // read temperature in Celsius
  Serial.println(temperature);

  if (isnan(temperature)) {
  } else {
    if(temperature > TEMP_THRESHOLD_UPPER){
//      Serial.println("The fan is turned on");
      analogWrite(IN1, 250); // turn on
    } else if(temperature < TEMP_THRESHOLD_LOWER){
      digitalWrite(IN1, 0); // turn on
    }
  }
}
