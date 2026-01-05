export interface appointment {
    _id?: string;
    patient: string;
    doctor: string;
    appointmentDate: Date;
    timeSlot: string;
    reason?: string;
    status: string;
}