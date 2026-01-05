"use client";

import React, { useEffect, useState } from "react";
import { UserRound, Users, CalendarCheck } from "lucide-react";
import http from "@/services/http";
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
}
interface Patient {
  _id: string;
  name: string;
  age: string;
  history: string;
}

export default function AdminDashboard() {
  const [doctors, setDoctor] = useState([]);
  const [patients, setPatient] = useState([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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
      try {
        const res = await http.get<Appointment[]>("/appointments");
        console.log(res.data.data);
        setAppointments(res.data.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };
    fetchDocter();
  }, []);

  return (
    <div
      className="
    min-h-screen
    p-6
    space-y-6
    transition-colors
    duration-300
    bg-gray-50
    text-gray-900

    dark:bg-gray-950
    dark:text-gray-100
  "
    >
      {/* Header */}
      <h1
        className="
      text-2xl
      font-bold
      text-gray-800

      dark:text-white
    "
      >
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Doctors"
          count={doctors.length}
          icon={<UserRound size={28} />}
          color="bg-blue-600"
        />
        <DashboardCard
          title="Patients"
          count={patients.length}
          icon={<Users size={28} />}
          color="bg-green-600"
        />
        <DashboardCard
          title="Appointments"
          count={appointments.length}
          icon={<CalendarCheck size={28} />}
          color="bg-purple-600"
        />
      </div>

      {/* Recent Appointments (Dark Mode Ready) */}
      {/* <div
        className="
      rounded-xl
      border
      p-5
      shadow-sm
      bg-white
      border-gray-200

      dark:bg-gray-900
      dark:border-gray-800
    "
      >
        <h2
          className="
        text-lg
        font-semibold
        mb-4
        text-gray-800

        dark:text-white
      "
        >
          Recent Appointments
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="
              border-b
              text-gray-600

              dark:border-gray-800
              dark:text-gray-400
            "
              >
                <th className="text-left py-2">Doctor</th>
                <th className="text-left py-2">Patient</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr
                  key={appt._id}
                  className="
                border-b
                last:border-0

                dark:border-gray-800
              "
                >
                  <td className="py-2">{appt.doctor}</td>
                  <td className="py-2">{appt.patient}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">
                    {appt.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}

/* Dashboard Card Component */
interface CardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface CardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string; // icon background color (e.g. bg-blue-500)
}

export function DashboardCard({ title, count, icon, color }: CardProps) {
  return (
    <div
      className="
        group
        rounded-xl
        p-5
        flex
        items-center
        justify-between
        border
        transition-all
        duration-300
        bg-white
        border-gray-200
        shadow-sm
        hover:shadow-md

        dark:bg-gray-900
        dark:border-gray-800
        dark:hover:shadow-lg
      "
    >
      {/* Left Content */}
      <div>
        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          {title}
        </p>

        <h3
          className="
            text-2xl
            font-bold
            text-gray-900
            dark:text-white
          "
        >
          {count}
        </h3>
      </div>

      {/* Icon */}
      <div
        className={`
          p-3
          rounded-lg
          text-white
          ${color}
          transition-transform
          duration-300
          group-hover:scale-105
        `}
      >
        {icon}
      </div>
    </div>
  );
}
