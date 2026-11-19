
import json
import time

from generators.sensor_generator import SensorGenerator


# Load configuration
with open("config/sensors.json", "r") as file:
    config = json.load(file)


# Initialize sensors
sensors = [
    SensorGenerator(sensor_config)
    for sensor_config in config["sensors"]
]


# Simulation loop
print("IoT Simulator started...")

try:
    while True:

        print("\n--- New Measurements ---")

        for sensor in sensors:
            measurement = sensor.generate()
            print(measurement)

        time.sleep(2)

except KeyboardInterrupt:
    print("\nIoT Simulator stopped.")
