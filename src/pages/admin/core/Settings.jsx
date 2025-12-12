import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch profile info
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({
        name: res.data.data.user.name,
        email: res.data.data.user.email,
      });
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdate = async () => {
    try {
      await axios.patch(
        "/api/auth/update-profile",
        { name: profile.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setMessage("Failed to update profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center py-10">Loading profile...</p>;

  return (
    <div className="flex max-w-5xl mx-auto mt-10 border rounded-lg shadow-lg">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-6 border-r">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <ul className="space-y-3">
          {["profile", "security", "preferences", "account"].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-3/4 p-6">
        {message && <p className="mb-3 text-green-600">{message}</p>}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100 mb-4"
            />
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <label className="block mb-2 font-medium">Change Password</label>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Update Password
            </button>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <label className="flex items-center space-x-2 mb-4">
              <input type="checkbox" /> <span>Enable Dark Mode</span>
            </label>
            <label className="flex items-center space-x-2 mb-4">
              <input type="checkbox" /> <span>Email Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>SMS Updates</span>
            </label>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Account Management</h3>
            <p className="text-gray-600 mb-4">
              Deleting your account is permanent and cannot be undone.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded">
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;