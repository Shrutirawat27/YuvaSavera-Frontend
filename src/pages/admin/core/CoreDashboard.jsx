import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminNavbar from "../../../components/Layout/AdminNavbar";
import CoreAdminLayout from "./CoreAdminLayout";
import Dashboard from "./Dashboard";
import ManageRequests from "./ManageRequests";
import ManageUsers from "./ManageUsers";
import Reports from "./Reports";
import Settings from "./Settings";
import CaseTracking from "./CaseTracking";
import VolunteerManagement from "./VolunteerManagement";
import Notifications from "./Notifications";
import ManageModerators from "./ManageModerators";
import CreateDistrictLead from "./CreateDistrictLead";
import AdminCampaigns from "./AdminCampaigns";

const CoreDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Routes path="/admin/core/*" element={<CoreAdminLayout />}>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="requests" element={<ManageRequests />} />
          <Route path="cases" element={<CaseTracking />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="volunteers" element={<VolunteerManagement />} />
          <Route path="moderators" element={<ManageModerators />} />
          <Route path="reports" element={<Reports />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="district-leads" element={<CreateDistrictLead />} />
        </Routes>
      </main>
    </div>
  );
};

export default CoreDashboard;