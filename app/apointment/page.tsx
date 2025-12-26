"use client";

import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Appointment {
  patient: string;
  doctor: string;
  appointmentdate: string;
  timeslot: string;
  reason: string;
}

// Dummy Appointment Array
const appointments: Appointment[] = [
  {
    patient: "Ali Khan",
    doctor: "Dr. Hart Hagerty",
    appointmentdate: "2025-12-28",
    timeslot: "10:00 AM - 10:30 AM",
    reason: "General Checkup",
  },
  {
    patient: "Sara Ahmed",
    doctor: "Dr. Ahmed Khan",
    appointmentdate: "2025-12-29",
    timeslot: "11:00 AM - 11:30 AM",
    reason: "Dental Cleaning",
  },
  {
    patient: "John Doe",
    doctor: "Dr. Sarah Johnson",
    appointmentdate: "2025-12-30",
    timeslot: "01:00 PM - 01:30 PM",
    reason: "Skin Consultation",
  },
  {
    patient: "Ayesha Malik",
    doctor: "Dr. Ali Raza",
    appointmentdate: "2025-12-31",
    timeslot: "02:00 PM - 02:30 PM",
    reason: "Orthopedic Checkup",
  },
  {
    patient: "Omar Farooq",
    doctor: "Dr. Hart Hagerty",
    appointmentdate: "2026-01-01",
    timeslot: "03:00 PM - 03:30 PM",
    reason: "Follow-up Visit",
  },
];

export default function Page() {
  const router = useRouter();

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = appointments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleEdit = (index: number) => {
    router.push(`/apointment/createapointment/${index}`);
  };

  const handleDelete = (index: number) => {
    console.log("Delete appointment:", index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar onLogout={() => console.log("logout")} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto ">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Appointment Management
              </h1>

              <Link href="/apointment/createapointment">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
                  <Plus size={18} />
                  Create Appointment
                </button>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden ">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left px-6 py-4">Patient</th>
                    <th className="text-left px-6 py-4">Doctor</th>
                    <th className="text-left px-6 py-4">Date</th>
                    <th className="text-left px-6 py-4">Time Slot</th>
                    <th className="text-left px-6 py-4">Reason</th>
                    <th className="text-right px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentAppointments.map((appt, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {appt.patient}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {appt.doctor}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {appt.appointmentdate}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {appt.timeslot}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {appt.reason}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-4">
                          <button
                            onClick={() => handleEdit(index)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(index)}
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
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Page <strong>{currentPage}</strong> of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
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
