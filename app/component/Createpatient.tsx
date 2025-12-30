"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import http from "@/services/http";

interface Patient {
  name: string;
  age: string;
  history: string;
}

interface CreateEditPatientProps {
  id?: string;
}

export default function CreateEditPatientForm({ id }: CreateEditPatientProps) {
  const [patient, setPatient] = useState<Patient>({
    name: "",
    age: "",
    history: "",
  });

  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  // 🟢 Fetch appointment when ID exists
  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
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
        console.error("Failed to create patient", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  // handle change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...patient,
    };

    try {
      if (isEditMode) {
        if (!id) return;
        await http.patch(`/patients/${id?.trim()}`, patient);
        console.log("Updating patient with id:", `"${id}"`);
        // await axios.put(`/api/appointments/${id}`, payload);
        console.log(payload);
        alert("Patient updated successfully");
      } else {
        await http.post("/patients", patient);
        // await axios.post("/api/appointments", payload);
        console.log(payload);
        alert("Patient created successfully");
      }
    } catch (error) {
      console.error("Submit failed", error);
    }
  };

  // loading UI
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
          className="w-full border px-3 py-2 rounded "
          required
        />

        <input
          type="text"
          name="age"
          placeholder="Age"
          value={patient.age}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded  "
          required
        />

        <textarea
          name="history"
          placeholder="Medical History"
          value={patient.history}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded  "
          rows={4}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Edit Patient" : "Create Patient"}
        </button>
      </form>
    </div>
  );
}
