"use client";
import React from "react";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import AdminDashboard from "../component/dashboard";

function page() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar onLogout={() => console.log("logout")} />

      <div className="flex flex-1">
        <Sidebar />
        <main className=" flex-1 p-6">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}

export default page;
