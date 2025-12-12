import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import CampaignsPage from "./pages/CampaignsPage";
import PoliticalAwarenessPage from "./pages/PoliticalAwarenessPage";
import VolunteerRegistrationPage from "./pages/VolunteerRegistrationPage";
import SubmitHelpRequestPage from "./pages/SubmitHelpRequestPage";
import BrowseRequestsPage from "./pages/BrowseRequestsPage";
import HelpSeekerProfilePage from "./pages/HelpSeekerProfilePage";
import HelpSeekerRequestsPage from "./pages/HelpSeekerRequestsPage";
import ImpactDashboardPage from "./pages/ImpactDashboardPage";
import StoryWallPage from "./pages/StoryWallPage";
import PartnerRegistrationPage from "./pages/PartnerRegistrationPage";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";
import Register from "./pages/Register";
import SubmitStoryPage from "./pages/SubmitStoryPage";
import ReportIssuePage from "./pages/ReportIssuePage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import MyCampaigns from "./pages/MyCampaigns";
import VolunteerMyCampaigns from "./pages/VolunteerMyCampaigns";
import SubmitCampaignPage from "./pages/SubmitCampaignPage";

// Core Admin pages
import CoreAdminLayout from "./pages/admin/core/CoreAdminLayout";
import CoreDashboard from "./pages/admin/core/CoreDashboard";
import ManageStories from "./pages/admin/core/ManageStories";
import CreateDistrictLead from "./pages/admin/core/CreateDistrictLead";
import ManageRequests from "./pages/admin/core/ManageRequests";
import CaseTracking from "./pages/admin/core/CaseTracking";
import ManageUsers from "./pages/admin/core/ManageUsers";
import VolunteerManagement from "./pages/admin/core/VolunteerManagement";
import ManageModerators from "./pages/admin/core/ManageModerators";
import Reports from "./pages/admin/core/Reports";
import Notifications from "./pages/admin/core/Notifications";
import Settings from "./pages/admin/core/Settings";
import AdminCampaigns from "./pages/admin/core/AdminCampaigns";
import AdminPartners from "./pages/admin/core/AdminPartners";   

// District Lead pages
import DistrictLayout from "./pages/admin/district/DistrictLayout";
import DistrictDashboard from "./pages/admin/district/DistrictDashboard";
import DistrictRequests from "./pages/admin/district/DistrictRequests";
import Volunteers from "./pages/admin/district/Volunteers";
import DistrictReports from "./pages/admin/district/DistrictReports";

// Moderator pages
import ModeratorDashboardLayout from "./pages/admin/moderator/ModeratorDashboardLayout";
import ModeratorDashboard from "./pages/admin/moderator/ModeratorDashboard";
import ContentApproval from "./pages/admin/moderator/ContentApproval";
import ReportedContent from "./pages/admin/moderator/ReportedContent";

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  return (
    <Router>
      <ToastContainer
        position="top-center"
        toastClassName={() =>
          "relative flex p-3 rounded-md bg-white text-black shadow-lg border border-black"
        }
        bodyClassName={() => "text-sm font-medium text-black"}
        closeButton={false}
        autoClose={3000}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="political-awareness" element={<PoliticalAwarenessPage />} />
          <Route path="volunteer-registration" element={<VolunteerRegistrationPage />} />
          <Route path="submit-help-request" element={<SubmitHelpRequestPage />} />
          <Route path="browse-requests" element={<BrowseRequestsPage />} />
          <Route path="my-profile" element={<HelpSeekerProfilePage />} />
          <Route path="my-requests" element={<HelpSeekerRequestsPage />} />
          <Route path="impact-dashboard" element={<ImpactDashboardPage />} />
          <Route path="story-wall" element={<StoryWallPage />} />
          <Route path="partner-registration" element={<PartnerRegistrationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="submit-story" element={<SubmitStoryPage />} />
          <Route path="/report-issue" element={<ReportIssuePage />} />
          <Route path="/dashboard" element={<VolunteerDashboard />} />
          <Route path="/submit-campaign" element={<SubmitCampaignPage />} />
          <Route path="my-campaigns" element={<MyCampaigns />} />
          <Route path="/volunteer/my-campaigns" element={<VolunteerMyCampaigns />} />
        </Route>

        {/* Core Admin Routes */}
        <Route
          path="/admin/core/*"
          element={
            userInfo && userInfo.role === "core_admin" ? (
              <CoreAdminLayout />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="dashboard/*" element={<CoreDashboard />} />
          <Route path="requests" element={<ManageRequests />} />
          <Route path="cases" element={<CaseTracking />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="volunteers" element={<VolunteerManagement />} />
          <Route path="moderators" element={<ManageModerators />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="district-leads" element={<CreateDistrictLead />} />
          <Route path="stories" element={<ManageStories />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="partners" element={<AdminPartners />} />  
        </Route>

        {/* District Lead Routes */}
        <Route
          path="/admin/district/*"
          element={
            userInfo && userInfo.role === "district_lead" ? (
              <DistrictLayout />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="dashboard" element={<DistrictDashboard />} />
          <Route path="requests" element={<DistrictRequests />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="reports" element={<DistrictReports />} />
        </Route>

        {/* Moderator Routes */}
        <Route path="/moderator" element={<Navigate to="/moderator/dashboard" replace />} />
        <Route
          path="/moderator/*"
          element={
            userInfo && userInfo.role === "moderator" ? (
              <ModeratorDashboardLayout />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="dashboard" element={<ModeratorDashboard />} />
          <Route path="content" element={<ContentApproval />} />
          <Route path="reported" element={<ReportedContent />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;