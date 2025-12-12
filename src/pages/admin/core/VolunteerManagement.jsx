import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../components/UI/Button"; 

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [newVolunteer, setNewVolunteer] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  // Display label for status
  const displayStatus = (status) => {
    if (status === "approved") return "Approved";
    if (status === "pending_review") return "Pending Review";
    if (status === "rejected") return "Rejected";
    return status;
  };

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/volunteer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const volunteersArray =
        res.data.data?.volunteers || res.data.volunteers || res.data || [];

      setVolunteers(volunteersArray);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
    const interval = setInterval(fetchVolunteers, 15000); 
    return () => clearInterval(interval);
  }, []);

  // Filter volunteers
  const filteredVolunteers = volunteers.filter((v) => {
    const searchMatch = filters.search
      ? v.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.email?.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    const statusMatch = filters.status ? v.status === filters.status : true;
    return searchMatch && statusMatch;
  });

// Update approval status
const updateStatus = async (id, newStatus) => {
  try {
    await axios.patch(
      `${API_BASE}/api/volunteer/${id}/review`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setVolunteers((prev) =>
      prev.map((v) => (v._id === id ? { ...v, status: newStatus } : v))
    );
  } catch (err) {
    console.error("Error updating status:", err.response?.data || err.message);
    alert("Failed to update status");
  }
};

// Toggle active/inactive
const toggleActive = async (id, currentActive) => {
  try {
    await axios.patch(
      `${API_BASE}/api/volunteer/${id}/toggle`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setVolunteers((prev) =>
      prev.map((v) =>
        v._id === id ? { ...v, isActive: !currentActive } : v
      )
    );
  } catch (err) {
    console.error("Error toggling active:", err.response?.data || err.message);
    alert("Failed to toggle active");
  }
};

  // Add new volunteer
  const addVolunteer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/volunteer/add`,
        newVolunteer,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVolunteers((prev) => [...prev, res.data.data]);
      setNewVolunteer({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      console.error("Error adding volunteer:", err.response?.data || err.message);
      alert("Failed to add volunteer");
    }
  };

  return (
    <div className="p-6">
      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending_review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Add New Volunteer Form */}
      <form
        onSubmit={addVolunteer}
        className="mb-6 space-y-2 border p-4 rounded-lg shadow"
      >
        <h2 className="font-semibold">Add New Volunteer</h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Name"
            value={newVolunteer.name}
            onChange={(e) =>
              setNewVolunteer({ ...newVolunteer, name: e.target.value })
            }
            className="px-3 py-2 border rounded-lg flex-1"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newVolunteer.email}
            onChange={(e) =>
              setNewVolunteer({ ...newVolunteer, email: e.target.value })
            }
            className="px-3 py-2 border rounded-lg flex-1"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newVolunteer.phone}
            onChange={(e) =>
              setNewVolunteer({ ...newVolunteer, phone: e.target.value })
            }
            className="px-3 py-2 border rounded-lg flex-1"
            maxLength={10}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newVolunteer.password}
            onChange={(e) =>
              setNewVolunteer({ ...newVolunteer, password: e.target.value })
            }
            className="px-3 py-2 border rounded-lg flex-1"
            required
          />
        </div>
        <Button type="submit">Add Volunteer</Button>
      </form>

      {/* Volunteers Table */}
      {loading ? (
        <p>Loading volunteers...</p>
      ) : filteredVolunteers.length === 0 ? (
        <p>No volunteers found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-orange-500">
              <tr>
                <th className="border px-4 py-2 text-left text-white font-semibold">
                  ID
                </th>
                <th className="border px-4 py-2 text-left text-white font-semibold">
                  Name
                </th>
                <th className="border px-4 py-2 text-left text-white font-semibold">
                  Email
                </th>
                <th className="border px-4 py-2 text-left text-white font-semibold">
                  Phone
                </th>
                <th className="border px-4 py-2 text-left text-white font-semibold">
                  Status
                </th>
                <th className="border px-4 py-2 text-left text-white font-semibold">
                  Assigned Cases
                </th>
                <th className="border px-4 py-2 text-left text-white font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVolunteers.map((v, index) => (
                <tr key={v._id || v.email || index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{v._id}</td>
                  <td className="border px-4 py-2">{v.user?.name}</td>
                  <td className="border px-4 py-2">{v.user?.email}</td>
                  <td className="border px-4 py-2">{v.user?.phone}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={v.status}
                      onChange={(e) => updateStatus(v._id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="pending_review">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">{v.assignedCases || 0}</td>
                  <td className="border px-4 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(v._id, v.isActive)}
                    >
                      {v.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerManagement;