
import { useEffect, useState } from "react";

function ClusterStatus() {
  const [cluster, setCluster] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClusterStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/cluster/status"
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve cluster status");
        }

        const data = await response.json();

        setCluster(data);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClusterStatus();

    const interval = setInterval(fetchClusterStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-[#142536] border border-red-500/30 rounded-xl p-5">
        <p className="text-red-400 font-semibold">
          Cluster monitoring unavailable
        </p>
        <p className="text-slate-400 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!cluster) {
    return (
      <div className="bg-[#142536] rounded-xl p-5">
        <p className="text-slate-400">Loading cluster status...</p>
      </div>
    );
  }

  const isHealthy = cluster.status === "HEALTHY";

  return (
    <div className="bg-[#142536] border border-slate-700/50 rounded-xl p-6 shadow-lg mb-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Cassandra Cluster
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {cluster.cluster_name}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isHealthy
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {cluster.status}
        </span>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-[#0B1520] rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Nodes</p>
          <p className="text-2xl font-bold text-white mt-2">
            {cluster.total_nodes}
          </p>
        </div>

        <div className="bg-[#0B1520] rounded-lg p-4">
          <p className="text-slate-400 text-sm">Nodes UP</p>
          <p className="text-2xl font-bold text-green-400 mt-2">
            {cluster.up_nodes}
          </p>
        </div>

        <div className="bg-[#0B1520] rounded-lg p-4">
          <p className="text-slate-400 text-sm">Nodes DOWN</p>
          <p className="text-2xl font-bold text-red-400 mt-2">
            {cluster.down_nodes}
          </p>
        </div>

      </div>

      {/* Nodes list */}
      <h3 className="text-slate-200 font-medium mb-3">
        Cluster Nodes
      </h3>

      <div className="space-y-3">
        {cluster.nodes.map((node) => (
          <div
            key={node.name}
            className="flex justify-between items-center bg-[#0B1520] rounded-lg p-4"
          >
            <div>
              <p className="text-slate-200 font-medium">
                {node.name}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {node.datacenter} / {node.rack}
              </p>
            </div>

            <span
              className={`text-sm font-semibold ${
                node.status === "UP"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ● {node.status}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-5 text-right">
        Auto-refresh every 5 seconds
      </p>

    </div>
  );
}

export default ClusterStatus;
