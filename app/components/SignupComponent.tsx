"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth, UserRole } from "@/app/context/AuthContext";
import Link from "next/link";

const SignupComponent = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.PA);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Signup failed");
    }
  };

  return (
    <div className="p-4 flex flex-row justify-center items-center min-h-screen">
      <div className="w-fit h-fit p-6 rounded-xl border border-gray-300 bg-white shadow-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form className="flex flex-col w-64" onSubmit={submitSignup}>
          <label className="text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
          />
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
          />
          <label className="text-sm font-semibold mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={loading}
            className="mt-4 rounded-lg border border-green-500 bg-green-500 text-white py-2 font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-blue-500 hover:text-blue-700 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
