"use client";

import React, { useEffect, useState } from "react";
import http from "@/services/http";

interface Appointment {
  patient: string;
  doctor: string;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
}

interface CreateEditAppointmentProps {
  id?: string;
}

export default function CreateEditAppointmentForm({
  id,
}: CreateEditAppointmentProps) {
  const [appointment, setAppointment] = useState<Appointment>({
    patient: "",
    doctor: "",
    appointmentDate: "",
    timeSlot: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/appointments/${id}`);
        const data = res.data.data;

        setAppointment({
          patient: data.patient,
          doctor: data.doctor,
          appointmentDate: data.appointmentDate.slice(0, 10),
          timeSlot: data.timeSlot,
          reason: data.reason,
        });
      } catch (error) {
        console.error("Failed to fetch appointment", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...appointment,
      appointmentDate: new Date(appointment.appointmentDate),
    };

    try {
      if (isEditMode) {
        if (!id) return;
        await http.put(`/appointments/${id}`, payload);
        alert("Appointment updated successfully");
      } else {
        await http.post("/appointments", payload);
        alert("Appointment created successfully");
      }
    } catch (error) {
      console.error("Submit failed", error);
      alert("Operation failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 font-semibold">
        Loading appointment...
      </div>
    );
  }

  return (
    <div className="max-w-xlg mx-auto p-6 bg-white shadow rounded dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Appointment" : "Create Appointment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="patient"
          value={appointment.patient}
          onChange={handleChange}
          placeholder="Patient ID"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="doctor"
          value={appointment.doctor}
          onChange={handleChange}
          placeholder="Doctor ID"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="date"
          name="appointmentDate"
          value={appointment.appointmentDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="timeSlot"
          value={appointment.timeSlot}
          onChange={handleChange}
          placeholder="Time Slot (e.g., 10:00 AM - 11:00 AM)"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="reason"
          value={appointment.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />

        <button
          type="submit"
          className={`w-full py-2 text-white rounded ${
            isEditMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isEditMode ? "Update Appointment" : "Create Appointment"}
        </button>
      </form>
    </div>
  );
}