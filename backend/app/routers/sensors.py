from fastapi import APIRouter, Request , HTTPException
from datetime import date, timedelta ,datetime
from app.schemas.sensor import SensorResponse , MeasurementResponse , SensorStatisticsResponse ,DashboardStatisticsResponse

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



@router.get(
    "/statistics",
    response_model=DashboardStatisticsResponse
)
def get_dashboard_statistics(
    day: date,
    request: Request
):

    session = request.app.state.cassandra

    sensor_rows = list(session.execute("""
        SELECT sensor_id
        FROM sensors
    """))

    statistics = []
    total_measurements = 0

    for sensor in sensor_rows:

        query = """
            SELECT value
            FROM measurements
            WHERE sensor_id = %s AND day = %s
        """

        rows = session.execute(
            query,
            (sensor.sensor_id, day)
        )

        values = [row.value for row in rows]

        if not values:
            continue

        count = len(values)
        total_measurements += count

        statistics.append({
            "sensor_id": sensor.sensor_id,
            "day": day,
            "average": sum(values) / count,
            "minimum": min(values),
            "maximum": max(values),
            "total": count
        })

    return {
        "day": day,
        "total_sensors": len(sensor_rows),
        "sensors_with_data": len(statistics),
        "total_measurements": total_measurements,
        "sensors": statistics
    }


@router.get("/{sensor_id}" , response_model=SensorResponse)
def get_sensor(sensor_id : str , request:Request):
    session = request.app.state.cassandra
    
    query = """
        SELECT sensor_id, sensor_type, unit, location
        FROM sensors
        WHERE sensor_id = %s
    """
    
    row = session.execute(query , (sensor_id,)).one()
    
    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    return {
        "sensor_id": row.sensor_id,
        "sensor_type": row.sensor_type,
        "unit": row.unit,
        "location": row.location
    }
    


@router.get(
    "/{sensor_id}/measurements",
    response_model=list[MeasurementResponse]
)
def get_sensor_measurements(
    sensor_id: str,
    day: date,
    request: Request,
    start_time: datetime | None = None,
    end_time: datetime | None = None
):

    if (start_time is None) != (end_time is None):
        raise HTTPException(
            status_code=400,
            detail="Both start_time and end_time are required"
        )

    if start_time is not None and end_time is not None:

        if start_time > end_time:
            raise HTTPException(
                status_code=400,
                detail="start_time must be before end_time"
            )

        if start_time.date() != day or end_time.date() != day:
            raise HTTPException(
                status_code=400,
                detail="Time filters must belong to the requested day"
            )

    session = request.app.state.cassandra

    query = """
        SELECT sensor_id, day, date, value
        FROM measurements
        WHERE sensor_id = %s AND day = %s
    """

    params = [sensor_id, day]

    if start_time is not None and end_time is not None:
        query += " AND date >= %s AND date <= %s"
        params.extend([start_time, end_time])


    rows = session.execute(query, tuple(params))


    measurements = []

    for row in rows:
        measurements.append({
            "sensor_id": row.sensor_id,
            "day": date(1970, 1, 1) + timedelta(
                days=row.day.days_from_epoch
            ),
            "date": row.date,
            "value": row.value
        })

    return measurements




@router.get(
    "/{sensor_id}/statistics",
    response_model=SensorStatisticsResponse
)
def get_sensor_statistics(
    sensor_id: str,
    day: date,
    request: Request
):
    session = request.app.state.cassandra

    query = """
        SELECT value
        FROM measurements
        WHERE sensor_id = %s AND day = %s
    """

    rows = session.execute(query, (sensor_id, day))

    values = [row.value for row in rows]

    if not values:
        raise HTTPException(
            status_code=404,
            detail="No measurements found for this sensor and day"
        )

    return {
        "sensor_id": sensor_id,
        "day": day,
        "average": sum(values) / len(values),
        "minimum": min(values),
        "maximum": max(values),
        "total": len(values)
    }

