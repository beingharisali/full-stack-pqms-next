"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/auth.api";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstname || !form.lastname || !form.email || !form.password) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await register(
        form.firstname,
        form.lastname,
        form.email,
        form.password,
        form.role
      );
      
      setAuth(response.user, response.token);
      
      alert("Signup successful!");
      router.push("/admin");
    } catch (error) {
      alert(error.response?.data?.msg || "Signup failed!");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="bg-cyan-400 text-black rounded-lg p-3 font-semibold hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Signup"}
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
