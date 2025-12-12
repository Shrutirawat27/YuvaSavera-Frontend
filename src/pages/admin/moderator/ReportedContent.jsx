import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ReportedContent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch reported content (moderator endpoint)
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/moderator/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data.reports || []);
    } catch (error) {
      console.error("Error fetching reported content:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update report status (moderator endpoint)
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE}/api/moderator/reports/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReports((prevReports) =>
        prevReports.map((r) =>
          r._id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p className="text-center py-10">Loading reported content...</p>;
  if (!reports.length) return <p className="text-center py-10">No reported content found.</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-orange-500">
          <tr>
            <th className="text-left border px-4 py-2 text-white font-semibold">Content Title</th>
            <th className="text-left border px-4 py-2 text-white font-semibold">Reported By</th>
            <th className="text-left border px-4 py-2 text-white font-semibold">Reason</th>
            <th className="text-left border px-4 py-2 text-white font-semibold">Date</th>
            <th className="text-left border px-4 py-2 text-white font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                {report.content?.title || report.title || "Untitled"}
              </td>
              <td className="border px-4 py-2">
                {report.submittedBy?.name || "Anonymous"}
              </td>
              <td className="border px-4 py-2">
                {report.reason || report.description || "No reason provided"}
              </td>
              <td className="border px-4 py-2">
                {new Date(report.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
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
  );
};

export default ReportedContent;