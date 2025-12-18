"use client"; // ensure client-side rendering for Navbar/Sidebar

import React from "react";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";

export default function Page() {
    return (
        <div className="flex">
            <Navbar onLogout={() => console.log("logout")} />
            <Sidebar />
            <div className="flex-1 p-4">
            </div>
        </div>
    );
}
