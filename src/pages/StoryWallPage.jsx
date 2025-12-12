import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, User, Calendar, ArrowRight, Filter, Search, X } from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StoryWallPage = () => {
  const [stories, setStories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null); 

  const categories = ["Education", "Healthcare", "Employment", "Counseling", "Environment"];
  const api = axios.create({
   baseURL: API_BASE,
   });
  // Fetch approved stories
  const fetchStories = async () => {
    try {
      const res = await api.get(`/api/stories`);
      setStories(res.data.data.stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Apply filter & search
  const filteredStories = stories.filter(
    (story) =>
      (filter === "all" || story.category === filter) &&
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center py-10">Loading stories...</p>;
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Success <span className="text-blue-600">Story Wall</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed mb-8"
            >
              Real stories of transformation, hope, and positive change from our community. 
              Every story represents lives touched and dreams realized.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search success stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Inspiring Stories</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Story Grid */}
        {filteredStories.length === 0 ? (
          <p className="text-gray-600">No stories available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story, index) => (
              <Card key={story._id} delay={index * 0.1}>
                <div className="relative mb-4">
                  <img
                    src={story.afterImage?.url}
                    alt={story.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white bg-opacity-90 text-gray-800 text-xs font-medium rounded-full">
                      {story.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">{story.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{story.description}</p>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Impact Metrics:</h4>
                  <p className="text-sm text-gray-600">{story.impactMetrics}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      Volunteer
                    </span>
                    <span className="font-medium">{story.volunteerName}</span>
                  </div>
                  {story.helpSeekerName && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        Beneficiary
                      </span>
                      <span className="font-medium">{story.helpSeekerName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Date
                    </span>
                    <span className="font-medium">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  icon={ArrowRight}
                  onClick={() => setSelectedStory(story)}
                >
                  Read Full Story
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Submit Story CTA */}
        <div className="mt-16 text-center">
          <Card>
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Share Your Success Story
              </h3>
              <p className="text-gray-600 mb-6">
                Have you been helped through Yuva Savera or made a difference as a volunteer? 
                Share your story to inspire others and showcase the power of community support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" onClick={() => window.location.href = "/submit-story"}>
                  Submit Your Story
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedStory(null)}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedStory.title}</h2>
            <p className="text-gray-700 mb-4">{selectedStory.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Before</h4>
                <img
                  src={selectedStory.beforeImage?.url}
                  alt="Before"
                  className="w-full h-56 object-cover rounded"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">After</h4>
                <img
                  src={selectedStory.afterImage?.url}
                  alt="After"
                  className="w-full h-56 object-cover rounded"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Impact Achieved:</h4>
              <p className="text-gray-700">{selectedStory.impactMetrics}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2" /> Volunteer: {selectedStory.volunteerName}
              </span>
              {selectedStory.helpSeekerName && (
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" /> Beneficiary: {selectedStory.helpSeekerName}
                </span>
              )}
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />{" "}
                {new Date(selectedStory.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryWallPage;