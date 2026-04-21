"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth, UserRole } from "@/app/context/AuthContext";

const LoginComponent = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.PA);
  const [error, setError] = useState("");

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // Simple validation - in production, validate against backend
    login(email, password, role);
    router.push("/dashboard");
  };

  return (
    <div className="p-4 flex flex-row justify-center items-center min-h-screen">
      <div className="w-fit h-fit p-6 rounded-xl border border-gray-300 bg-white shadow-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form className="flex flex-col w-64" onSubmit={submitLogin}>
          <label className="text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
          />
          <label className="text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
          />
          <label className="text-sm font-semibold mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500">
            <option value={UserRole.PA}>PA</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            className="mt-4 rounded-lg border border-blue-500 bg-blue-500 text-white py-2 font-semibold hover:bg-blue-600 transition">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
