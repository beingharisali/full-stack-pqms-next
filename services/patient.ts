import http from "./http";
import { patient } from "@/types/patient";

// get all patient??
export async function getAllDoctors(): Promise<patient[]> {
    const res = await http.get("/patients");
    return res.data;
}

// get by one 
export async function getDoctorById(id: string): Promise<patient> {
    const res = await http.get(`/patients/${id}`);
    return res.data;
}

//paiett create
export async function createpatient(
    name: string,
    age: string,
    history: string
): Promise<patient> {
    const res = await http.post("/patients", { name, age, history });
    return res.data;
}

// paitent update
export async function updateDoctor(
    id: string,
    data: Partial<{ name: string; age: string; history: string; }>
): Promise<patient> {
    const res = await http.put(`/patients/${id}`, data);
    return res.data;
}

export async function deleteDoctor(id: string): Promise<void> {
    await http.delete(`/patients/${id}`);
}
