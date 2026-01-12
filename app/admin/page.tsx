"use client";
import React from "react";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import AdminDashboard from "../component/dashboard";
import Footer from "../component/footer";
import ProtectedRoute from "../component/protectedRoutes";

function Page() {

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">

        {/* Navbar */}
        <Navbar  />

        {/* Page Content */}
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <AdminDashboard />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default Page;
