import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SubmitStoryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Education",
    volunteerName: "",
    helpSeekerName: "",
    impactMetrics: "",
  });
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (beforeImage) data.append("beforeImage", beforeImage);
      if (afterImage) data.append("afterImage", afterImage);

      const api = axios.create({
  baseURL: API_BASE,
});
      await api.post(`/api/stories`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      toast.success("Story submitted successfully! Redirecting...");

      setFormData({
        title: "",
        description: "",
        category: "Education",
        volunteerName: "",
        helpSeekerName: "",
        impactMetrics: "",
      });
      setBeforeImage(null);
      setAfterImage(null);
      setTimeout(() => {
        navigate("/story-wall");
      }, 3000);
      e.target.reset(); 
    } catch (error) {
      console.error("Error submitting story:", error.response?.data || error.message);
      toast.error("Failed to submit story. " + (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Submit Your Success Story
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Share your inspiring story of making a difference
      </p>

      {message && (
        <div
          className={`p-3 mb-6 rounded-md ${message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter story title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            >
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Employment">Employment</option>
              <option value="Counseling">Counseling</option>
              <option value="Environment">Environment</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe your success story in detail"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={loading}
          />
        </div>

        {/* Volunteer + Beneficiary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Volunteer Name
            </label>
            <input
              type="text"
              name="volunteerName"
              placeholder="Enter volunteer's name"
              value={formData.volunteerName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Beneficiary Name
            </label>
            <input
              type="text"
              name="helpSeekerName"
              placeholder="Enter beneficiary's name"
              value={formData.helpSeekerName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Impact */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Impact Metrics
          </label>
          <input
            type="text"
            name="impactMetrics"
            placeholder="Describe the impact of your help"
            value={formData.impactMetrics}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={loading}
          />
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Before Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeImage(e.target.files[0])}
              required
              disabled={loading}
              className={`w-full border border-gray-300 p-3 rounded-md ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              After Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAfterImage(e.target.files[0])}
              required
              disabled={loading}
              className={`w-full border border-gray-300 p-3 rounded-md ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-3 rounded-md transition-all duration-300 flex items-center justify-center ${loading
              ? "bg-orange-400 cursor-not-allowed opacity-80"
              : "bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Story"
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmitStoryPage;