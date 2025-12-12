import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, X, Search, Filter } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]); 
  const [joinedCampaigns, setJoinedCampaigns] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch campaigns created by user
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      const res = await axios.get(`${API_BASE}/api/campaigns/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(res.data.campaigns || []);
    } catch (err) {
      console.error("Error fetching created campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaigns joined by user
  const fetchJoinedCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        `${API_BASE}/api/campaigns/my-joined`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinedCampaigns(res.data.campaigns || []);
    } catch (err) {
      console.error("Error fetching joined campaigns:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchJoinedCampaigns();
  }, []);

  // Delete campaign created by logged-in user
  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/campaigns/${id}/delete-own`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Campaign deleted successfully!");
      fetchCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting campaign");
    }
  };

  // Apply search + filter on created campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const renderTable = (data, title, isCreated = false) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-orange-500">
            <tr>
              <th className="border px-4 py-2 text-left text-white font-semibold">Title</th>
              <th className="border px-4 py-2 text-left text-white font-semibold">Location</th>
              <th className="border px-4 py-2 text-left text-white font-semibold">Status</th>
              <th className="border px-4 py-2 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{c.title}</td>
                <td className="border px-4 py-2">{c.location}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : c.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.status === "approved" && c.lifecycle
                      ? `${c.status} (${c.lifecycle})`
                      : c.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2 items-center">
                  {/* View Details */}
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded transition-colors"
                    onClick={() => setSelectedCampaign(c)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>

                  {/* Delete button only for created campaigns */}
                  {isCreated && (
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded transition-colors"
                      onClick={() => handleDeleteCampaign(c._id)}
                      title="Delete Campaign"
                    >
                      <X size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4 italic">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <p className="p-4 text-center">Loading campaigns...</p>;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Campaigns</h1>
        <div className="flex gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Created Campaigns */}
      {renderTable(filteredCampaigns, "Campaigns I Created", true)}

      {/* Joined Campaigns */}
      {renderTable(joinedCampaigns, "Campaigns I Joined")}

      {/* Modal for Campaign Details */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-6 rounded-t-xl flex justify-between items-start">
              <h2 className="text-2xl font-bold">{selectedCampaign.title}</h2>
              <button
                className="text-white hover:text-gray-200 transition-colors"
                onClick={() => setSelectedCampaign(null)}
              >
                <X size={24} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p>
                <span className="font-medium">Location:</span> {selectedCampaign.location}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedCampaign.status === "approved" && selectedCampaign.lifecycle
                  ? `${selectedCampaign.status} (${selectedCampaign.lifecycle})`
                  : selectedCampaign.status}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {selectedCampaign.description || "No description provided."}
              </p>
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

export default MyCampaigns;