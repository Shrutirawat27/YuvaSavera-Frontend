import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ArrowRight, Filter } from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/campaigns`);
      setCampaigns(res.data.campaigns || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/campaigns/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Successfully joined campaign!");
      fetchCampaigns(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Error joining campaign");
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/campaigns/featured`);
      setFeatured(res.data.campaign);
    } catch (err) {
      console.warn("No featured campaign found.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchFeatured();
  }, []);

  const filtered = campaigns.filter(
    (c) => filter === "all" || (c.lifecycle || "").toLowerCase() === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Campaigns & <span className="text-orange-500">Events</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Join our community-driven campaigns and events that are creating
              lasting impact across India. Every campaign is a step towards positive change.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Browse Campaigns</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Campaigns</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-center col-span-3">Loading campaigns...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center col-span-3">No campaigns found.</p>
            ) : (
              filtered.map((campaign, index) => (
                <Card key={campaign._id} delay={index * 0.1}>
                  <div className="relative mb-4">
                    <img
                      src={campaign.imageUrl || campaign.image}
                      alt={campaign.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          campaign.lifecycle
                        )}`}
                      >
                        {campaign.lifecycle}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {campaign.description}
                  </p>

                  <div className="space-y-2 mb-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{campaign.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{campaign.participantsCount || 0} participants</span>
                    </div>
                  </div>

                  <Button
                    variant={
                      campaign.lifecycle === "Active"
                        ? "primary"
                        : "outline"
                    }
                    className="w-full"
                    icon={ArrowRight}
                    onClick={() => campaign.lifecycle === "Active" && handleJoin(campaign._id)}
                    disabled={campaign.lifecycle !== "Active"}
                  >
                    {campaign.lifecycle === "Active"
                      ? "Join Campaign"
                      : campaign.lifecycle === "Upcoming"
                      ? "Upcoming"
                      : "Completed"}
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Campaign */}
      {featured && (
        <section className="py-20 bg-gradient-to-r from-orange-500 to-blue-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-white text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Featured Campaign: {featured.title}
                </h2>
                <p className="text-xl mb-8 opacity-90">{featured.description}</p>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 mb-8">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold mb-2">
                        {featured.participantsCount || 0}
                      </div>
                      <div className="text-sm opacity-90">Participants</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-2">
                        {new Date(featured.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm opacity-90">Start Date</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-2">
                        {new Date(featured.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm opacity-90">End Date</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Campaign Creation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Card>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Start Your Own Campaign
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have an idea for a social campaign? We help passionate individuals and
                organizations launch impactful initiatives that bring communities together.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Plan Your Event</h4>
                  <p className="text-sm text-gray-600">
                    Define your goals, timeline, and impact metrics
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Build Your Team</h4>
                  <p className="text-sm text-gray-600">
                    Connect with volunteers and partners
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Execute & Track</h4>
                  <p className="text-sm text-gray-600">
                    Launch your campaign and measure success
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/submit-campaign")}
              >
                Propose a Campaign
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampaignsPage;