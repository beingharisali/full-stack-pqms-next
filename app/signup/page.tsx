"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.firstname || !form.lastname || !form.email || !form.password || !form.password) {
      alert("All fields are required!");
      return;
    }

    if (form.password !== form.password) {
      alert("Passwords do not match!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const exists = users.find((u: any) => u.email === form.email);
    if (exists) {
      alert("User already exists! Please login.");
      return;
    }

    const { password, ...userData } = form;
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please login.");
    router.push("/");
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-10 w-96  animate-fade-in text-white ">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="bg-cyan-400 text-black rounded-lg p-3 font-semibold hover:bg-cyan-300 transition transform hover:scale-105"
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
