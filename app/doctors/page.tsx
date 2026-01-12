"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import http from "@/services/http";
import ProtectedRoute from "../component/protectedRoutes";


interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
  };
  doctor: {
    _id: string;
    name: string;
  };
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  status: "pending" | "approved" | "completed" | "cancelled";
}

export default function Page() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await http.get("/appointments");
        setAppointments(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);


  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      appt.doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleStatusChange = async (
    id: string,
    newStatus: Appointment["status"]
  ) => {
    try {
      await http.put(`/appointments/${id}`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="loader">
              <span className="loader-text">loading</span>
              <span className="load"></span>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* 🔍 Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Appointment Management
                </h1>
                <input
                  type="text"
                  placeholder="Search by patient or doctor..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // Reset page on new search
                  }}
                  className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-300
                  dark:border-gray-600 dark:bg-gray-800 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                    <tr>
                      <th className="text-left px-6 py-4">Patient</th>
                      <th className="text-left px-6 py-4">Doctor</th>
                      <th className="text-left px-6 py-4">Date</th>
                      <th className="text-left px-6 py-4">Time Slot</th>
                      <th className="text-left px-6 py-4">Reason</th>
                      <th className="text-left px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentAppointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-6 text-gray-500 dark:text-gray-300"
                        >
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      currentAppointments.map((appt) => (
                        <tr
                          key={appt._id}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                            {appt.patient.name}
                          </td>
                          <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                            {appt.doctor.name}
                          </td>
                          <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                            {new Date(appt.appointmentDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                            {appt.timeSlot}
                          </td>
                          <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                            {appt.reason || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={appt.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  appt._id,
                                  e.target.value as Appointment["status"]
                                )
                              }
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize cursor-pointer
                              ${appt.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                  : appt.status === "approved"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                    : appt.status === "completed"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                }`}
                            >
                              <option value="pending">pending</option>
                              <option value="approved">approved</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
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

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
