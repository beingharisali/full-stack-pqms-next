"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { Plus } from "lucide-react";
import Link from "next/link";
import http from "@/services/http";
import Footer from "../component/footer";

interface Doctor {
    _id: string;
    name: string;
    specialization: string;
    availability?: string;
}

interface Appointment {
    _id: string;
    patient: {
        _id: string;
        name: string;
    };
    doctor: {
        _id: string;
        name: string;
    };
    appointmentDate: string;
    timeSlot: string;
    reason: string;
    status: "pending" | "approved" | "completed" | "cancelled";
}

interface Patient {
    _id?: string;
    name: string;
    email: string;
    phone: string;
}

export default function ReceptionistDashboard() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch doctors, appointments, patients
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsRes, appointmentsRes, patientsRes] = await Promise.all([
                    http.get("/doctors"),
                    http.get("/appointments"),
                    http.get("/patients"),
                ]);

                setDoctors(doctorsRes.data.data || []);
                setAppointments(appointmentsRes.data.data || []);
                setPatients(patientsRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
                <Navbar onLogout={() => console.log("logout")} />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 p-6 flex items-center justify-center">
                        <div className="text-center text-gray-700 dark:text-gray-200">
                            Loading dashboard...
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar onLogout={() => console.log("logout")} />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Receptionist Dashboard
                            </h1>

                            <div className="flex gap-4">
                                <Link href="/apointment/createapointment">
                                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
                                        <Plus size={18} />
                                        Create Appointment
                                    </button>
                                </Link>
                                <Link href="/patient/createpatient">
                                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition">
                                        <Plus size={18} />
                                        Create Patient
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Doctors Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-8">
                            <h2 className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">
                                Doctors
                            </h2>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                                    <tr>
                                        <th className="text-left px-6 py-4">Name</th>
                                        <th className="text-left px-6 py-4">Specialization</th>
                                        <th className="text-left px-6 py-4">Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-gray-500 dark:text-gray-300">
                                                No doctors found
                                            </td>
                                        </tr>
                                    ) : (
                                        doctors.map((doctor) => (
                                            <tr key={doctor._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{doctor.name}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{doctor.specialization}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{doctor.availability || "Not set"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Patients Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-8">
                            <h2 className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">
                                Patients
                            </h2>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                                    <tr>
                                        <th className="text-left px-6 py-4">Name</th>
                                        <th className="text-left px-6 py-4">Email</th>
                                        <th className="text-left px-6 py-4">Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-gray-500 dark:text-gray-300">
                                                No patients found
                                            </td>
                                        </tr>
                                    ) : (
                                        patients.map((patient) => (
                                            <tr key={patient._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{patient.name}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{patient.email}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{patient.phone}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Appointments Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                            <h2 className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">
                                Appointments
                            </h2>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                                    <tr>
                                        <th className="text-left px-6 py-4">Patient</th>
                                        <th className="text-left px-6 py-4">Doctor</th>
                                        <th className="text-left px-6 py-4">Date</th>
                                        <th className="text-left px-6 py-4">Time Slot</th>
                                        <th className="text-left px-6 py-4">Reason</th>
                                        <th className="text-left px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-300">
                                                No appointments found
                                            </td>
                                        </tr>
                                    ) : (
                                        appointments.map((appt) => (
                                            <tr key={appt._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{appt.patient.name}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{appt.doctor.name}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{appt.timeSlot}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{appt.reason || "-"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                                        ${appt.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                                            : appt.status === "approved"
                                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                                                : appt.status === "completed"
                                                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                                        }`}>
                                                        {appt.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            <Footer></Footer>
        </div>
    );
}
