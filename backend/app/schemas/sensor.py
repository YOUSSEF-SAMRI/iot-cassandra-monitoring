from pydantic import BaseModel


class SensorResponse(BaseModel):
    sensor_id: str
    sensor_type: str
    unit: str
    location: str
