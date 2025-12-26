"use client";

import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Patient {
  _id: string;
  name: string;
  age: string;
  history: string;
}

export default function Page() {
  const patients: Patient[] = [
    { _id: "1", name: "Ali Khan", age: "28", history: "Diabetes for 3 years" },
    { _id: "2", name: "Sara Ahmed", age: "34", history: "High blood pressure" },
    {
      _id: "3",
      name: "Usman Raza",
      age: "45",
      history: "Asthma since childhood",
    },
    {
      _id: "4",
      name: "Ayesha Malik",
      age: "26",
      history: "No previous medical history",
    },
    {
      _id: "5",
      name: "Hassan Ali",
      age: "52",
      history: "Heart surgery in 2021",
    },
  ];
  const router = useRouter();
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(patients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPatients = patients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleEdit = (id: string) => {
    router.push(`/doctor/createdocter/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Delete patient", id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar onLogout={() => console.log("logout")} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Patient Management
              </h1>

              <Link href="/patient/createpatient">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl">
                  <Plus size={18} />
                  Create Patient
                </button>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4">PATIENT</th>
                    <th className="text-left px-6 py-4">AGE</th>
                    <th className="text-left px-6 py-4">MEDICAL HISTORY</th>
                    <th className="text-right px-6 py-4">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {currentPatients.map((patient) => (
                    <tr key={patient._id} className="border-b">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {patient.name}
                      </td>

                      <td className="px-6 py-4">{patient.age}</td>
                      <td className="px-6 py-4">{patient.history}</td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-4">
                          <button
                            onClick={() => handleEdit(patient._id)}
                            className="text-blue-600 flex items-center gap-1"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(patient._id)}
                            className="text-red-600 flex items-center gap-1"
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
    </div>
  );
}
