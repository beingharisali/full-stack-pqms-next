"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import http from "@/services/http";
import { useRouter } from "next/navigation";

import { Availability } from "../doctor/page";
import toast from "react-hot-toast";

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

  // 🟢 Fetch appointment when ID exists
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
      appointmentDate: new Date(appointment.appointmentDate),
    };

    toast.promise(
      isEditMode
        ? http.put(`/appointments/${id?.trim()}`, payload)
        : http.post("/appointments", payload),
      {
        loading: isEditMode
          ? "Updating appointment..."
          : "Creating appointment...",
        success: isEditMode
          ? "Appointment updated successfully"
          : "Appointment created successfully",
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
    router.push("/apointment");
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
    <div className="max-w-xl   mx-auto p-6 bg-white shadow rounded-xl dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? "Edit Appointment" : "Create Appointment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Select Field */}
        <select
          name="patient"
          value={appointment.patient}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0"
          required
        >
          <option value="" className="dark:bg-gray-800 dark:text-white">
            Select Patient
          </option>
          {patients.map((patient) => (
            <option
              key={patient._id}
              value={patient._id}
              className="dark:bg-gray-800 dark:text-white"
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
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0"
          required
        >
          <option value="" className="dark:bg-gray-800 dark:text-white">
            Select Doctor
          </option>
          {doctors.map((doctor) => (
            <option
              key={doctor._id}
              value={doctor._id}
              className="dark:bg-gray-800 dark:text-white"
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
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0"
          required
        />

        <input
          name="timeSlot"
          value={appointment.timeSlot}
          onChange={handleChange}
          placeholder="Time Slot"
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0"
          required
        />

        <textarea
          name="reason"
          value={appointment.reason}
          onChange={handleChange}
          placeholder="Reason"
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0"
          rows={3}
          required
        />
        <select
          name="status"
          value={appointment.status}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 px-3 py-2 rounded-lg dark:bg-gray-800 outline-0"
        >
          <option value="pending" className="dark:bg-gray-800 dark:text-white">
            Pending
          </option>
          <option value="approved" className="dark:bg-gray-800 dark:text-white">
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
          className={`w-full py-2 text-white rounded-lg ${
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
