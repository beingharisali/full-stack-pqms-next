"use client";

import React, { useState } from "react";
import Sidebar from "../../../component/sidebar";
import Navbar from "../../../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import Createdoctor from "@/app/component/createdoctor";
import { Params } from "next/dist/server/request/params";

interface EditDoctorPageProps {
  params: {
    id: string;
  };
}

export default function Page() {
  const params = useParams<{ id: string }>();
  return (
    <div className="flex flex-col min-h-screen bg-gray-500">
      <Navbar onLogout={() => console.log("logout")} />

      <div className="flex flex-1 ">
        <Sidebar />

        <main className="flex-1 p-6">
          <Createdoctor id={params.id} />
        </main>
      </div>
    </div>
  );
}
