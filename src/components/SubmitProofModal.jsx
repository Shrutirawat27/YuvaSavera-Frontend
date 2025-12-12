import React, { useState } from 'react';
import axios from 'axios';
import Button from './UI/Button';
import Card from './UI/Card';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = localStorage.getItem('token');

export default function SubmitProofModal({ open, onClose, requestId, onSubmitted }) {
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestId) return toast.error("Request ID missing.");

    const form = new FormData();
    form.append('requestId', requestId);
    form.append('notes', notes || '');
    files.forEach((f) => form.append('proofFiles', f));

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/volunteer/submit-proof`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Proof submitted successfully!");
      setFiles([]);
      setNotes('');
      onSubmitted && onSubmitted(res.data);
      onClose();
    } catch (err) {
      console.error("submit-proof error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to submit proof");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Submit Proof</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block text-sm font-medium">Upload proof files (images/videos/pdf)</label>
          <input type="file" accept="image/*,video/*,.pdf" multiple onChange={handleFileChange} className="block w-full" />

          <label className="block text-sm font-medium">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full border rounded p-2" />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Submitting..." : "Submit Proof"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}