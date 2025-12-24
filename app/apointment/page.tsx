"use client";

import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Ahmed Khan",
      email: "ahmed@gmail.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Sarah Ali",
      email: "sarah@mailinator.com",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Hamza Raza",
      email: "hamza@gmail.com",
      status: "Active",
    },
    {
      id: 4,
      name: "Dr. Ayesha Noor",
      email: "ayesha@mailinator.com",
      status: "Active",
    },
    {
      id: 5,
      name: "Dr. Usman Shah",
      email: "usman@gmail.com",
      status: "Active",
    },
    { id: 6, name: "Dr. Ali Raza", email: "ali@gmail.com", status: "Active" },
  ];

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDoctors = doctors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-gray-500">
      <Navbar onLogout={() => console.log("logout")} />

      <div className="flex flex-1 ">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold">
                  Apointment Management
                </h1>
                <p className="text-sm text-white-500">
                  Manage apointment of docters
                </p>
              </div>
              <Link href={"apointment/createapointment"}>
                <button className="flex items-center gap-2 bg-blue-600 mt-10 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Plus size={18} /> Create Apointment
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b">
                  <tr>
                    <th className="text-left px-6 py-4">Patient</th>
                    <th className="text-left px-6 py-4">DOCTOR</th>
                    <th className="text-left px-6 py-4">DATE AND TIME</th>

                    <th className="text-left px-6 py-4">STATUS</th>
                    <th className="text-left px-6 py-4">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {currentDoctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="border-b last:border-none  hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                          {doctor.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium dark:text-black">
                          {doctor.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 dark:text-black">
                        {doctor.email}
                      </td>
                      <td className="px-6 py-4 dark:text-black">
                        {doctor.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                          Active
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          <button className="text-blue-600 flex items-center gap-1">
                            <Pencil size={16} /> Edit
                          </button>
                          <button className="text-red-600 flex items-center gap-1">
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50 dark:text-black"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50 dark:text-black"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
