"use client";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";
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
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-normal">
            {email} ({role})
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
