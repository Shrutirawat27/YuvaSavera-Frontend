import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Star, Upload, CheckCircle, X, Lock } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VolunteerRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    district: '',
    password: '',
    skills: [],
    causes: [],
    availability: '',
    experience: '',
    motivation: '',
    idProof: null,
    idProofType: '' 
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const skillOptions = [
    'Teaching & Education',
    'Healthcare & Medical',
    'Technology & Programming',
    'Counseling & Mental Health',
    'Marketing & Communications',
    'Event Management',
    'Legal Advice',
    'Financial Planning',
    'Arts & Creative',
    'Sports & Fitness'
  ];

  const causeOptions = [
    'Education',
    'Healthcare',
    'Employment & Skills',
    'Mental Health',
    'Environment',
    'Women Empowerment',
    'Child Welfare',
    'Senior Citizens',
    'Disability Support',
    'Rural Development'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleCauseToggle = (cause) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.includes(cause)
        ? prev.causes.filter(c => c !== cause)
        : [...prev.causes, cause]
    }));
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload a valid file (JPEG, JPG, PNG, or PDF)');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError('File size must be less than 5MB');
        return;
      }

      setUploadError('');
      setFormData(prev => ({ ...prev, idProof: file }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, idProof: null, idProofType: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('location', formData.location);
      submitData.append('district', formData.district);
      submitData.append('password', formData.password);
      submitData.append('skills', JSON.stringify(formData.skills));
      submitData.append('causes', JSON.stringify(formData.causes));
      submitData.append('availability', formData.availability);
      submitData.append('experience', formData.experience);
      submitData.append('motivation', formData.motivation);

      if (formData.idProof) {
        submitData.append('idProof', formData.idProof);
        submitData.append('idProofType', formData.idProofType); 
      }

      const response = await fetch(`${API_BASE}/api/volunteer/register`, {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to the Yuva Savera community! We'll review your application and get back to you within 24-48 hours.
          </p>
          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={() => navigate("/browse-requests")}>
              Explore Help Requests
            </Button>
            <Button variant="outline" className="w-full">
              Join Our WhatsApp Community
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              Join as a <span className="text-blue-600">Volunteer</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Start your journey of making a difference. Connect with people who need your skills and create lasting impact.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-8 text-sm">
              <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                Personal Info
              </span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                Skills & Interests
              </span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                Experience & Motivation
              </span>
            </div>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                        required
                        maxLength={10}
                      />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="City, State"
                        required
                      />
                    </div>

                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    <MapPin className="w-4 h-4 inline mr-2" />
    District *
  </label>
  <input
    type="text"
    name="district"
    value={formData.district}
    onChange={handleInputChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter your district"
    required
  />
</div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Create a password"
                        required
                      />
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="w-4 h-4 inline mr-2" />
                      ID Proof (Optional)
                    </label>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                    />
                    
                    {!formData.idProof ? (
                      <div 
                        onClick={triggerFileInput}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-1">Aadhaar Card, Driving License, or Passport</p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, JPG, PNG, PDF (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Upload className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">{formData.idProof.name}</p>
                              <p className="text-xs text-gray-500">
                                {(formData.idProof.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Dropdown for ID Proof Type */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select ID Proof Type *
                          </label>
                          <select
                            name="idProofType"
                            value={formData.idProofType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">-- Select --</option>
                            <option value="aadhaar">Aadhaar</option>
                            <option value="passport">Passport</option>
                            <option value="driving_license">Driving License</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="primary" 
                      onClick={() => setCurrentStep(2)}
                      disabled={
                        !formData.name || !formData.email || !formData.phone || !formData.location || !formData.password ||
                        (formData.idProof && !formData.idProofType) // ✅ must select type if file uploaded
                      }
                    >
                      Next: Skills & Interests
                    </Button>
                  </div>
                </motion.div>
              )}
              {/* Step 2: Skills & Interests */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills & Interests</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <Star className="w-4 h-4 inline mr-2" />
                      Select Your Skills (Choose at least 2) *
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all ${
                            formData.skills.includes(skill)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Causes You Care About (Choose at least 2) *
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {causeOptions.map((cause) => (
                        <button
                          key={cause}
                          type="button"
                          onClick={() => handleCauseToggle(cause)}
                          className={`p-3 text-sm rounded-lg border-2 transition-all ${
                            formData.causes.includes(cause)
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-300 hover:border-orange-300'
                          }`}
                        >
                          {cause}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select your availability</option>
                      <option value="weekends">Weekends only</option>
                      <option value="evenings">Weekday evenings</option>
                      <option value="flexible">Flexible schedule</option>
                      <option value="full-time">Available full-time</option>
                    </select>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      variant="primary" 
                      onClick={() => setCurrentStep(3)}
                      disabled={formData.skills.length < 2 || formData.causes.length < 2 || !formData.availability}
                    >
                      Next: Experience
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Experience & Motivation */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience & Motivation</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Volunteer Experience (Optional)
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about any previous volunteering experience, relevant work, or personal projects..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to volunteer with Yuva Savera? *
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your motivation and what you hope to contribute to our community..."
                      required
                    />
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">What happens next?</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• We'll review your application within 24-48 hours</li>
                      <li>• You'll receive a welcome email with next steps</li>
                      <li>• Access to our volunteer portal and training materials</li>
                      <li>• Matching with help requests that fit your skills</li>
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep(2)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={!formData.motivation || isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistrationPage;