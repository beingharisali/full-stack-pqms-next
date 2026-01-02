import http from "./http";
import { appointment } from "@/types/appointment";

export async function getAllAppointments(): Promise<appointment[]> {
    const res = await http.get("/appointments");
    return res.data.data;
}

export async function getAppointmentById(id: string): Promise<appointment> {
    const res = await http.get(`/appointments/${id}`);
    return res.data.data;
}

export async function createAppointment(
    patient: string,
    doctor: string,
    appointmentDate: Date,
    timeSlot: string,
    reason?: string,
    status?: string
): Promise<appointment> {
    const res = await http.post("/appointments", { 
        patient, 
        doctor, 
        appointmentDate, 
        timeSlot, 
        reason, 
        status 
    });
    return res.data.data;
}

export async function updateAppointment(
    id: string,
    data: Partial<{
        patient: string;
        doctor: string;
        appointmentDate: Date;
        timeSlot: string;
        reason: string;
        status: string;
    }>
): Promise<appointment> {
    const res = await http.put(`/appointments/${id}`, data);
    return res.data.data;
}

export async function deleteAppointment(id: string): Promise<void> {
    await http.delete(`/appointments/${id}`);
}