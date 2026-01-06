import http from "./http";
import { Doctor, Availability } from "../types/doctor";

export async function getAllDoctors(): Promise<Doctor[]> {
    const res = await http.get("/doctors");
    return res.data.data;
}

export async function getDoctorById(id: string): Promise<Doctor> {
    const res = await http.get(`/doctors/${id}`);
    return res.data.data;
}

export async function createDoctor(
    name: string,
    specialization: string,
    availability: string
): Promise<Doctor> {
    const res = await http.post("/doctors", { name, specialization, availability });
    return res.data.data;
}

export async function updateDoctor(
    id: string,
    data: Partial<{ name: string; specialization: string; availability: string }>
): Promise<Doctor> {
    const res = await http.patch(`/doctors/${id}`, data);
    return res.data.data;
}

export async function deleteDoctor(id: string): Promise<void> {
    await http.delete(`/doctors/${id}`);
}