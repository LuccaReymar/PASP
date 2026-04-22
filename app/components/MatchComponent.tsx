"use client";

import React, { useState, useRef, useEffect } from "react";
import { MatchType } from "@/types/match";
import Link from "next/link";
import { useAuth, UserRole } from "@/app/context/AuthContext";

interface MatchComponentProps {
  match: MatchType & { _id?: string };
}

export const MatchComponent = ({ match }: MatchComponentProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<"right" | "left">(
    "right",
  );
  const { role } = useAuth();
  const matchId = (match as any)._id?.toString() || "";
  const componentRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const matchDate =
    match.date instanceof Date ? match.date : new Date(match.date);
  const isUpcoming = matchDate > new Date();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  useEffect(() => {
    if (showDropdown && componentRef.current && dropdownRef.current) {
      const componentRect = componentRef.current.getBoundingClientRect();
      const dropdownWidth = 160;
      const spaceOnRight = window.innerWidth - componentRect.right;

      // If not enough space on right, position on left
      if (spaceOnRight < dropdownWidth + 8) {
        setDropdownPosition("left");
      } else {
        setDropdownPosition("right");
      }
    }
  }, [showDropdown]);

  return (
    <div
      ref={componentRef}
      className="w-80 min-w-80 h-fit p-3 bg-white rounded-lg flex flex-col hover:cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition relative"
      onClick={() => setShowDropdown(!showDropdown)}>
      <h1 className="font-semibold">
        {`${match.teamOneName}`} <span className="text-sm font-medium">vs</span>{" "}
        {`${match.teamTwoName}`}
      </h1>
      <h2 className="text-sm text-blue-600">
        {match.division}
      </h2>
      <h2 className="text-sm text-gray-600">
        {matchDate.toDateString()} @ {match.location}
      </h2>
      <h2 className="text-sm text-gray-600">
        {`${match.league} ${match.sport}`}
      </h2>
      <h2 className="text-sm text-gray-600">
        {`${match.location}`}
      </h2>
      {showDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute top-0 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[160px] ${
            dropdownPosition === "right" ? "left-full ml-2" : "right-full mr-2"
          }`}>
          {!isUpcoming && (
            <Link
              href={`/edit-results/${matchId}`}
              onClick={(e) => e.stopPropagation()}
              className={`block px-4 py-2 text-sm hover:bg-blue-50 ${role === UserRole.ADMIN ? "border-b" : ""}`}>
              Edit Results
            </Link>
          )}
          {isUpcoming && (
            <div className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
              Edit Results
            </div>
          )}
          {role === UserRole.ADMIN && (
            <Link
              href={`/edit-properties/${matchId}`}
              onClick={(e) => e.stopPropagation()}
              className="block px-4 py-2 text-sm hover:bg-blue-50">
              Edit Properties
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
