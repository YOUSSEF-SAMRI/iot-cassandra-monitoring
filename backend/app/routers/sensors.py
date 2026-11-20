from fastapi import APIRouter, Request

from app.schemas.sensor import SensorResponse


router = APIRouter(
    prefix="/api/sensors",
    tags=["Sensors"]
)


@router.get("/", response_model=list[SensorResponse])
def get_sensors(request: Request):

    session = request.app.state.cassandra

    query = """
        SELECT sensor_id, sensor_type, unit, location
        FROM sensors
    """

    rows = session.execute(query)

    sensors = []

    for row in rows:
        sensors.append({
            "sensor_id": row.sensor_id,
            "sensor_type": row.sensor_type,
            "unit": row.unit,
            "location": row.location
        })

    return sensors
