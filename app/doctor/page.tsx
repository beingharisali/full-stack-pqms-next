"use client";

import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Availability = "morning" | "afternoon" | "evening";

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availability: Availability;
}

const doctors: Doctor[] = [
  {
    _id: "1",
    name: "Dr Ahmed Khan",
    specialization: "Cardiology",
    availability: "morning",
  },
  {
    _id: "2",
    name: "Dr Sara Malik",
    specialization: "Dermatology",
    availability: "afternoon",
  },
  {
    _id: "3",
    name: "Dr Usman Ali",
    specialization: "Orthopedics",
    availability: "evening",
  },
  {
    _id: "4",
    name: "Dr Ayesha Noor",
    specialization: "Pediatrics",
    availability: "morning",
  },
  {
    _id: "5",
    name: "Dr Hamza Sheikh",
    specialization: "Neurology",
    availability: "afternoon",
  },
  {
    _id: "6",
    name: "Dr Fatima Zahra",
    specialization: "Gynecology",
    availability: "evening",
  },
  {
    _id: "7",
    name: "Dr Bilal Hussain",
    specialization: "ENT",
    availability: "morning",
  },
  {
    _id: "8",
    name: "Dr Maria Khan",
    specialization: "Ophthalmology",
    availability: "afternoon",
  },
];

export default function Page() {
  const router = useRouter();

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDoctors = doctors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (id: string) => {
    router.push(`/doctor/createdocter/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Delete doctor:", id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar onLogout={() => console.log("logout")} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Doctor Management
              </h1>

              <Link href="/doctor/createdocter">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
                  <Plus size={18} />
                  Create Doctor
                </button>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left px-6 py-4">DOCTOR</th>
                    <th className="text-left px-6 py-4">SPECIALIZATION</th>
                    <th className="text-left px-6 py-4">AVAILABILITY</th>
                    <th className="text-right px-6 py-4">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {currentDoctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
                          {doctor.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {doctor.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {doctor.specialization}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                            ${
                              doctor.availability === "morning"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                : doctor.availability === "afternoon"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                            }
                          `}
                        >
                          {doctor.availability}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-4">
                          <button
                            onClick={() => handleEdit(doctor._id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(doctor._id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-lg text-sm
                      disabled:opacity-50
                      text-gray-700 dark:text-gray-200
                      hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Page <strong>{currentPage}</strong> of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg text-sm
                      disabled:opacity-50
                      text-gray-700 dark:text-gray-200
                      hover:bg-gray-100 dark:hover:bg-gray-600"
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
