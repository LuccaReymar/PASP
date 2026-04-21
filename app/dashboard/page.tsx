"use client";

import { Division, League, MatchType } from "@/types/match";
import { MatchComponent } from "@/app/components/MatchComponent";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, UserRole } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [matches, setMatches] = useState<(MatchType & { _id?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    fetchMatches();
  }, [isLoggedIn, router]);

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/matches");
      const data = await response.json();
      if (data.success) {
        setMatches(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeMatches = () => {
    const now = new Date();

    const upcoming = matches
      .filter((match) => {
        const matchDate = new Date(match.date);
        return matchDate > now && !match.completed;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const needsAction = matches
      .filter((match) => {
        const matchDate = new Date(match.date);
        return matchDate <= now && !match.completed;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const completed = matches
      .filter((match) => match.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcoming, needsAction, completed };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  const { upcoming, needsAction, completed } = categorizeMatches();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your matches
            </p>
          </div>
          {role === UserRole.ADMIN && (
            <Link
              href="/create-match"
              className="px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-bold shadow-md hover:shadow-lg">
              + Create Match
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upcoming Matches */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-blue-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Matches
            </h2>
            <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {upcoming.length}
            </span>
          </div>
          <div className="flex flex-row gap-4 w-full p-6 rounded-lg bg-white border border-gray-200 shadow-sm overflow-x-auto flex-nowrap">
            {upcoming.length > 0 ? (
              upcoming.map((match, index) => (
                <MatchComponent key={index} match={match} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8 w-full">
                No upcoming matches
              </div>
            )}
          </div>
        </div>

        {/* Matches Needing Action */}
        {needsAction.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-red-600 rounded"></div>
              <h2 className="text-2xl font-bold text-gray-900">Needs Action</h2>
              <span className="ml-auto px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                {needsAction.length}
              </span>
            </div>
            <div className="flex flex-row gap-4 w-full p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm overflow-x-auto flex-nowrap">
              {needsAction.map((match, index) => (
                <MatchComponent key={index} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Matches */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-green-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-900">Completed</h2>
            <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              {completed.length}
            </span>
          </div>
          <div className="flex flex-row gap-4 w-full p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm overflow-x-auto flex-nowrap">
            {completed.length > 0 ? (
              completed.map((match, index) => (
                <MatchComponent key={index} match={match} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8 w-full">
                No completed matches
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
