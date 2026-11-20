
import { useEffect, useState } from "react";

import {
  Radio,
  Activity,
  Database,
  Gauge,
  Wifi
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import MeasurementChart from "../components/dashboard/MeasurementChart";
import SensorTable from "../components/dashboard/SensorTable";
import api from "../services/api";
import ClusterStatus from "../components/ClusterStatus";
function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get(
          `/api/sensors/statistics?day=${getToday()}`
        );

        setStatistics(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();

    const interval = setInterval(fetchStatistics, 10000);

    return () => clearInterval(interval);
  }, []);

  const totalSensors = statistics?.total_sensors ?? 0;
  const activeSensors = statistics?.sensors_with_data ?? 0;
  const totalMeasurements = statistics?.total_measurements ?? 0;

  const averageValue = statistics?.sensors?.length
    ? (
        statistics.sensors.reduce(
          (sum, sensor) => sum + sensor.average * sensor.total,
          0
        ) / totalMeasurements
      ).toFixed(2)
    : "0";

  const stats = [
    {
      title: "Total Sensors",
      value: totalSensors,
      icon: Radio
    },
    {
      title: "Active Sensors",
      value: activeSensors,
      icon: Activity
    },
    {
      title: "Total Measurements",
      value: totalMeasurements.toLocaleString(),
      icon: Database
    },
    {
      title: "Average Value",
      value: averageValue,
      unit: "Across all sensors",
      icon: Gauge
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1520] p-8 text-slate-300">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1520] p-8 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1520] text-slate-100 p-6 lg:p-8">

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            IoT Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Monitor your IoT devices and sensor measurements.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Wifi size={16} className="text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">
            Live Monitoring
          </span>
        </div>

      </div>

        {/* Cassandra Cluster Monitoring */}
        <ClusterStatus />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Measurements */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Sensor Analytics
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Real-time sensor measurements and trends.
          </p>
        </div>

        <MeasurementChart />
      </section>

      {/* Sensors Table */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Sensor Overview
        </h2>

        <SensorTable />
      </section>

    </div>
  );
}

export default Dashboard;
