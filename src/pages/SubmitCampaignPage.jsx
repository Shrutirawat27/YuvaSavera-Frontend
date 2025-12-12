import React, { useState } from "react";
import axios from "axios";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SubmitCampaignPage = () => {
   const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    participantsCount: "",
    startDate: "",
    endDate: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFile = (e) => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!form.title || !form.description || !form.location || !form.startDate || !form.endDate) {
        toast.error("Please fill all required fields.");
        setLoading(false);
        return;
      }

      // 1) Upload image if provided
      let imageUrl = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);

        const uploadRes = await axios.post(`${API_BASE}/api/campaigns/upload-image`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data?.imageUrl || "";
      }

      // 2) Create campaign (JSON)
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        participantsCount: form.participantsCount || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        imageUrl, 
      };

const token = localStorage.getItem("token"); 

const createRes = await axios.post(`${API_BASE}/api/campaigns`, payload, {
  headers: { 
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
});

      toast.success(" Campaign submitted successfully and is pending approval. Redirecting to home...");

      // reset
      setForm({ title: "", description: "", location: "", participantsCount: "", startDate: "", endDate: "" });
      setImageFile(null);
      setTimeout(() => {
        navigate("/");
      }, 3000);
      e.target.reset && e.target.reset();
    } catch (err) {
       toast.error("Failed to submit campaign. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Submit a Campaign Proposal</h1>
        <p className="text-center text-gray-600 mb-6">Share your campaign idea — admin will review it before publishing.</p>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input type="text" name="location" value={form.location} onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Participants</label>
              <input type="number" name="participantsCount" value={form.participantsCount} onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleFile} className="w-full" />
          </div>

          <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
            {loading ? "Submitting..." : "Submit Campaign"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SubmitCampaignPage;