"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Appointment {
  patient: string;
  doctor: string;
  appointmentdate: string;
  timeslot: string;
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
    appointmentdate: "",
    timeslot: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  // 🟢 Fetch appointment when ID exists
  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/appointments/${id}`);

        const data = res.data;

        setAppointment({
          patient: data.patient,
          doctor: data.doctor,
          appointmentdate: data.appointmentdate.slice(0, 10),
          timeslot: data.timeslot,
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

  // handle change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...appointment,
      appointmentdate: new Date(appointment.appointmentdate),
    };

    try {
      if (isEditMode) {
        // await axios.put(`/api/appointments/${id}`, payload);
        console.log(payload);
        alert("Appointment updated successfully");
      } else {
        // await axios.post("/api/appointments", payload);
        console.log(payload);
        alert("Appointment created successfully");
      }
    } catch (error) {
      console.error("Submit failed", error);
    }
  };

  // loading UI
  if (loading) {
    return (
      <div className="text-center py-10 font-semibold">
        Loading appointment...
      </div>
    );
  }

  return (
    <div className="max-w-xlg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Appointment" : "Create Appointment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="patient"
          value={appointment.patient}
          onChange={handleChange}
          placeholder="Patient"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="doctor"
          value={appointment.doctor}
          onChange={handleChange}
          placeholder="Doctor"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="date"
          name="appointmentdate"
          value={appointment.appointmentdate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="timeslot"
          value={appointment.timeslot}
          onChange={handleChange}
          placeholder="Time Slot"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="reason"
          value={appointment.reason}
          onChange={handleChange}
          placeholder="Reason"
          className="w-full border px-3 py-2 rounded"
          rows={3}
          required
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
