"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import http from "@/services/http";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const res = await http.post("/auth/register", {
    //   firstname: form.firstname,
    //   lastname: form.lastname,
    //   email: form.email,
    //   password: form.password,

    // });



    if (!form.firstname || !form.lastname || !form.email || !form.password) {
      alert("All fields are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const exists = users.find(
      (u) => u.email.toLowerCase() === form.email.toLowerCase()
    );

    if (exists) {
      alert("User already exists! Please login.");
      return;
    }

    const newUser = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-10 w-96 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          />

          <input
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3"
          />

          {/* FIXED ROLES */}
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
            Signup
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
