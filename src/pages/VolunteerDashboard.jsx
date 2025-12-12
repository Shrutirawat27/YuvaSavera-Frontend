import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Clock,
  Star,
  Award,
  Trophy,
  HeartHandshake,
  Bell,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import SubmitProofModal from "../components/SubmitProofModal";
import RequestDetailModal from '../components/RequestDetailModal';

// Badge images 
import NewVolunteerBadge from '../assets/default_badge.png';
import BronzeBadge from '../assets/bronze.png';
import SilverBadge from '../assets/silver.png';
import GoldBadge from '../assets/gold.png';
import PlatinumBadge from '../assets/platinium.png';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = localStorage.getItem("token");

// Badge thresholds
const BADGE_THRESHOLDS = [
  { name: "New Volunteer", points: 0 },
  { name: "Bronze Volunteer", points: 200 },
  { name: "Silver Volunteer", points: 400 },
  { name: "Gold Volunteer", points: 700 },
  { name: "Platinum Volunteer", points: 1000 }
];

const BADGE_IMAGES = {
  "New Volunteer": NewVolunteerBadge,
  "Bronze Volunteer": BronzeBadge,
  "Silver Volunteer": SilverBadge,
  "Gold Volunteer": GoldBadge,
  "Platinum Volunteer": PlatinumBadge
};

// UI helpers
const chip = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-white";
const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon className="w-4 h-4 text-blue-600" />}
    <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">{children}</h3>
  </div>
);
const StatCard = ({ icon: Icon, label, value, sub }) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-bold text-gray-800">{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  </Card>
);

// Lock icon component 
const Lock = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

// Badge component
const BadgeDisplay = ({ badgeName, size = "medium", showTooltip = false }) => {
  const badgeIndex = BADGE_THRESHOLDS.findIndex(b => b.name === badgeName);
  const isUnlocked = badgeIndex !== -1;

  return (
    <div className="relative flex flex-col items-center">
      <div className={`relative ${size === "large" ? "w-24 h-24" : "w-16 h-16"} rounded-full overflow-hidden border-2 ${isUnlocked ? "border-yellow-500" : "border-gray-300"}`}>
        <img
          src={BADGE_IMAGES[badgeName] || BADGE_IMAGES["New Volunteer"]}
          alt={badgeName}
          className={`w-full h-full object-cover ${!isUnlocked ? "filter grayscale" : ""}`}
        />
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      <span className={`mt-2 text-center font-medium ${size === "large" ? "text-sm" : "text-xs"} ${isUnlocked ? "text-gray-800" : "text-gray-400"}`}>
        {badgeName}
      </span>
      {showTooltip && isUnlocked && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          ✓
        </div>
      )}
    </div>
  );
};

export default function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(null); 
  const [user, setUser] = useState(null); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [badge, setBadge] = useState("New Volunteer");
  const [proofModal, setProofModal] = useState({ open: false, requestId: null });
  const [requestDetailModal, setRequestDetailModal] = useState({ open: false, requestId: null });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    district: "",
    password: "",
    availability: "",
    location: "",
    skillsText: ""
  });

  const navigate = useNavigate();

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadData = async () => {
    setLoading(true);
    try {
      // 1) my profile (volunteer)
      const r1 = await axios.get(`${API_BASE}/api/volunteer/myprofile`, { headers: authHeaders });
      const volunteerObj = r1.data?.data?.volunteer || null;

      if (!volunteerObj) {
        toast.error("Could not load volunteer profile.");
        return;
      }

      const userObj = volunteerObj.userId || volunteerObj.user || volunteerObj.userId || null;
      setVolunteer(volunteerObj);
      setUser(userObj);

      setEditForm(prev => ({
        ...prev,
        name: userObj?.name || "",
        phone: userObj?.phone || "",
        email: userObj?.email || "",
        district: userObj?.district || volunteerObj?.district || "",
        password: "",
        availability: volunteerObj?.availability || "",
        location: volunteerObj?.location || "",
        skillsText: Array.isArray(volunteerObj?.skills) ? volunteerObj.skills.join(", ") : (volunteerObj?.skills || "")
      }));

      // 2) assigned requests
      const r2 = await axios.get(`${API_BASE}/api/volunteer/requests/assigned`, { headers: authHeaders });
      const requestsData = r2.data?.requests || [];
      setRequests(requestsData);

      let total = 0;
      requestsData.forEach((req) => {
        if (req.status === "Resolved" || req.status === "Resolved") {
          const u = (req.urgencyLevel || req.urgency || "").toLowerCase();
          if (u === "critical") total += 100;
          else if (u === "high") total += 75;
          else if (u === "medium") total += 50;
          else total += 25;
        }
      });
      setPoints(total);

      let b = "New Volunteer";
      if (total >= 1000) b = "Platinum Volunteer";
      else if (total >= 700) b = "Gold Volunteer";
      else if (total >= 400) b = "Silver Volunteer";
      else if (total >= 200) b = "Bronze Volunteer";
      setBadge(b);

    } catch (err) {
      console.error("Error loading dashboard:", err);
      toast.error("Error loading dashboard. Please login and try again.");
      if (err.response && err.response.status === 401) {
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">Loading dashboard…</div>
      </div>
    );
  }

  const inProgressRequests = requests.filter((r) => r.status === "In Progress");
  const resolvedRequests = requests.filter((r) => r.status === "Resolved");

  const earnedBadges = BADGE_THRESHOLDS.filter(b => points >= b.points).map(b => b.name);
  const nextBadge = BADGE_THRESHOLDS.find(b => points < b.points) || BADGE_THRESHOLDS[BADGE_THRESHOLDS.length - 1];

  // Edit profile handlers
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditForm(prev => ({ ...prev, password: "" }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const submitProfileUpdates = async (e) => {
    e.preventDefault();
    try {
      const userUpdatePayload = {};
      if (editForm.name) userUpdatePayload.name = editForm.name;
      if (editForm.phone) userUpdatePayload.phone = editForm.phone;
      if (editForm.district) userUpdatePayload.district = editForm.district;
      if (editForm.password && editForm.password.length >= 6) userUpdatePayload.password = editForm.password;

      if (Object.keys(userUpdatePayload).length > 0) {
        await axios.patch(`${API_BASE}/api/auth/me`, userUpdatePayload, { headers: { ...authHeaders, "Content-Type": "application/json" } });
        toast.success("User profile updated");
      }

      const volunteerUpdatePayload = {};
      if (editForm.availability) volunteerUpdatePayload.availability = editForm.availability;
      if (editForm.location) volunteerUpdatePayload.location = editForm.location;
      if (editForm.skillsText) {
        const arr = editForm.skillsText.split(",").map(s => s.trim()).filter(Boolean);
        volunteerUpdatePayload.skills = arr;
      }

      if (Object.keys(volunteerUpdatePayload).length > 0 && volunteer && volunteer._id) {
        await axios.patch(`${API_BASE}/api/volunteer/profile/${volunteer._id}`, volunteerUpdatePayload, { headers: { ...authHeaders, "Content-Type": "application/json" } });
        toast.success("Volunteer details updated");
      }

      await loadData();
      closeEditModal();
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome, <span className="text-blue-700">{(user && user.name) || volunteer?.name || "Volunteer"}</span>
                </motion.h1>
                <p className="text-gray-600 mt-2">"Ek Naya Savera, Yuva Ke Saath" — your hub for impact, opportunities, and recognition.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`${chip} border-blue-200 text-blue-700`}>
                    <MapPin className="w-3.5 h-3.5 mr-1" /> {user?.district || volunteer?.district || "India"}
                  </span>
                  <span className={`${chip} border-orange-200 text-orange-700`}>
                    <Clock className="w-3.5 h-3.5 mr-1" /> {volunteer?.availability || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" className="flex items-center gap-2" onClick={() => navigate("/browse-requests")}>
                <HeartHandshake className="w-4 h-4" /> Browse Help Requests
              </Button>

              <Button variant="outline" onClick={openEditModal}>Edit Profile</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Trophy} label="Points" value={points} />
          <StatCard icon={CheckCircle} label="Requests Completed" value={resolvedRequests.length} />
          <StatCard icon={Award} label="Current Badge" value={badge} />
        </div>

        {/* Badge Progress Section */}
        <Card className="p-6 mb-6">
          <SectionTitle icon={Award}>Your Badge Progress</SectionTitle>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Current Badge</h4>
              <BadgeDisplay badgeName={badge} size="large" />
              <p className="mt-4 text-sm text-gray-600 text-center">You've earned the {badge} badge with {points} points</p>
            </div>

            <div className="flex-1 p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Progress to Next Badge</h4>
              <div className="mb-2 flex justify-between text-xs text-gray-600">
                <span>{points} points</span>
                <span>{nextBadge.points} points needed for {nextBadge.name}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (points / nextBadge.points) * 100)}%` }}></div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {nextBadge.points - points > 0 ? `Need ${nextBadge.points - points} more points to unlock ${nextBadge.name}` : "You've reached the highest badge!"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Your Badge Collection</h4>
            <div className="flex justify-between">
              {BADGE_THRESHOLDS.map((badgeInfo, index) => (
                <BadgeDisplay key={index} badgeName={badgeInfo.name} showTooltip={earnedBadges.includes(badgeInfo.name)} />
              ))}
            </div>
          </div>
        </Card>

        {/* Assigned Requests */}
        <Card className="p-6 mb-6">
          <SectionTitle icon={AlertCircle}>In Progress Requests</SectionTitle>
          {inProgressRequests.length === 0 ? (
            <div className="text-sm text-gray-500">You don’t have any active requests right now.</div>
          ) : (
            <ul className="space-y-4">
              {inProgressRequests.map((r) => (
                <li key={r._id} className="p-4 border rounded-lg bg-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{r.title}</div>
                    <div className="text-xs text-gray-500">Urgency: {r.urgencyLevel}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setProofModal({ open: true, requestId: r._id })}>Submit Proof</Button>
                   <Button
  variant="primary"
  size="sm"
  onClick={() => setRequestDetailModal({ open: true, requestId: r._id })}
>
  Open
</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Completed Requests */}
        <Card className="p-6">
          <SectionTitle icon={Star}>Completed Requests</SectionTitle>
          {resolvedRequests.length === 0 ? (
            <div className="text-sm text-gray-500">No requests completed yet.</div>
          ) : (
            <ul className="space-y-3">
              {resolvedRequests.map((r) => (
                <li key={r._id} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-800">{r.title}</div>
                    <div className="text-xs text-gray-500">Urgency: {r.urgencyLevel}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Submit Proof Modal */}
      <SubmitProofModal
        open={proofModal.open}
        requestId={proofModal.requestId}
        onClose={() => setProofModal({ open: false, requestId: null })}
        onSubmitted={() => {
          setProofModal({ open: false, requestId: null });
          loadData();
        }}
      />

      {/* Request Detail Modal */}
      <RequestDetailModal
        open={requestDetailModal.open}
        requestId={requestDetailModal.requestId}
        onClose={() => setRequestDetailModal({ open: false, requestId: null })}
      />

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative overflow-auto max-h-[90vh]">
            <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" onClick={closeEditModal}>
  <X className="w-5 h-5" />
</button>

            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={submitProfileUpdates} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full name</label>
                  <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                  <input name="phone" value={editForm.phone} onChange={handleEditChange}   maxLength={10} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
  <label className="block text-sm text-gray-600 mb-1">Email</label>
  <input
    name="email"
    value={editForm.email}
    className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
    readOnly
  />
</div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">District</label>
                  <input name="district" value={editForm.district} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">New password (optional)</label>
                  <input name="password" type="password" value={editForm.password} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" placeholder="Leave blank to keep current" />
                </div>
              </div>

              <hr className="my-3" />

              <h3 className="text-sm font-semibold mb-2">Volunteer details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Availability</label>
                  <input name="availability" value={editForm.availability} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Location</label>
                  <input name="location" value={editForm.location} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Skills (comma separated)</label>
                  <input name="skillsText" value={editForm.skillsText} onChange={handleEditChange} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
                <Button variant="primary" type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}