"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import http from "@/services/http";
import { FiSearch } from "react-icons/fi";
import { MdOutlineSort } from "react-icons/md";
import ProtectedRoute from "../component/protectedRoutes";

interface Patient {
  _id: string;
  name: string;
  age: number;
  history: string;
}

export default function Page() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "age" | "">("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔴 Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 5;

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (sortBy) {
        params.sortBy = sortBy;
        params.order = order;
      }

      const res = await http.get("/patients", { params });
      setPatients(res.data.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [sortBy, order]);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPatients = filteredPatients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSortChange = (value: string) => {
    if (!value.trim()) {
      setSortBy("");
      return;
    }

    const [field, ord] = value.split("_");
    setSortBy(field as "name" | "age");
    setOrder(ord as "asc" | "desc");
  };

  // 🔴 Open delete modal
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // 🔴 Confirm delete
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await http.delete(`/patients/${deleteId}`);
      setPatients((prev) => prev.filter((p) => p._id !== deleteId));
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
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
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Patient Management
                </h1>

                <Link href="/patient/createpatient">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                    <Plus size={18} />
                    Create Patient
                  </button>
                </Link>
              </div>

              {/* Search & Sort */}
              <div className="mb-3 flex justify-end gap-3">
                <div className="relative w-64">
                  <FiSearch
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search patient name..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="relative w-56">
                  <MdOutlineSort
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800"
                  >
                    <option value="">SORT BY</option>
                    <option value="name_asc">A–Z Name</option>
                    <option value="name_desc">Z–A Name</option>
                    <option value="age_asc">Age ↑</option>
                    <option value="age_desc">Age ↓</option>
                  </select>
                </div>
              </div>

            
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left">NAME</th>
                      <th className="px-6 py-4 text-left">AGE</th>
                      <th className="px-6 py-4 text-left">HISTORY</th>
                      <th className="px-6 py-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentPatients.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-10">
                          No patients found
                        </td>
                      </tr>
                    )}

                    {currentPatients.map((p) => (
                      <tr key={p._id} className="border-b">
                        <td className="px-6 py-4">{p.name}</td>
                        <td className="px-6 py-4">{p.age}</td>
                        <td className="px-6 py-4">{p.history}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-4">
                            <button
                              onClick={() =>
                                router.push(`/patient/createpatient/${p._id}`)
                              }
                              className="text-blue-600 flex gap-1"
                            >
                              <Pencil size={16} /> Edit
                            </button>

                            <button
                              onClick={() => openDeleteModal(p._id)}
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

              
                {totalPages > 1 && (
                  <div className="flex justify-between px-6 py-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
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

  
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold">Delete Patient</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this patient? 
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
