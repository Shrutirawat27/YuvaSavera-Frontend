import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, User, Heart, Eye, X } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BrowseRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [videoModal, setVideoModal] = useState({ open: false, url: '' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const role = userInfo?.role || null;
  const token = localStorage.getItem('token');

  const categories = ['Education', 'Healthcare', 'Employment', 'Counseling', 'Emergency'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Navi Mumbai', 'Gurgaon'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_BASE.replace('/api','')}/api/public/requests`);
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error('Error fetching help requests:', err.message || err);
      }
    };
    fetchRequests();
  }, []);

  const handleHelp = async (requestId) => {
    if (!token) {
      toast.error("Please log in as a volunteer to help.");
      return;
    }
    if (role !== 'volunteer' && role !== 'core_admin') {
      toast.error("Only volunteers can accept requests.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/volunteer/accept-request`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("You are now helping with this request!");

      setRequests(prev => prev.map(r => {
        if (r._id === requestId) {
          return { ...r, assignedVolunteer: res.data.data.request.assignedVolunteer || 'you', status: 'In Progress' };
        }
        return r;
      }));
    } catch (err) {
      console.error("Error accepting request:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  const filteredRequests = requests.filter(request => {
    const locationText = request.location
      ? [request.location.address, request.location.city].filter(Boolean).join(', ')
      : '';

    return (
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === '' || request.category === categoryFilter) &&
      (locationFilter === '' || locationText.toLowerCase().includes(locationFilter.toLowerCase())) &&
      (urgencyFilter === '' || request.urgencyLevel === urgencyFilter)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Browse <span className="text-blue-600">Help Requests</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 mb-8">
              Find opportunities to make a difference. Connect with people who need your skills and support.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search help requests..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters + list */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg">
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select value={locationFilter} onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg">
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>

            <select value={urgencyFilter} onChange={(e) => { setUrgencyFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border rounded-lg">
              <option value="">All Urgency Levels</option>
              {urgencyLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>

            <Button variant="outline" onClick={() => { setSearchTerm(''); setCategoryFilter(''); setLocationFilter(''); setUrgencyFilter(''); setCurrentPage(1); }}>Clear Filters</Button>
          </div>
        </Card>

        <div className="mb-6">
          <p className="text-gray-600">Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {paginatedRequests.map((request) => (
            <Card key={request._id} className="relative flex items-start p-4 hover:shadow-md transition rounded-xl">
              {request.videoThumbnail && (
                <div className="relative w-40 h-28 flex-shrink-0 cursor-pointer" onClick={() => setVideoModal({ open: true, url: request.videoUrl })}>
                  <img src={request.videoThumbnail} alt="Request thumbnail" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <div className="flex-1 ml-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800">{request.title}</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(request.urgencyLevel)}`}>
                    {request.urgencyLevel}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{request.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{request.location ? [request.location.address, request.location.city].filter(Boolean).join(', ') : 'Location not available'}</div>
                  <div className="flex items-center"><User className="w-3 h-3 mr-1" />{request.submittedBy ? (request.anonymous ? "Anonymous" : request.submittedBy.name) : "Unknown"}</div>
                  <div className="flex items-center col-span-2"><Clock className="w-3 h-3 mr-1" />Category: {request.category}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  {request.status === "Resolved" ? (
  <span className="text-xs text-green-600 font-semibold">Completed</span>
) : request.status === "In Progress" || request.assignedVolunteer ? (
  <span className="text-xs text-gray-500 font-semibold">Assigned</span>
) : (
  <span className="text-xs text-green-600">Open for volunteers</span>
)}

                  <Button
                    variant={
                      request.status === "Resolved"
                        ? "outline"
                        : request.assignedVolunteer
                        ? "outline"
                        : "primary"
                    }
                    size="sm"
                    icon={Heart}
                    disabled={
                      request.status === "Resolved" ||
                      !!request.assignedVolunteer ||
                      !(role === "volunteer" || role === "core_admin")
                    }
                    onClick={() => handleHelp(request._id)}
                  >
                    {request.status === "Resolved"
                      ? "Completed"
                      : request.assignedVolunteer
                      ? "Assigned"
                      : "Help"}
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {filteredRequests.length > itemsPerPage && (
          <div className="flex justify-center mt-6 space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 py-1 border rounded-lg bg-white shadow-sm">{currentPage} / {totalPages}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {filteredRequests.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No requests found</h3>
              <p>Try adjusting your search terms or filters to find more opportunities to help.</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setCategoryFilter(''); setLocationFilter(''); setUrgencyFilter(''); setCurrentPage(1); }}>Clear All Filters</Button>
          </Card>
        )}
      </div>

      {/* Video Modal */}
      {videoModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setVideoModal({ open: false, url: '' })}>
          <div className="relative w-full max-w-xl bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-3 right-3 z-50 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition" onClick={(e) => { e.stopPropagation(); setVideoModal({ open: false, url: '' }); }}>
              <X className="w-5 h-5" />
            </button>
            <video src={videoModal.url} controls autoPlay className="w-full h-auto max-h-[80vh] rounded-lg"></video>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseRequestsPage;