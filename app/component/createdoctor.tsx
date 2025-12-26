"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
type Availability = "morning" | "afternoon" | "evening";

interface Doctor {
  name: string;
  specialization: string;
  availability: Availability;
}
interface CreateEditDocterProps {
  id?: string;
}
function Createdoctor({ id }: CreateEditDocterProps) {
  const [doctor, setDoctor] = useState<Doctor>({
    name: "",
    specialization: "",
    availability: "morning",
  });
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!id) return;
    const fetchDocter = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/doctors/${id}`);
        const data = res.data;
        setDoctor({
          name: data.name,
          specialization: data.specialization,
          availability: data.availability,
        });
      } catch (error) {
        console.error("Failed to fetch doctor", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocter();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // await axios.put(`/api/doctors/${id}`, doctor);
        alert("Doctor updated successfully");
      } else {
        // await axios.post("/api/doctors", doctor);
        alert("Doctor created successfully");

        // reset after create
        setDoctor({
          name: "",
          specialization: "",
          availability: "morning",
        });
      }
    } catch (error) {
      console.error("Submit failed", error);
    }
  };
  if (loading) {
    return (
      <div className="text-center py-10 font-semibold">
        Loading doctor data...
      </div>
    );
  }
  return (
    <div className="max-w-xlg mx-auto p-6 bg-white shadow rounded dark:text-black">
      <h2 className="text-2xl font-bold ">
        {isEditMode ? "Edit Docter" : "Create Docter"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          value={doctor.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={doctor.specialization}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="availability"
          onChange={handleChange}
          value={doctor.availability}
          className="w-full px-3 py-3 border rounded"
        >
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="afternoon">Afternoon</option>
        </select>

        <button
          className={`w-full rounded py-2 text-white ${
            isEditMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isEditMode ? "Update Docter" : "Create Docter"}
        </button>
      </form>
    </div>
  );
}

export default Createdoctor;
