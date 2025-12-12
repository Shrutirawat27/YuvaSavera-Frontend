import React, { useEffect, useState } from "react";
import axios from "axios"; 
import Card from "../../../components/UI/Card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    resolved: 0,
    users: 0,
    volunteers: 0,
  });

  const [statusData, setStatusData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [activity, setActivity] = useState([]);

  // Map raw status
  const STATUS_LABELS = {
    pending: "Pending",
    resolved: "Resolved",
    rejected: "Rejected",
    in_progress: "In Progress",
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        let { stats, statusData, trendData, activity } = res.data.data;

        // Format status labels for charts
        statusData = statusData.map(s => ({
          name: STATUS_LABELS[s.name?.toLowerCase()] || s.name,
          value: s.value,
        }));

        setStats(stats);
        setStatusData(statusData);
        setTrendData(trendData);
        setActivity(activity);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboard();
  }, []);

  const COLORS = ["#f97316", "#22c55e", "#ef4444", "#3b82f6"];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4"><h3>Total Requests</h3><p className="text-2xl font-bold">{stats.totalRequests}</p></Card>
        <Card className="p-4"><h3>Pending</h3><p className="text-2xl font-bold">{stats.pending}</p></Card>
        <Card className="p-4"><h3>Resolved</h3><p className="text-2xl font-bold">{stats.resolved}</p></Card>
        <Card className="p-4"><h3>Users</h3><p className="text-2xl font-bold">{stats.users}</p></Card>
        <Card className="p-4"><h3>Volunteers</h3><p className="text-2xl font-bold">{stats.volunteers}</p></Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Requests by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Requests Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Recent Activity</h3>
        <ul className="list-disc ml-5">
          {activity.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;