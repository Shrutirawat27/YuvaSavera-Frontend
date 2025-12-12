import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 

  const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: API_BASE,
});
  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/stories/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data.data.stories || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Approve or Reject
  const handleAction = async (id, action) => {
    try {
      const res = await api.patch(
        `/api/stories/${id}/status`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStories((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, status: res.data.data.story.status } : s
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing story:`, error);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  if (loading) return <p className="text-center p-6">Loading stories...</p>;

  // Filter stories
  const filteredStories =
    filter === "all" ? stories : stories.filter((s) => s.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Stories</h1>

      {/* Filter Tabs */}
      <div className="flex gap-6 border-b mb-6">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`pb-2 capitalize ${
              filter === status
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredStories.length === 0 ? (
        <p className="text-gray-600">No stories found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredStories.map((story) => (
            <Card key={story._id}>
              <h2 className="text-xl font-bold mb-2">{story.title}</h2>
              <p className="text-gray-600 mb-2">{story.description}</p>
              <p className="text-sm text-gray-500">
                Category: {story.category}
              </p>
              <p className="text-sm text-gray-500">
                Volunteer: {story.volunteerName}
              </p>

              <div className="grid grid-cols-2 gap-2 my-4">
                <img
                  src={story.beforeImage?.url || story.beforeImage}
                  alt="Before"
                  className="w-full h-40 object-cover rounded"
                />
                <img
                  src={story.afterImage?.url || story.afterImage}
                  alt="After"
                  className="w-full h-40 object-cover rounded"
                />
              </div>

              <p className="text-sm font-medium mb-3">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    story.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : story.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {story.status}
                </span>
              </p>

              <div className="flex gap-3">
                {story.status === "pending" && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleAction(story._id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(story._id, "reject")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDelete(story._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageStories;