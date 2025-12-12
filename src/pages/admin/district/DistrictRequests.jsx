import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/UI/Button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DistrictRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const token = localStorage.getItem("token");

  // Fetch all requests for this district
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/requests/admin/district`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sortedRequests = (res.data.data || []).sort((a, b) => {
        const statusOrder = { pending: 0, approved: 1, rejected: 2 };
        const aStatus = a.adminStatus || "pending";
        const bStatus = b.adminStatus || "pending";
        if (statusOrder[aStatus] !== statusOrder[bStatus]) {
          return statusOrder[aStatus] - statusOrder[bStatus];
        } else {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });

      setRequests(sortedRequests);
    } catch (err) {
      console.error("Error fetching district requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      await axios.patch(
        `${API_BASE}/api/requests/${id}/admin-status`,
        { action: "approve" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.patch(
        `${API_BASE}/api/requests/${id}/admin-status`,
        { action: "reject" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  const assignVolunteer = async (id) => {
    const volunteerId = prompt("Enter Volunteer ID to assign:");
    if (!volunteerId) return;

    try {
      await axios.patch(
        `${API_BASE}/api/requests/${id}/assign`,
        { volunteerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  // Filtered requests
  const filteredRequests = requests.filter((req) => {
    const statusMatch = filters.status ? req.adminStatus === filters.status : true;
    const searchMatch = filters.search
      ? req.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.submittedBy?.name?.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Title or Seeker"
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Requests Table */}
      {loading ? (
        <p>Loading requests...</p>
      ) : filteredRequests.length === 0 ? (
        <p>No requests found in your district.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-orange-500">
              <tr>
                <th className="text-left border px-4 py-2 border-b text-white font-semibold">Title</th>
                <th className="text-left border px-4 py-2 border-b text-white font-semibold">Seeker</th>
                <th className="text-left border px-4 py-2 border-b text-white font-semibold">Status</th>
                <th className="text-left border px-4 py-2 border-b text-white font-semibold">Created</th>
                <th className="text-left border px-4 py-2 border-b text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 border-b">{req.title}</td>
                  <td className="border px-4 py-2 border-b">{req.submittedBy?.name || "N/A"}</td>
                  <td className="border px-4 py-2 border-b">{req.adminStatus || "Pending"}</td>
                  <td className="border px-4 py-2 border-b">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    {(!req.adminStatus || req.adminStatus === "pending") && (
                      <>
                        <Button onClick={() => approveRequest(req._id)}>Approve</Button>
                        <Button variant="destructive" onClick={() => rejectRequest(req._id)}>
                          Reject
                        </Button>
                      </>
                    )}
                    {req.adminStatus === "approved" && (
                      <Button onClick={() => assignVolunteer(req._id)}>Assign Volunteer</Button>
                    )}
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

export default DistrictRequests;