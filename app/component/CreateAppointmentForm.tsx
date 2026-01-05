"use client";

import React, { useEffect, useState } from "react";
import http from "@/services/http";
import { useRouter } from "next/navigation";

import { Availability } from "../doctor/page";

interface Appointment {
  patient: string;
  doctor: string;
  appointmentDate: string;
  timeSlot: string;
  reason: string;
  status: "pending" | "approved" | "completed" | "cancelled";
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availability: Availability;
}
interface Patient {
  _id: string;
  name: string;
  age: string;
  history: string;
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
    status: "pending",
  });
  const [patients, setPatient] = useState([]);
  const router = useRouter();

  const [doctors, setDoctor] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchDocter = async () => {
      try {
        const res = await http.get<Patient[]>("/patients");
        console.log(res.data.data);
        setPatient(res.data.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
      try {
        const res = await http.get<Doctor[]>("/doctors");
        console.log(res.data.data);
        setDoctor(res.data.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };
    fetchDocter();
    if (!id) return;

    const fetchAppointment = async () => {
      try {
        setLoading(true);

        const res = await http.get(`/appointments/${id}`);
        const data = res.data.data;

        setAppointment({
          patient: data.patient?._id || "",
          doctor: data.doctor?._id || "",
          appointmentDate: data.appointmentDate
            ? data.appointmentDate.slice(0, 10)
            : "",
          timeSlot: data.timeSlot || "",
          reason: data.reason || "",
          status: data.status || "pending",
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
        // await axios.put(`/api/appointments/${id}`, payload);
        await http.put(`/appointments/${id?.trim()}`, payload);
        console.log("Updating doctor with id:", `"${id}"`);
        alert("Appointment updated successfully");
        router.push("/apointment");
      } else {
        await http.post("/appointments", payload);
        alert("Appointment created successfully");
        router.push("/apointment");
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
        {/* Patient Select Field */}
        <select
          name="patient"
          value={appointment.patient}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="" className="dark:bg-gray-900 dark:text-white">
            Select Patient
          </option>
          {patients.map((patient) => (
            <option
              key={patient._id}
              value={patient._id}
              className="dark:bg-gray-900 dark:text-white"
            >
              {patient.name}
            </option>
          ))}
        </select>

        {/* Doctor Select Field */}
        <select
          name="doctor"
          value={appointment.doctor}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="" className="dark:bg-gray-900 dark:text-white">
            Select Doctor
          </option>
          {doctors.map((doctor) => (
            <option
              key={doctor._id}
              value={doctor._id}
              className="dark:bg-gray-900 dark:text-white"
            >
              {doctor.name}
            </option>
          ))}
        </select>

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
        <select
          name="status"
          value={appointment.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="pending" className="dark:bg-gray-900 dark:text-white">
            Pending
          </option>
          <option value="approved" className="dark:bg-gray-900 dark:text-white">
            Approved
          </option>
          <option
            value="completed"
            className="dark:bg-gray-900 dark:text-white"
          >
            Completed
          </option>
          <option
            value="cancelled"
            className="dark:bg-gray-900 dark:text-white"
          >
            Cancelled
          </option>
        </select>

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