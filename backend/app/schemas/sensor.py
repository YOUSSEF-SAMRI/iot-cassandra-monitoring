from pydantic import BaseModel
from datetime import date, datetime

class SensorResponse(BaseModel):
    sensor_id: str
    sensor_type: str
    unit: str
    location: str
    
class MeasurementResponse(BaseModel):
    sensor_id: str
    day: date
    date: datetime
    value: float
    

class SensorStatisticsResponse(BaseModel):
    sensor_id: str
    day: date
    average: float
    minimum: float
    maximum: float
    total: int


class DashboardStatisticsResponse(BaseModel):
    day: date
    total_sensors: int
    sensors_with_data: int
    total_measurements: int
    sensors: list[SensorStatisticsResponse]
