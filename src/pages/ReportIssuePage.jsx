import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetType: "",
    targetId: "",
    district: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = ["User Misbehavior", "HelpRequest Issue", "Technical", "Other"];
  const targetTypes = ["User", "HelpRequest"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Report submitted successfully!", {
          autoClose: 1000,
        });
        setIsSubmitted(true);
      }
      else toast.error("Failed: " + (data.message || "Unknown error"), {
        autoClose: 1000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! Please try again.", {
        autoClose: 1000,
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for helping us improve our platform. Our admin team will review your report within 24-48 hours.
            </p>

            <div className="space-y-3">
              <Button variant="primary" className="w-full mx-auto" onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  title: "",
                  description: "",
                  category: "",
                  targetType: "",
                  targetId: "",
                  district: "",
                });
              }}>
                Submit Another Report
              </Button>
              <Button variant="outline" className="w-full mx-auto" onClick={() => navigate("/")}>
                Return to Homepage
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Report <span className="text-orange-500">an Issue</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed mb-8"
            >
              Help us maintain a safe and positive community by reporting issues you encounter.
              Your feedback helps us improve the platform for everyone.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <a href="mailto:info@yuvasavera.org" className="text-gray-600 hover:text-blue-600">
                      info@yuvasavera.org
                    </a>
                    <p className="text-sm text-gray-500">For general inquiries</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <a href="tel:+91-1800-123-4567" className="text-gray-600 hover:text-green-600">
                      +91-1800-123-4567
                    </a>
                    <p className="text-sm text-gray-500">Toll-free helpline</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">
                      123 Youth Empowerment Center<br />
                      Connaught Place<br />
                      New Delhi - 110001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Report Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Report an Issue</h2>
                  <p className="text-gray-600">All fields marked with * are required</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Title / Subject *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                    placeholder="Briefly describe the issue"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                    placeholder="Provide detailed information about the issue"
                  />
                </div>

                {/* District */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter district"
                    required
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Type */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Target Type (optional)</label>
                  <select
                    name="targetType"
                    value={formData.targetType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="">None</option>
                    {targetTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target ID */}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Target ID (optional)</label>
                  <input
                    type="text"
                    name="targetId"
                    value={formData.targetId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter User ID or HelpRequest ID"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full py-3 text-lg bg-orange-500 hover:bg-orange-600"
                  >
                    Submit Report
                  </Button>
                </div>
              </form>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How quickly do you respond to inquiries?</h4>
                  <p className="text-sm text-gray-600">
                    We typically respond to all inquiries within 24-48 hours during business days. Urgent matters are prioritized and may receive faster responses.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Can I visit your office in person?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! We welcome visitors during our office hours. We recommend scheduling an appointment in advance to ensure someone is available to meet with you.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Do you have regional offices?</h4>
                  <p className="text-sm text-gray-600">
                    Currently, we operate primarily from our New Delhi headquarters, but we're expanding to other major cities. Contact us to learn about local coordinators in your area.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">How can I report urgent issues?</h4>
                  <p className="text-sm text-gray-600">
                    For urgent matters, call our helpline directly at +91-1800-123-4567 or use the "Emergency" category in the contact form above.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;