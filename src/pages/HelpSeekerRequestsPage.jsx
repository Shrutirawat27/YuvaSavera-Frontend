import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, X, MapPin, Clock, User, AlertCircle } from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusColors = {
  Open: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Resolved: "bg-green-100 text-green-800",
  Closed: "bg-gray-200 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
  Pending: "bg-purple-100 text-purple-800",
  Approved: "bg-green-200 text-green-900",
  Rejected: "bg-red-200 text-red-900",
};

const HelpSeekerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/requests/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedRequests = res.data.data?.requests || res.data.requests || [];
      setRequests(fetchedRequests);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await axios.delete(`${API_BASE}/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Request deleted successfully");
      fetchRequests();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert("Failed to delete request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === "pending") return `${base} bg-yellow-100 text-yellow-800`;
    if (status === "approved") return `${base} bg-green-100 text-green-800`;
    if (status === "rejected") return `${base} bg-red-100 text-red-800`;
    if (status === "Open") return `${base} bg-blue-100 text-blue-800`;
    if (status === "In Progress") return `${base} bg-yellow-100 text-yellow-800`;
    if (status === "Resolved") return `${base} bg-green-100 text-green-800`;
    return `${base} bg-gray-200 text-gray-800`;
  };

  if (loading) return <p className="text-center p-4">Loading requests...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Requests</h1>
          <Button
            variant="primary"
            onClick={() => navigate("/submit-help-request")}
          >
            + New Request
          </Button>
        </div>

        {requests.length === 0 ? (
          <p className="text-gray-600">
            You have no requests yet. Click "New Request" to add one.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const displayStatus =
                req.adminStatus === "pending"
                  ? "Pending Approval"
                  : req.adminStatus === "rejected"
                  ? "Rejected"
                  : req.status || "Open";

              return (
                <Card key={req._id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">{req.title}</h2>
                      <p className="text-gray-700">{req.description}</p>
                      <span
                        className={`inline-block px-2 py-1 mt-2 text-sm font-semibold rounded ${
                          statusColors[
                            req.adminStatus === "pending"
                              ? "Pending"
                              : req.adminStatus === "approved"
                              ? req.status || "Open"
                              : "Rejected"
                          ]
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRequest(req)}
                      >
                        <Eye size={16} />
                      </Button>
                      {req.adminStatus !== "approved" && (
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/edit-request/${req._id}`)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(req._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedRequest.title}</h2>
                <button
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm capitalize">
                    {selectedRequest.urgency}
                  </span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">
                    {selectedRequest.location
                      ? ` ${selectedRequest.location.city || ""
                        }, ${selectedRequest.location.state || ""}`
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full capitalize">
                  <span className="text-sm">{selectedRequest.category}</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                    <User size={18} className="mr-2" /> Request Details
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedRequest.category}
                    </p>
                    <p>
                      <span className="font-medium">Urgency:</span>{" "}
                      {selectedRequest.urgency}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {selectedRequest.location?.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">District:</span>{" "}
                      {selectedRequest.district || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                    <AlertCircle size={18} className="mr-2" /> Request Status
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Admin Status:</span>{" "}
                      <span className={getStatusBadge(selectedRequest.adminStatus)}>
                        {selectedRequest.adminStatus}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Current Status:</span>{" "}
                      <span className={getStatusBadge(selectedRequest.status || "Open")}>
                        {selectedRequest.status || "Open"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Description
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {selectedRequest.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Video if exists */}
              {selectedRequest.media?.video?.url && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Attached Video
                  </h3>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      src={selectedRequest.media.video.url}
                      controls
                      className="w-full h-auto max-h-96"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 p-4 rounded-b-xl flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSeekerRequestsPage;