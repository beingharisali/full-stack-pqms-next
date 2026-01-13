"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

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
            search,
            status,
            doctor,
            sort,
          },
        });
        setAppointments(res.data.data || []);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [search, status, doctor, sort]);

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = appointments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleEdit = (id: string) => {
    router.push(`/apointment/createapointment/${id}`);
  };

  
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await http.delete(`/appointments/${deleteId}`);
      setAppointments((prev) => prev.filter((a) => a._id !== deleteId));
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 flex items-center justify-center">
              <div className="loader">
                <span className="loader-text">loading</span>
                <span className="load"></span>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Appointment Management
                </h1>

                <Link href="/apointment/createapointment">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                    <Plus size={18} />
                    Create Appointment
                  </button>
                </Link>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search patient name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">All Doctors</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name}
                    </option>
                  ))}
                </select>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value as "date" | "patient" | "doctor")
                  }
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="date">Sort by Date</option>
                  <option value="patient">Sort by Patient</option>
                  <option value="doctor">Sort by Doctor</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left">Patient</th>
                      <th className="px-6 py-4 text-left">Doctor</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Time</th>
                      <th className="px-6 py-4 text-left">Reason</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentAppointments.map((appt) => (
                      <tr key={appt._id} className="border-b">
                        <td className="px-6 py-4">{appt.patient?.name}</td>
                        <td className="px-6 py-4">{appt.doctor?.name}</td>
                        <td className="px-6 py-4">
                          {new Date(appt.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{appt.timeSlot}</td>
                        <td className="px-6 py-4">{appt.reason || "-"}</td>
                        <td className="px-6 py-4 capitalize">{appt.status}</td>

                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-4">
                            <button
                              onClick={() => handleEdit(appt._id)}
                              className="text-blue-600 flex gap-1"
                            >
                              <Pencil size={16} /> Edit
                            </button>

                            <button
                              onClick={() => openDeleteModal(appt._id)}
                              className="text-red-600 flex gap-1"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* 🔴 DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold">Delete Appointment</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this appointment?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
