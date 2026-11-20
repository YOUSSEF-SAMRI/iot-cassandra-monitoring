
import { useEffect, useState } from "react";
import api from "../../services/api";

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function SensorTable() {
  const [sensors, setSensors] = useState([]);
  const [latestMeasurements, setLatestMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const [sensorsResponse, measurementsResponse] =
          await Promise.all([
            api.get("/api/sensors/"),
            api.get(
              `/api/sensors/latest-measurements?day=${getToday()}`
            )
          ]);

        setSensors(sensorsResponse.data);
        setLatestMeasurements(measurementsResponse.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load sensor information.");
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();

    const interval = setInterval(fetchSensorData, 10000);

    return () => clearInterval(interval);
  }, []);

  const getLatestMeasurement = (sensorId) => {
    return latestMeasurements.find(
      (measurement) => measurement.sensor_id === sensorId
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mt-8">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">
          Sensors Overview
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Latest measurements from your IoT sensors.
        </p>
      </div>

      {loading ? (
        <p className="p-8 text-center text-slate-500">
          Loading sensors...
        </p>
      ) : error ? (
        <p className="p-8 text-center text-red-500">
          {error}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4">Sensor ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Last Value</th>
                <th className="px-6 py-4">Last Update</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sensors.map((sensor) => {
                const measurement = getLatestMeasurement(
                  sensor.sensor_id
                );

                return (
                  <tr
                    key={sensor.sensor_id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {sensor.sensor_id}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {sensor.sensor_type}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {sensor.location}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {measurement
                        ? `${measurement.value} ${sensor.unit}`
                        : "No data"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {measurement
                        ? new Date(measurement.date).toLocaleTimeString()
                        : "--"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          measurement
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {measurement ? "Active" : "No data"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {sensors.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-slate-500"
                  >
                    No sensors registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SensorTable;
