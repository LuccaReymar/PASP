"use client";
import React from "react";
import { useAuth, UserRole } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const { isLoggedIn, email, role, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-full px-8 h-fit flex justify-between items-center border-b-2 border-gray-200 font-bold text-lg p-4 bg-white">
      <Link href="/dashboard" className="hover:text-blue-600">
        PA Support Program
      </Link>
      
      <span className="text-sm font-semibold">
        <span
          className={
            (role == UserRole.ADMIN ? `bg-blue-400` : `bg-green-400`) +
            " font-bold p-1 rounded-lg text-white"
          }>
          {role}
        </span>
      </span>
      <div className="flex gap-6">
        <Link
          href="/dashboard"
          className="text-base font-semibold hover:text-blue-600 transition">
          Dashboard
        </Link>
        <Link
          href="/search"
          className="text-base font-semibold hover:text-blue-600 transition">
          Search
        </Link>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-3 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
            Logout
          </button>
        ) : null}
      </div>
      
    </div>
  );
};

export default Navbar;
