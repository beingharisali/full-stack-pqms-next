import http from "./http";
import { appointment } from "@/types/appointment";

// get all patient??
export async function getAllappointment(): Promise<appointment[]> {
    const res = await http.get("/");
    return res.data;
}

// get by one 
export async function getappointmentById(id: string): Promise<appointment> {
    const res = await http.get(`/${id}`);
    return res.data;
}

// appointmenty created
export async function createappointment(
    doctor: string,
    patient: string,
    timeslot: string,
    appointmentdate: Date,
    reason: string,
    status: string
): Promise<appointment> {
    const res = await http.post("/", { doctor, patient, timeslot, appointmentdate, reason, status });
    return res.data;
}

// paitent update
export async function updateappointment(
    id: string,
    data: Partial<{ name: string; age: string; history: string; }>
): Promise<appointment> {
    const res = await http.put(`/${id}`, data);
    return res.data;
}

export async function deleteappointment(id: string): Promise<void> {
    await http.delete(`/${id}`);
}
