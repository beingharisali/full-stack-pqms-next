import http from "./http";
import { patient } from "@/types/patient";

export async function getAllPatients(): Promise<patient[]> {
    const res = await http.get("/patients");
    return res.data.data;
}

export async function getPatientById(id: string): Promise<patient> {
    const res = await http.get(`/patients/${id}`);
    return res.data.data;
}

export async function createPatient(
    name: string,
    age: number,
    history: string
): Promise<patient> {
    const res = await http.post("/patients", { name, age, history });
    return res.data.data;
}

export async function updatePatient(
    id: string,
    data: Partial<{ name: string; age: number; history: string; }>
): Promise<patient> {
    const res = await http.patch(`/patients/${id}`, data);
    return res.data.data;
}

export async function deletePatient(id: string): Promise<void> {
    await http.delete(`/patients/${id}`);
}