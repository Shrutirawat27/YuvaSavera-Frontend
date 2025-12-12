import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filters, setFilters] = useState({
    reviewStatus: "",
    active: "",
    search: "",
  });

  const token = localStorage.getItem("token");

  // Use env variable for base URL
  const api = axios.create({
    baseURL: `${API_BASE}/api/admin/district`,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/volunteers");
      setVolunteers(res.data.volunteers || []);
    } catch (err) {
      console.error("Error fetching volunteers:", err.response?.data || err.message);
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVolunteerStatus = async (userId, currentStatus) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/volunteers/${userId}/status`, {});
      setVolunteers((prev) =>
        prev.map((v) => (v._id === userId ? { ...v, isActive: !currentStatus } : v))
      );
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Unable to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const reviewVolunteer = async (userId, newStatus) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/volunteers/${userId}/review`, { status: newStatus });
      setVolunteers((prev) =>
        prev.map((v) => (v._id === userId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error("Error updating review:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Unable to update volunteer status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Filtered volunteers
  const filteredVolunteers = volunteers.filter((v) => {
    const reviewMatch = filters.reviewStatus
      ? filters.reviewStatus === "Pending"
        ? v.status === "pending_review"
        : filters.reviewStatus.toLowerCase() === v.status
      : true;
    const activeMatch =
      filters.active
        ? filters.active === "Active"
          ? v.isActive
          : !v.isActive
        : true;
    const searchMatch = filters.search
      ? v.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        (v.phone || "").toLowerCase().includes(filters.search.toLowerCase())
      : true;

    return reviewMatch && activeMatch && searchMatch;
  });

  if (loading) return <p>Loading volunteers...</p>;
  if (!volunteers.length) return <p>No volunteers found in your district.</p>;

  return (
    <div className="space-y-4 p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email, Phone"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />
        <select
          value={filters.reviewStatus}
          onChange={(e) => setFilters({ ...filters, reviewStatus: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Review Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          value={filters.active}
          onChange={(e) => setFilters({ ...filters, active: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Volunteers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-orange-500">
            <tr>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Name</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Email</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Phone</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">District</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Review Status</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Active?</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.map((vol) => (
              <tr key={vol._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 border-b">{vol.name}</td>
                <td className="border px-4 py-2 border-b">{vol.email}</td>
                <td className="border px-4 py-2 border-b">{vol.phone}</td>
                <td className="border px-4 py-2 border-b">{vol.district}</td>
                <td className="border px-4 py-2 capitalize">
                  {vol.status === "pending_review"
                    ? "Pending"
                    : vol.status === "approved"
                    ? "Approved"
                    : vol.status === "rejected"
                    ? "Rejected"
                    : "Pending"}
                </td>
                <td className="border px-4 py-2">{vol.isActive ? "Active" : "Inactive"}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className={`px-2 py-1 rounded ${vol.isActive ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                    onClick={() => toggleVolunteerStatus(vol._id, vol.isActive)}
                    disabled={updatingId === vol._id}
                  >
                    {updatingId === vol._id ? "Updating..." : vol.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${vol.status === "approved" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white"}`}
                    disabled={vol.status === "approved" || updatingId === vol._id}
                    onClick={() => reviewVolunteer(vol._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${vol.status === "rejected" ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 text-white"}`}
                    disabled={vol.status === "rejected" || updatingId === vol._id}
                    onClick={() => reviewVolunteer(vol._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Volunteers;
