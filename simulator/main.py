
import json
import time

from generators.sensor_generator import SensorGenerator
from cassandra_client import CassandraClient


# Load sensor configuration
with open("config/sensors.json", "r") as file:
    config = json.load(file)


# Initialize sensors
sensors = [
    SensorGenerator(sensor_config)
    for sensor_config in config["sensors"]
]


# Connect to Cassandra
client = CassandraClient(
    contact_points=["cassandra1"],
    port=9042
)


# Start simulation
print("IoT Simulator started...")

try:
    while True:

        print("\n--- New Measurements ---")

        for sensor in sensors:

            measurement = sensor.generate()

            client.insert_measurement(measurement)

            print("Inserted:", measurement)

        time.sleep(2)

except KeyboardInterrupt:
    print("\nIoT Simulator stopped.")

finally:
    client.close()
