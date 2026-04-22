"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const LoginComponent = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
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
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-lg border border-blue-500 bg-blue-500 text-white py-2 font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Logging in..." : "Submit"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:text-blue-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
