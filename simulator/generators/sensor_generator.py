import random

class SensorGenerator :
    def __init__(self , sensor_config):
        self.sensor_id = sensor_config["sensor_id"]
        self.sensor_type = sensor_config["sensor_type"]
        self.unit = sensor_config["unit"]
        self.location = sensor_config["location"]
        
        self.min_value = sensor_config["min_value"]
        self.max_value = sensor_config["max_value"]
        
        self.current_value = sensor_config["initial_value"]

    def generate(self):
        # Generate a small random variation
        variation = random.uniform(-0.5, 0.5)

        # Update the current value
        new_value = self.current_value + variation

        # Keep the value within allowed boundaries
        new_value = max(
            self.min_value,
            min(new_value, self.max_value)
        )
        
        self.current_value = new_value
        
        return {
            "sensor_id": self.sensor_id,
            "sensor_type": self.sensor_type,
            "value": round(new_value, 2),
            "unit": self.unit,
            "location": self.location
        }