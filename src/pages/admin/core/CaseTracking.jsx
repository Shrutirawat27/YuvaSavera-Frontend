import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../../components/UI/Button";
import { Eye, Check, X } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = localStorage.getItem("token");

const CaseTracking = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", urgency: "", category: "", search: "" });
  const [proofModal, setProofModal] = useState({ open: false, request: null, proof: null });
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchCases = async (initialLoad = false) => {
    if (initialLoad) setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newCases = res.data.requests || res.data.data?.requests || [];
      setCases(newCases);
    } catch (err) {
      toast.error("Failed to load cases");
    } finally {
      if (initialLoad) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases(true);
    const interval = setInterval(() => fetchCases(false), 15000);
    return () => clearInterval(interval);
  }, [refreshTick]);

  const filteredCases = cases.filter((c) => {
    const statusMatch = filters.status ? c.status === filters.status : true;
    const urgencyMatch = filters.urgency ? c.urgencyLevel === filters.urgency : true;
    const categoryMatch = filters.category ? c.category === filters.category : true;
    const searchMatch = filters.search
      ? (c.title && c.title.toLowerCase().includes(filters.search.toLowerCase())) ||
        (c.requestId && c.requestId.toLowerCase().includes(filters.search.toLowerCase()))
      : true;
    return statusMatch && urgencyMatch && categoryMatch && searchMatch;
  });

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/api/requests/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setCases(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const assignVolunteer = async (id, volunteerId) => {
  try {
    await axios.patch(
      `${API_BASE}/api/requests/${id}/assign`,
      { volunteerId }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCases(prev =>
      prev.map(c => c._id === id ? { ...c, assignedVolunteer: volunteerId || null } : c)
    );

    toast.success(volunteerId ? "Volunteer assigned" : "Volunteer removed");
  } catch (err) {
    toast.error("Failed to update volunteer assignment.");
  }
};

  const openProofModal = (request, proof) => {
    setProofModal({ open: true, request, proof });
  };

  const closeProofModal = () => setProofModal({ open: false, request: null, proof: null });

  const reviewProof = async (requestId, proofId, action, notes = "") => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/requests/${requestId}/review-proof`,
        { proofId, action, reviewNotes: notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedRequest = res.data.data?.request || res.data.request || null;
      if (updatedRequest) {
        setCases(prev => prev.map(c => c._id === updatedRequest._id ? updatedRequest : c));
      } else {
        setRefreshTick(t => t + 1);
      }

      closeProofModal();
      toast.success(`Proof ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`);
    } catch (err) {
      toast.error("Failed to review proof. See console for details.");
    }
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input type="text" placeholder="Search by Case ID or Title" value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-3 py-2 border rounded-lg" />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2 border rounded-lg">
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending Verification">Pending Verification</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })} className="px-3 py-2 border rounded-lg">
          <option value="">All Urgency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="px-3 py-2 border rounded-lg">
          <option value="">All Categories</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Employment">Employment</option>
          <option value="Counseling">Counseling</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      {/* Cases Table */}
      {loading ? <p>Loading cases...</p> : filteredCases.length === 0 ? <p>No cases found.</p> : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-orange-500">
              <tr>
                <th className="border px-4 py-2 text-left text-white font-semibold">Case ID</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Title</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Requester</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Status</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Urgency</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Category</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Assigned Volunteer</th>
                <th className="border px-4 py-2 text-left text-white font-semibold">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 align-top">
                  <td className="border px-4 py-2 break-all">{c.requestId}</td>
                  <td className="border px-4 py-2">{c.title}</td>
                  <td className="border px-4 py-2">{c.submittedBy?.name || "-"}</td>

                  <td className="border px-4 py-2">
                    <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)} className="px-2 py-1 border rounded-lg w-full">
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>

                  <td className="border px-4 py-2">{c.urgencyLevel || "-"}</td>
                  <td className="border px-4 py-2">{c.category || "-"}</td>

                  <td className="border px-4 py-2 flex items-center gap-2">
                    <span className="text-sm">
                      {c.assignedVolunteer?.userId?.name || c.assignedVolunteer || "Not Assigned"}
                    </span>
                    <Button variant="outline" size="sm" type="button" onClick={() => {
                      const volunteerId = prompt("Enter Volunteer ID to assign:");
                      if (volunteerId) assignVolunteer(c._id, volunteerId);
                    }}>Assign</Button>
                  </td>

                  {/* Proof column */}
                  <td className="border px-4 py-2">
                    {c.proofs && c.proofs.length > 0 ? (
                      <div className="space-y-2">
                        {c.proofs.map((p) => (
                          <div key={p._id} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded">
                            <button
                              type="button"
                              aria-label="View proof"
                              className="p-1 rounded hover:bg-gray-100"
                              onClick={() => openProofModal(c, p)}
                              title="View proof"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>

                            <div className="flex-1 text-sm">
                              <div className="font-medium">
                                {p.notes ? p.notes.slice(0, 80) + (p.notes.length > 80 ? '...' : '') : 'Proof submitted'}
                              </div>
                              <div className="text-xs text-gray-500">{new Date(p.submittedAt).toLocaleString()}</div>
                            </div>

                            {/* action buttons */}
                            {p.review?.status === "pending" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => {
                                    if (!window.confirm("Accept this proof and credit points?")) return;
                                    reviewProof(c._id, p._id, "accept");
                                  }}
                                >
                                  <Check className="w-4 h-4" /> Accept
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => {
                                    const notes = prompt("Optional rejection notes for the volunteer:");
                                    reviewProof(c._id, p._id, "reject", notes || "");
                                  }}
                                >
                                  <X className="w-4 h-4" /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                p.review?.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {p.review?.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No Proof</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Proof modal */}
      {proofModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full md:w-2/3 overflow-auto max-h-[90vh] p-6 relative">
            <button
              type="button"
              onClick={closeProofModal}
              className="absolute top-3 right-3 p-2 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-3">{proofModal.request?.title}</h3>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Submitted at: {new Date(proofModal.proof.submittedAt).toLocaleString()}</div>
              <div className="text-sm text-gray-700 mb-2 white-space-pre-wrap">{proofModal.proof.notes}</div>

              {proofModal.proof.media?.url && (
                proofModal.proof.media.mimeType?.startsWith('video') ? (
                  <video src={proofModal.proof.media.url} controls className="w-full rounded" />
                ) : (
                  <img src={proofModal.proof.media.url} alt="Proof" className="w-full rounded" />
                )
              )}
            </div>

            <div className="flex gap-3 mt-4">
  {proofModal.proof.review?.status === "pending" ? (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => {
          if (!window.confirm("Accept this proof? Points will be credited to volunteer.")) return;
          reviewProof(proofModal.request._id, proofModal.proof._id, 'accept');
        }}
      >
        <Check size={16} /> Accept
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
        onClick={() => {
          const notes = prompt("Optional rejection notes for the volunteer:");
          reviewProof(proofModal.request._id, proofModal.proof._id, 'reject', notes || '');
        }}
      >
        <X size={16} /> Reject
      </button>
    </>
  ) : (
    <span
      className={`px-3 py-1 rounded text-sm font-medium ${
        proofModal.proof.review?.status === "accepted"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {proofModal.proof.review?.status === "accepted" ? "✅ Accepted" : "❌ Rejected"}
    </span>
  )}

  <button type="button" className="px-4 py-2 rounded border" onClick={closeProofModal}>Close</button>
</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTracking;