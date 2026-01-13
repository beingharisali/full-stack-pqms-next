"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import http from "@/services/http";
import { MdOutlineSort, MdAccessTime } from "react-icons/md";
import ProtectedRoute from "../component/protectedRoutes";

export type Availability = "morning" | "afternoon" | "evening";

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availability: Availability;
}

export default function Page() {
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortField, setSortField] = useState<
    "name" | "specialization" | "availability" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // 🔴 Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (availabilityFilter) params.availability = availabilityFilter;
      if (sortField)
        params.sort = sortOrder === "asc" ? sortField : `-${sortField}`;

      const res = await http.get("/doctors", { params });
      setDoctors(res.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [availabilityFilter, sortField, sortOrder]);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleEdit = (id: string) =>
    router.push(`/doctor/createdocter/${id}`);

// delete modal 
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

// open delete 
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await http.delete(`/doctors/${deleteId}`);
      setDoctors((prev) => prev.filter((d) => d._id !== deleteId));
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleSortChange = (
    field: "name" | "specialization" | "availability" | ""
  ) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Doctor Management</h1>
                <Link href="/doctor/createdocter">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                    <Plus size={18} /> Create Doctor
                  </button>
                </Link>
              </div>

              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search doctor or specialization..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-3 rounded-xl border w-64"
                />

                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border"
                >
                  <option value="">All Availability</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>

                <select
                  value={sortField}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                  className="px-4 py-3 rounded-xl border"
                >
                  <option value="">Sort By</option>
                  <option value="name">Name</option>
                  <option value="specialization">Specialization</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left">Doctor</th>
                      <th className="px-6 py-4 text-left">Specialization</th>
                      <th className="px-6 py-4 text-left">Availability</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentDoctors.map((doctor) => (
                      <tr key={doctor._id} className="border-b">
                        <td className="px-6 py-4">{doctor.name}</td>
                        <td className="px-6 py-4">{doctor.specialization}</td>
                        <td className="px-6 py-4 capitalize">
                          {doctor.availability}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-4">
                            <button
                              onClick={() => handleEdit(doctor._id)}
                              className="text-blue-600 flex gap-1"
                            >
                              <Pencil size={16} /> Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(doctor._id)}
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
        <Footer />
      </div>


      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold">Delete Doctor</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this doctor? This action cannot be
              undone.
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
