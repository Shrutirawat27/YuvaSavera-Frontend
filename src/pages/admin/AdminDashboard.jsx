import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

// Core Components
import CoreDashboard from "./core/CoreDashboard";

// District Components
import DistrictDashboard from "./district/DistrictDashboard";
import DistrictRequests from "./district/DistrictRequests";
import Volunteers from "./district/Volunteers";
import DistrictReports from "./district/DistrictReports";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authorized");

        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data.user);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not authorized.</p>;

  switch (user.role) {
    case "core_admin":
      return <CoreDashboard />;

    case "district_lead":
      return <DistrictLayout />;

    case "moderator":
      return <Navigate to="/moderator/dashboard" replace />;

    default:
      return <p>You do not have permission to access this page.</p>;
  }
};

export default AdminDashboard;