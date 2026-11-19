
from cassandra_client import CassandraClient
from generators.sensor_generator import SensorGenerator
import json


with open("config/sensors.json", "r") as file:
    config = json.load(file)


client = CassandraClient(
    contact_points=["127.0.0.1"],
    port=9042
)

try:
    for sensor_config in config["sensors"]:

        sensor = SensorGenerator(sensor_config)

        measurement = sensor.generate()

        client.insert_measurement(measurement)

        print("Inserted:", measurement)

finally:
    client.close()
