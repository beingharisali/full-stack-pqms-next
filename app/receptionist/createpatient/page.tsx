"use client";

import React, { useState } from "react";
import Sidebar from "../../component/residebar";
import Navbar from "../../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import CreateEditPatientForm from "@/app/component/rescreatepatient";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-500">
      <Navbar />

      <div className="flex flex-1 ">
        <Sidebar />

        <main className="flex-1 p-6 dark:text-black">
          <CreateEditPatientForm />
        </main>
      </div>
    </div>
  );
}
