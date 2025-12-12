import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building, Mail, Phone, MapPin, Users, FileText, CheckCircle } from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PartnerRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    description: "",
    focusAreas: [],
    location: "",
    district: "",
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    registrationNumber: "",
    additionalInfo: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const organizationTypes = [
    "Non-Governmental Organization (NGO)",
    "Corporate/Private Company",
    "Educational Institution",
    "Government Agency",
    "Social Enterprise",
    "Community Group",
    "Religious Organization",
  ];

  const focusAreaOptions = [
    "Education & Skill Development",
    "Healthcare & Medical Services",
    "Employment & Livelihood",
    "Mental Health & Counseling",
    "Environment & Sustainability",
    "Women Empowerment",
    "Child Welfare",
    "Senior Citizen Care",
    "Disability Support",
    "Rural Development",
    "Technology & Innovation",
    "Arts & Culture",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFocusAreaToggle = (area) => {
    setFormData((p) => ({
      ...p,
      focusAreas: p.focusAreas.includes(area) ? p.focusAreas.filter(a => a !== area) : [...p.focusAreas, area],
    }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setLogoFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.organizationName || !formData.organizationType || !formData.description || !formData.contactPersonName || !formData.contactEmail || !formData.contactPhone || !formData.location || !formData.district) {
      toast.error("Please fill required fields.");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === "focusAreas") fd.append(k, JSON.stringify(v || []));
        else fd.append(k, v || "");
      });
      if (logoFile) fd.append("logo", logoFile);

      const res = await axios.post(`${API_BASE}/api/partners`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted! We'll review it soon.");
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("partner submit error:", err.response?.data || err.message);
      toast.error("Failed to submit application. " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Partnership Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you! Our partnerships team will review your application and reach out soon.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-br from-purple-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              <span className="text-purple-600">Partner</span> with Yuva Savera
            </motion.h1>
            <p className="text-lg text-gray-600 leading-relaxed">Join our network of organizations working together to create positive social impact.</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Partnership Benefits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-6 h-6 text-purple-600" /></div>
                <h3 className="font-semibold text-gray-800 mb-2">Expanded Reach</h3>
                <p className="text-sm text-gray-600">Access our network of volunteers across India</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><Building className="w-6 h-6 text-orange-600" /></div>
                <h3 className="font-semibold text-gray-800 mb-2">Resource Sharing</h3>
                <p className="text-sm text-gray-600">Share resources, expertise, and best practices</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-6 h-6 text-green-600" /></div>
                <h3 className="font-semibold text-gray-800 mb-2">Joint Campaigns</h3>
                <p className="text-sm text-gray-600">Collaborate on impactful campaigns and initiatives</p>
              </div>
            </div>
          </Card>
          <Card>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Organization Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-2" /> Organization Name *
                    </label>
                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type *</label>
                    <select name="organizationType" value={formData.organizationType} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                      <option value="">Select organization type</option>
                      {organizationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-2" /> Primary Location *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <input type="text" name="district" value={formData.district} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                    <input type="url" name="website" value={formData.website} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number (Optional)</label>
                    <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Areas of Focus (Select all that apply) *</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {focusAreaOptions.map(area => (
                    <button key={area} type="button" onClick={() => handleFocusAreaToggle(area)}
                      className={`p-3 text-sm rounded-lg border-2 text-left ${formData.focusAreas.includes(area) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 hover:border-purple-300'}`}>
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Users className="w-4 h-4 inline mr-2" /> Contact Person Name *</label>
                    <input type="text" name="contactPersonName" value={formData.contactPersonName} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="w-4 h-4 inline mr-2" /> Phone Number *</label>
                    <input type="tel" name="contactPhone" maxLength={10} value={formData.contactPhone} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Mail className="w-4 h-4 inline mr-2" /> Email Address *</label>
                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo (optional)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
              </div>

              <div className="border-t pt-6">
                <div className="mb-6">
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" className="text-purple-500 focus:ring-purple-500 mt-1" required />
                    <span className="text-sm text-gray-700">
                      I confirm that the information provided is accurate and I have the authority to represent this organization.
                    </span>
                  </label>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Partnership Application"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegistrationPage;