import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    search: "",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || res.data.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/api/admin/users/${id}/status`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const roleMatch = filters.role ? user.role === filters.role : true;
    const activeMatch =
      filters.isActive === ""
        ? true
        : filters.isActive === "active"
        ? user.isActive
        : !user.isActive;
    const searchMatch = filters.search
      ? user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return roleMatch && activeMatch && searchMatch;
  });

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        />
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Roles</option>
          <option value="volunteer">Volunteer</option>
          <option value="help_seeker">Help Seeker</option>
          <option value="moderator">Moderator</option>
          <option value="core_admin">Core Admin</option>
          <option value="district_lead">District Lead</option>
        </select>
        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-orange-500">
            <tr>
              <th className="border px-4 py-2 text-left text-white font-semibold">Name</th>
              <th className="border px-4 py-2 text-left text-white font-semibold">Email</th>
              <th className="border px-4 py-2 text-left text-white font-semibold">Role</th>
              <th className="border px-4 py-2 text-left text-white font-semibold">Active</th>
              <th className="border px-4 py-2 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 capitalize">{user.role.replace("_", " ")}</td>
                <td className="border px-4 py-2">{user.isActive ? "Yes" : "No"}</td>
                <td className="border px-4 py-2">
                  <button
                    className={`px-3 py-1 rounded ${
                      user.isActive ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}
                    onClick={() => toggleActive(user._id, user.isActive)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;