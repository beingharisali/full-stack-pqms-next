"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import http from "@/services/http";

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

interface Doctor {
  _id: string;
  name: string;
}

export default function Page() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"date" | "patient" | "doctor">("date");
  const [doctor, setDoctor] = useState("");


  const fetchDoctors = async () => {
    try {
      const res = await http.get("/doctors");
      setDoctors(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await http.get("/appointments", {
          params: {
            search: "",
            status,
            doctor,
            sort,
          },
        });
        setAppointments(res.data.data || []);
        console.log(res.data.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [status, doctor, sort]);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = appointments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleEdit = (id: string) => {
    router.push(`/apointment/createapointment/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await http.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar onLogout={() => console.log("logout")} />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="loader">
              <span className="loader-text">loading</span>
              <span className="load"></span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 ">
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
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <input
                type="text"
                placeholder="Search patient name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full md:w-1/3 dark:bg-gray-700 dark:border-gray-600"
              />

              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full md:w-1/4 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Doctor Filter (simple for now) */}
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full md:w-1/4 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">All Doctors</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as "date" | "patient" | "doctor")
                }
                className="px-4 py-2 border rounded-lg w-full md:w-1/4 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="date">Sort by Date</option>
                <option value="patient">Sort by Patient Name</option>
                <option value="doctor">Sort by Doctor Name</option>
              </select>
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
                    <th className="text-right px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentAppointments.map((appt) => (
                    <tr
                      key={appt._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {appt.patient?.name}
                      </td>

                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {appt.doctor?.name}
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
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                            ${
                              appt.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                : appt.status === "approved"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                            }
                          `}
                        >
                          {appt.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-4">
                          <button
                            onClick={() => handleEdit(appt._id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(appt._id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400"
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