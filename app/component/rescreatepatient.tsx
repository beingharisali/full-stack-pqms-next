"use client";

import React, { useEffect, useState } from "react";
import http from "@/services/http";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Patient {
  name: string;
  age: number | "";
  history: string;
}

interface CreateEditPatientProps {
  id?: string;
}

export default function CreateEditPatientForm({ id }: CreateEditPatientProps) {
  const [patient, setPatient] = useState<Patient>({
    name: "",
    age: 0,
    history: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/patients/${id}`);
        const data = res.data.data;

        setPatient({
          name: data.name,
          age: data.age,
          history: data.history,
        });
      } catch (error) {
        console.error("Failed to fetch patient", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...patient,
    };

    toast.promise(
      isEditMode
        ? http.patch(`/patients/${id?.trim()}`, patient)
        : http.post("/patients", patient),
      {
        loading: isEditMode ? "Updating Patient..." : "Creating Patient...",
        success: isEditMode
          ? "Patient updated successfully"
          : "Patient created successfully",
        error: "Operation failed",
      },
      {
        style: {
          background: "#1f2937", // gray-800
          color: "#fff",
          border: "1px solid #374151",
        },
      }
    );
    router.push("/receptionist");
  };

  if (loading) {
    return (
      <div className="text-center py-10 font-semibold">Loading patient...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Patient" : "Create Patient"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={patient.name}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0 "
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={patient.age}
          onChange={handleChange}
          max={150}
          min={0}
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0"
          required
        />

        <textarea
          name="history"
          placeholder="Medical History"
          value={patient.history}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0 "
          rows={4}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {isEditMode ? "Update Patient" : "Create Patient"}
        </button>
      </form>
    </div>
  );
}
