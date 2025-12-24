export type Availability = "morning" | "afternoon" | "evening";

export interface Doctor {
    _id: string;
    name: string;
    specialization: string;
    availability: Availability;
}
