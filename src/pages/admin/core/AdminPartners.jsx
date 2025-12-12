import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/partners/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartners(res.data.partners || []);
    } catch (err) {
      toast.error("Failed to fetch partners");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/api/partners/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Partner ${status}`);
      fetchPartners();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating partner status");
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Partner Requests</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
        </div>
      ) : partners.length === 0 ? (
        <p className="text-center text-gray-600">No pending partner requests</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card key={partner._id}>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  {partner.logo && partner.logo.url ? (
                    <img src={partner.logo.url} alt={partner.organizationName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{partner.organizationName}</h2>
                  <p className="text-sm text-gray-600 mb-2">{partner.organizationType}</p>
                  <p className="text-gray-600 mb-2">{partner.description}</p>
                  <div className="text-sm text-gray-600 mb-2"><strong>Focus Areas:</strong> {partner.focusAreas && partner.focusAreas.join(", ")}</div>
                  <div className="text-sm text-gray-600"><strong>Location:</strong> {partner.location}, {partner.district}</div>
                  <div className="text-sm text-gray-600"><strong>Contact:</strong> {partner.contactPersonName} ({partner.contactEmail})</div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <Button variant="primary" icon={CheckCircle} onClick={() => handleStatusUpdate(partner._id, "approved")}>Approve</Button>
                <Button variant="outline" icon={XCircle} onClick={() => handleStatusUpdate(partner._id, "rejected")}>Reject</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPartners;