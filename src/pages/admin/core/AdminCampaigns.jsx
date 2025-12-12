import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";
import { X } from "lucide-react";
import { Eye } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); 
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/campaigns/admin/all${
          activeTab !== "all" ? `?status=${activeTab}` : ""
        }`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      setCampaigns(res.data.campaigns || []);
    } catch (err) {
      console.error(
        "Error fetching campaigns:",
        err.response?.data || err.message
      );
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/api/campaigns/${id}/approve`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      setCampaigns((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "approved" } : c))
      );
    } catch (err) {
      console.error("Approve error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/campaigns/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const viewParticipants = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/api/campaigns/${id}/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParticipants(res.data.participants || []);
      const campaign = campaigns.find((c) => c._id === id);
      setSelectedCampaign(campaign || null);
      setShowParticipants(true);
    } catch (err) {
      console.error("Error fetching participants", err);
    }
  };

  const filteredCampaigns =
    activeTab === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === activeTab);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Campaigns</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center p-6">Loading campaigns...</p>
      ) : filteredCampaigns.length === 0 ? (
        <p className="text-gray-600">No campaigns found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCampaigns.map((c) => (
            <Card key={c._id}>
              <h2 className="text-xl font-bold mb-2">{c.title}</h2>
              <p className="text-gray-600 mb-2">{c.description}</p>
              <p className="text-sm text-gray-500">📍 {c.location}</p>
              <p className="text-sm text-gray-500 mb-3">
                👥 Participants: {c.participantsCount || 0}
              </p>

              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}

              <p className="text-sm font-medium mb-3">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    c.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : c.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status}
                </span>
              </p>

              <div className="flex gap-3">
                {c.status === "pending" && (
                  <Button variant="primary" onClick={() => handleApprove(c._id)}>
                    Approve
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleDelete(c._id)}>
                  Delete
                </Button>
                <Button
  variant="outline"
  onClick={() => viewParticipants(c._id)}
  className="flex items-center gap-2"
>
  <Eye size={16} className="text-gray-600" />
  View Participants
</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-orange-500 text-white p-6 rounded-t-xl flex justify-between items-start">
              <h2 className="text-2xl font-bold">
                Participants for {selectedCampaign?.title}
              </h2>
              <button
                className="text-white hover:text-gray-200 transition-colors"
                onClick={() => setShowParticipants(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {participants.length === 0 ? (
                <p className="text-gray-600">No participants yet.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Name</th>
                      <th className="border px-4 py-2 text-left">Email</th>
                      <th className="border px-4 py-2 text-left">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{p.name}</td>
                        <td className="border px-4 py-2">{p.email}</td>
                        <td className="border px-4 py-2">{p.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaigns;