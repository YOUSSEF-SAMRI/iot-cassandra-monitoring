
import { useEffect, useState } from "react";
import { Search, Radio } from "lucide-react";
import api from "../services/api";

function Sensors() {
  const [sensors, setSensors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await api.get("/api/sensors/");

        setSensors(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load sensors.");
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();

    const interval = setInterval(fetchSensors, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredSensors = sensors.filter((sensor) =>
    sensor.sensor_id.toLowerCase().includes(search.toLowerCase()) ||
    sensor.sensor_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Sensors
        </h1>

        <p className="text-slate-500 mt-2">
          Manage and monitor all your IoT sensors.
        </p>
      </div>

      {/* Sensors Count */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Radio size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Registered Sensors
            </p>

            <h2 className="text-2xl font-bold text-slate-800">
              {sensors.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by sensor ID or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sensors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            All Sensors
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Automatically updated every 10 seconds.
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
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4">Location</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSensors.map((sensor) => (
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
                      {sensor.unit}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {sensor.location}
                    </td>
                  </tr>
                ))}

                {filteredSensors.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-slate-500"
                    >
                      No sensors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sensors;
