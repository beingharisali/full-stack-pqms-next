"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import http from "@/services/http";
import { MdOutlineSort } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
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
  const [loading, setLoading] = useState<boolean>(false);

  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortField, setSortField] = useState<
    "name" | "specialization" | "availability" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch doctors from backend with filter & sort
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

  // Frontend search
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

  const handleEdit = (id: string) => router.push(`/doctor/createdocter/${id}`);
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await http.delete(`/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
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
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Doctor Management
                </h1>
                <Link href="/doctor/createdocter">
                  <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105">
                    <Plus size={18} /> Create Doctor
                  </button>
                </Link>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search doctor or specialization..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />

                <div className="flex flex-row justify-end w-full gap-3">
                  {/* Availability Filter */}
                  <div className="relative w-48 group">
                    {/* Clock Icon */}
                    <MdAccessTime
                      size={20}
                      className="
        absolute left-3 top-1/2 -translate-y-1/2
        text-gray-400 dark:text-gray-300
        pointer-events-none
        transition-colors duration-200
        group-focus-within:text-blue-500
      "
                    />
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="
        w-full pl-10 pr-4 py-3
        rounded-xl border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-white
        shadow-sm
        transition-all duration-200 ease-in-out
        hover:border-blue-500 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        cursor-pointer
      "
                    >
                      <option value="">All Availability</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="relative w-48 group">
                    {/* Sort Icon */}
                    <MdOutlineSort
                      size={20}
                      className="
        absolute left-3 top-1/2 -translate-y-1/2
        text-gray-400 dark:text-gray-300
        pointer-events-none
        transition-colors duration-200
        group-focus-within:text-blue-500
      "
                    />
                    <select
                      value={sortField}
                      onChange={(e) => handleSortChange(e.target.value as any)}
                      className="
        w-full pl-10 pr-4 py-3
        rounded-xl border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-white
        shadow-sm
        transition-all duration-200 ease-in-out
        hover:border-blue-500 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        cursor-pointer
      "
                    >
                      <option value="">Sort By</option>
                      <option value="name">Name</option>
                      <option value="specialization">Specialization</option>
                      <option value="availability">Availability</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                    <tr>
                      <th className="text-left px-6 py-4">DOCTOR</th>
                      <th className="text-left px-6 py-4">SPECIALIZATION</th>
                      <th className="text-left px-6 py-4">AVAILABILITY</th>
                      <th className="text-right px-6 py-4">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentDoctors.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-10 text-gray-500 dark:text-gray-400"
                        >
                          No doctors found
                        </td>
                      </tr>
                    )}

                    {currentDoctors.map((doctor) => (
                      <tr
                        key={doctor._id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold uppercase shadow-md">
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
                          ${doctor.availability === "morning"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                : doctor.availability === "afternoon"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                  : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                              }`}
                          >
                            {doctor.availability}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-3">
                            <button
                              onClick={() => handleEdit(doctor._id)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                            >
                              <Pencil size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(doctor._id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Page <strong>{currentPage}</strong> of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
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
