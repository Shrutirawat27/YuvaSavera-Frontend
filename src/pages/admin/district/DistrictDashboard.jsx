import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../../components/UI/Card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DistrictDashboard = () => {
  const [stats, setStats] = useState({ totalRequests: 0, volunteers: 0 });
  const [statusData, setStatusData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#f97316", "#22c55e", "#ef4444", "#3b82f6"];

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/dashboard/district`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.status === "success") {
          const { stats, statusData, trendData } = res.data.data;
          setStats(stats);
          setStatusData(statusData.length ? statusData : [{ name: "No Data", value: 1 }]);
          setTrendData(trendData.length ? trendData : [{ month: "N/A", requests: 0 }]);
        } else {
          console.warn("No dashboard data:", res.data);
        }
      } catch (err) {
        console.error("District Dashboard error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow rounded-lg flex flex-col items-center justify-center">
          <h3 className="text-gray-700 font-semibold mb-2">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
        </Card>

        <Card className="p-6 bg-white shadow rounded-lg flex flex-col items-center justify-center">
          <h3 className="text-gray-700 font-semibold mb-2">Volunteers</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.volunteers}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Status */}
        <Card className="p-6 bg-white shadow rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-4 text-center">Requests by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={(entry) => `${entry.name} (${entry.value})`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Requests Trend */}
        <Card className="p-6 bg-white shadow rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-4 text-center">Requests Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <XAxis dataKey="month" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip />
              <Bar dataKey="requests" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default DistrictDashboard;