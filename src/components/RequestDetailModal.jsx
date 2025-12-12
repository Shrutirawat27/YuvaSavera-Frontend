import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

// Use VITE_API_URL from .env
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = localStorage.getItem("token");

export default function RequestDetailModal({ open, requestId, onClose }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !requestId) return;

    const fetchRequest = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/requests/${requestId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setRequest(res.data?.data?.request || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load request details.");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [open, requestId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl p-6 relative overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="text-gray-500 text-center">Loading request...</div>
        ) : request ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{request.title || "Untitled Request"}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Urgency: {request.urgencyLevel || "Not specified"}
            </p>
            <p className="mb-4">{request.description || "No description provided."}</p>

            {request.media?.video?.url && (
              <video
                src={request.media.video.url}
                controls
                className="w-full rounded-lg mb-4"
              />
            )}

            <p className="text-sm text-gray-600">
              Location:{" "}
              {request.location
                ? [request.location.address, request.location.city].filter(Boolean).join(", ")
                : "Unknown"}
            </p>
            <p className="text-sm text-gray-600">
              Submitted by: {request.anonymous ? "Anonymous" : request.submittedBy?.name || "Unknown"}
            </p>
          </>
        ) : (
          <div className="text-red-500 text-center">Request not found.</div>
        )}
      </div>
    </div>
  );
}