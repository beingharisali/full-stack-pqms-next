"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import http from "@/services/http";

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

  const ITEMS_PER_PAGE = 5;

  
  const fetchPatients = async () => {
    try {
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
    if (!value) {
      setSortBy("");
      return;
    }

    const [field, ord] = value.split("_");
    setSortBy(field as "name" | "age");
    setOrder(ord as "asc" | "desc");
  };

  return (
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

              <div className="flex gap-4 flex-wrap">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search patient name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-3 w-64 rounded-xl border dark:bg-gray-800 dark:text-white"
                />

                {/* Sort */}
                <select
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-3 rounded-xl border dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sort By</option>
                  <option value="name_asc">Name (A → Z)</option>
                  <option value="name_desc">Name (Z → A)</option>
                  <option value="age_asc">Age (Low → High)</option>
                  <option value="age_desc">Age (High → Low)</option>
                </select>

                <Link href="/patient/createpatient">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                    <Plus size={18} /> Create Patient
                  </button>
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4">NAME</th>
                    <th className="text-left px-6 py-4">AGE</th>
                    <th className="text-left px-6 py-4">HISTORY</th>
                    <th className="text-right px-6 py-4">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {currentPatients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-gray-500">
                        No patients found
                      </td>
                    </tr>
                  )}

                  {currentPatients.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">{p.name}</td>
                      <td className="px-6 py-4">{p.age}</td>
                      <td className="px-6 py-4">{p.history}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-4">
                          <button
                            onClick={() => router.push(`/patient/createpatient/${p._id}`)}
                            className="text-blue-600 flex items-center gap-1"
                          >
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between px-6 py-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
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
  );
}
