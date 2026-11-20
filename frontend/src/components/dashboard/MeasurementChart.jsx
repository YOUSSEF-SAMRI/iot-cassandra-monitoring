
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import api from "../../services/api";

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const sensors = [
  {
    id: "CAP-001",
    title: "Temperature",
    unit: "°C",
    color: "#3B82F6"
  },
  {
    id: "CAP-002",
    title: "Humidity",
    unit: "%",
    color: "#22D3EE"
  },
  {
    id: "CAP-003",
    title: "Pressure",
    unit: "hPa",
    color: "#A78BFA"
  }
];

function MeasurementChart() {
  const [measurements, setMeasurements] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const responses = await Promise.all(
          sensors.map((sensor) =>
            api.get(
              `/api/sensors/${sensor.id}/measurements?day=${getToday()}`
            )
          )
        );

        const newMeasurements = {};

        sensors.forEach((sensor, index) => {
          newMeasurements[sensor.id] = responses[index].data
            .slice(0, 50)
            .reverse()
            .map((item) => ({
              time: new Date(item.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              value: item.value
            }));
        });

        setMeasurements(newMeasurements);
        setError("");

      } catch (err) {
        console.error(err);
        setError("Unable to load sensor measurements.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();

    const interval = setInterval(fetchMeasurements, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#142536] rounded-xl p-10 text-center text-slate-400">
        Loading sensor measurements...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#142536] rounded-xl p-10 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

      {sensors.map((sensor) => {
        const data = measurements[sensor.id] || [];

        return (
          <div
            key={sensor.id}
            className="bg-[#142536] p-5 rounded-xl border border-slate-700/50 shadow-lg"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100">
                {sensor.title}
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                {sensor.id} · Latest 50 measurements
              </p>
            </div>

            {data.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No measurements available.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid
                      stroke="#334155"
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="time"
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                      axisLine={{ stroke: "#475569" }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={45}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B1520",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#E2E8F0"
                      }}
                      labelStyle={{ color: "#94A3B8" }}
                      formatter={(value) => [
                        `${value} ${sensor.unit}`,
                        sensor.title
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={sensor.color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}

export default MeasurementChart;
