import http from "./http";
import { Doctor, Availability } from "../types/doctor";

// get all docotrs??
export async function getAllDoctors(): Promise<Doctor[]> {
    const res = await http.get("/doctors");
    return res.data;
}

// singl doctor get
export async function getDoctorById(id: string): Promise<Doctor> {
    const res = await http.get(`/doctors/${id}`);
    return res.data;
}

// doctor created?
export async function createDoctor(
    name: string,
    specialization: string,
    availability: Availability
): Promise<Doctor> {
    const res = await http.post("/doctor", { name, specialization, availability });
    return res.data;
}

// update doctor?\/
export async function updateDoctor(
    id: string,
    data: Partial<{ name: string; specialization: string; availability: Availability }>
): Promise<Doctor> {
    const res = await http.put(`/doctor/${id}`, data);
    return res.data;
}

export async function deleteDoctor(id: string): Promise<void> {
    await http.delete(`/doctor/${id}`);
}
