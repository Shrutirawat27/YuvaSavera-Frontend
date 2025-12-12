import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";


const DistrictReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const token = localStorage.getItem("token");

  // Fetch reports for district lead
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reports/district/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data.reports || []);
    } catch (error) {
      console.error("Error fetching reports:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update report status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE}/api/reports/${id}/status/district`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state instantly
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const statusMatch = filters.status ? r.status === filters.status.toLowerCase() : true;
    const searchMatch = filters.search
      ? r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.submittedBy?.name.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return statusMatch && searchMatch;
  });

  if (loading) return <p className="text-center p-4">Loading reports...</p>;
  if (!reports.length) return <p className="text-center p-4">No reports found.</p>;

  return (
    <div className="space-y-4 p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Title or Submitted By"
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
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-orange-500">
            <tr>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Title</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Submitted By</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">District</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Date</th>
              <th className="text-left border px-4 py-2 border-b text-white font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 border-b">{report.title}</td>
                <td className="border px-4 py-2 border-b">{report.submittedBy?.name || "N/A"}</td>
                <td className="border px-4 py-2 border-b">{report.district}</td>
                <td className="border px-4 py-2 border-b">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">
                  <select
                    value={report.status}
                    onChange={(e) => updateStatus(report._id, e.target.value)}
                    className={`border rounded px-2 py-1 text-sm font-medium
                      ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "reviewed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistrictReports;