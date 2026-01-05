"use client";

import React, { useEffect, useState } from "react";
import http from "@/services/http";
import { useRouter } from "next/navigation";

interface Patient {
  name: string;
  age: number;
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
      [name]: name === 'age' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        if (!id) return;
        await http.patch(`/patients/${id}`, patient);
        alert("Patient updated successfully");
        router.push("/patient");
      } else {
        await http.post("/patients", patient);
        alert("Patient created successfully");
        router.push("/patient");
      }
    } catch (error) {
      console.error("Submit failed", error);
      alert("Operation failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 font-semibold">Loading patient...</div>
    );
  }

  return (
    <div className="max-w-xlg mx-auto p-6 bg-white shadow rounded dark:bg-gray-900">
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
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={patient.age}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          min="0"
          max="150"
          required
        />

        <textarea
          name="history"
          placeholder="Medical History"
          value={patient.history}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={4}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Patient" : "Create Patient"}
        </button>
      </form>
    </div>
  );
}