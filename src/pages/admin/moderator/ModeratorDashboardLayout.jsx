import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../../components/Layout/AdminNavbar"; 

const ModeratorDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="p-6">
        <Outlet /> 
      </main>
    </div>
  );
};

export default ModeratorDashboardLayout;