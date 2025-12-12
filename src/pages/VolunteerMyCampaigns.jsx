import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, X, Search, Filter } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VolunteerMyCampaigns = () => {
  const [joinedCampaigns, setJoinedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchJoinedCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setJoinedCampaigns([]);
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE}/api/campaigns/my-joined`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJoinedCampaigns(res.data.campaigns || []);
    } catch (err) {
      console.error("Error fetching joined campaigns:", err.response?.data || err.message);
      setJoinedCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedCampaigns();
  }, []);

  // Leave a campaign
  const handleLeaveCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to leave this campaign?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/campaigns/${id}/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("You have left the campaign successfully!");
      fetchJoinedCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error leaving campaign");
    }
  };

  const filtered = joinedCampaigns.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      (c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      statusFilter === "all" ||
      (c.lifecycle || c.status || "").toLowerCase() === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <p className="p-4 text-center">Loading your campaigns…</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Joined Campaigns</h1>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search joined campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid / Table */}
      <div className="mb-10">
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-orange-500">
              <tr>
                <th className="border px-4 py-2 text-left text-white font-semibold">Title</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Location</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">When</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Participants</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Status</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{c.title}</td>
                  <td className="border px-4 py-2">{c.location}</td>
                  <td className="border px-4 py-2">
                    {c.startDate ? new Date(c.startDate).toLocaleDateString() : "—"} - {c.endDate ? new Date(c.endDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="border px-4 py-2">{c.participantsCount || 0}</td>
                  <td className="border px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {c.lifecycle || c.status || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2 items-center">
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded transition-colors"
                      onClick={() => setSelectedCampaign(c)}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Leave Campaign button */}
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded transition-colors"
                      onClick={() => handleLeaveCampaign(c._id)}
                      title="Leave Campaign"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                    You haven't joined any campaigns yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-orange-500 text-white p-6 rounded-t-xl flex justify-between items-start">
              <h2 className="text-2xl font-bold">{selectedCampaign.title}</h2>
              <button className="text-white hover:text-gray-200" onClick={() => setSelectedCampaign(null)}><X size={24} /></button>
            </div>

            <div className="p-6 space-y-4">
              <p><span className="font-medium">Location:</span> {selectedCampaign.location}</p>
              <p><span className="font-medium">When:</span> {selectedCampaign.startDate ? new Date(selectedCampaign.startDate).toLocaleDateString() : "—"} - {selectedCampaign.endDate ? new Date(selectedCampaign.endDate).toLocaleDateString() : "—"}</p>
              <p><span className="font-medium">Participants:</span> {selectedCampaign.participantsCount || 0}</p>
              <p><span className="font-medium">Description:</span> {selectedCampaign.description || "No description provided."}</p>
              {selectedCampaign.imageUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Campaign Image</h3>
                  <img src={selectedCampaign.imageUrl} alt="Campaign" className="w-full rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerMyCampaigns;