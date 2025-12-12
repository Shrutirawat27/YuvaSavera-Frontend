import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Clock, User, Camera, Upload, CheckCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SubmitHelpRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    district: '',
    urgency: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    anonymous: false,
    additionalInfo: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const fileInputRef = useRef(null);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Education',
    'Healthcare',
    'Employment',
    'Counseling',
    'Emergency'
  ];

  const urgencyLevels = [
    { value: 'Low', description: 'Can wait a few weeks', color: 'text-green-600' },
    { value: 'Medium', description: 'Needed within a week', color: 'text-yellow-600' },
    { value: 'High', description: 'Needed within 2-3 days', color: 'text-orange-600' },
    { value: 'Critical', description: 'Immediate attention required', color: 'text-red-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = e.target.checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (videoFile) {
        data.append("video", videoFile);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Please login first.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_BASE}/api/requests`, 
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        }
      );

      setSubmittedRequest(res.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request. Please try again.");
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your help request has been received and will be reviewed by our team. We'll match you with
            suitable volunteers and notify you within 24 hours.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Request ID:</strong> {submittedRequest?.data?.request?.requestId}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Save this ID for tracking your request status
            </p>
          </div>
          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={() => navigate("/")}>
              Return to Homepage
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              Submit a <span className="text-orange-500">Help Request</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Connect with our community of volunteers who are ready to help.
              Describe your situation and we'll match you with the right support.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            {/* Safety Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Safety & Privacy Notice</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All requests are reviewed by our team before being published</li>
                    <li>• You can choose to remain anonymous (verification still required)</li>
                    <li>• Emergency situations will be prioritized and fast-tracked</li>
                    <li>• Your contact information is only shared with matched volunteers</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Tell Us About Your Situation</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Brief title describing what help you need"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Please provide detailed information about your situation, what kind of help you need, and any specific requirements..."
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="City, State (e.g., Mumbai, Maharashtra)"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter district (e.g., Mumbai Suburban)"
                      required
                      disabled={isLoading}
                    />
                  </div>

                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <Clock className="w-5 h-5 inline mr-2" />
                  Urgency Level *
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {urgencyLevels.map(level => (
                    <label key={level.value} className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.urgency === level.value}
                        onChange={handleInputChange}
                        className="text-orange-500 focus:ring-orange-500"
                        required
                        disabled={isLoading}
                      />
                      <div className="flex-1">
                        <div className={`font-semibold ${level.color}`}>{level.value}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <Camera className="w-5 h-5 inline mr-2" />
                  Video Message (Optional)
                </h3>
                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${isLoading ? 'opacity-60' : ''}`}>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Upload a Short Video</h4>
                  <p className="text-gray-600 mb-4">
                    A personal video message helps volunteers understand your situation better (Max 2 minutes, 50MB)
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleVideoChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                  >
                    Choose Video File
                  </Button>

                  {videoFile && (
                    <div className="mt-4 text-sm text-gray-700">
                      <p><strong>Selected:</strong> {videoFile.name}</p>
                      <div className="mt-2 w-full max-h-60 rounded-lg border overflow-hidden bg-black flex items-center justify-center">
                        <video
                          src={URL.createObjectURL(videoFile)}
                          controls
                          className="w-full h-60 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <User className="w-5 h-5 inline mr-2" />
                  Contact Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your name or preferred name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your contact number"
                      required
                      maxLength={10}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your email address"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Any additional information that might be helpful..."
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="border-t pt-6">
                <div className="mb-6">
                  <label className={`flex items-start space-x-3 ${isLoading ? 'opacity-60' : ''}`}>
                    <input
                      type="checkbox"
                      className="text-orange-500 focus:ring-orange-500 mt-1"
                      required
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that the information provided is accurate and I agree to Yuva Savera's
                      <a href="#" className="text-orange-600 hover:underline mx-1">Terms of Service</a>
                      and
                      <a href="#" className="text-orange-600 hover:underline ml-1">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full md:w-aut flex items-center justify-center" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Help Request"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitHelpRequestPage;