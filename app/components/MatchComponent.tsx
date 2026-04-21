"use client";

import React, { useState } from "react";
import { MatchType } from "@/types/match";
import Link from "next/link";
import { useAuth, UserRole } from "@/app/context/AuthContext";

interface MatchComponentProps {
  match: MatchType & { _id?: string };
}

export const MatchComponent = ({ match }: MatchComponentProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { role } = useAuth();
  const matchId = (match as any)._id?.toString() || "";

  return (
    <div
      className="w-64 min-w-64 h-fit p-3 bg-white rounded-lg flex flex-col hover:cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition relative"
      onClick={() => setShowDropdown(!showDropdown)}>
      <h1 className="font-semibold">
        {`${match.teamOneName}`} <span className="text-sm font-medium">vs</span>{" "}
        {`${match.teamTwoName}`}
      </h1>
      <h2 className="text-sm text-gray-600">
        {match.date instanceof Date
          ? match.date.toDateString()
          : new Date(match.date).toDateString()}
        , {match.league}
      </h2>
      <h2 className="text-sm text-gray-600">
        {`${match.sport}, ${match.division}`}
      </h2>
      {showDropdown && (
        <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[160px]">
          <Link
            href={`/edit-results/${matchId}`}
            onClick={(e) => e.stopPropagation()}
            className="block px-4 py-2 text-sm hover:bg-blue-50 border-b"
          >
            Edit Results
          </Link>
          {role === UserRole.ADMIN && (
            <Link
              href={`/edit-properties/${matchId}`}
              onClick={(e) => e.stopPropagation()}
              className="block px-4 py-2 text-sm hover:bg-blue-50"
            >
              Edit Properties
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
