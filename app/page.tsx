"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import http from "@/services/http";

type Role = "admin" | "doctor" | "receptionist";

interface LoginForm {
  email: string;
  password: string;
  role: Role;
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    role: "admin",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // const res = await http.post("/auth/login", {

    //   email: form.email,
    //   password: form.password,
    //   role: form.role
    // });



    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (u: any) => u.email.toLowerCase() === form.email.toLowerCase()
    );

    if (!user) {
      alert("User not found! Please signup first.");
      return;
    }

    if (user.password !== form.password) {
      alert("Incorrect password!");
      return;
    }

    if (user.role !== form.role) {
      alert(`You are not registered as ${form.role}`);
      return;
    }

    alert(`Welcome ${user.firstname}!`);

    if (form.role === "admin") router.push("/admin");
    if (form.role === "doctor") router.push("/doctor");
    if (form.role === "receptionist") router.push("/receptionist");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-10 w-96 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>

          <button
            type="submit"
            className="bg-cyan-400 text-black rounded-lg p-3 font-semibold hover:bg-cyan-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
