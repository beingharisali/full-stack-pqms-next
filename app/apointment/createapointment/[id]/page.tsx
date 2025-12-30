"use client";

import React, { useState } from "react";
import Sidebar from "../../../component/sidebar";
import Navbar from "../../../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CreateAppointmentForm from "@/app/component/CreateAppointmentForm";

interface EditApointmentPageProps {
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

        <main className="flex-1 p-6 dark:text-black">
          <CreateAppointmentForm id={params.id} />
        </main>
      </div>
    </div>
  );
}
