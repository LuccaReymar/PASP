"use client";

import { useEffect, useState } from "react";
import { Division, League, MatchType } from "@/types/match";
import { MatchComponent } from "@/app/components/MatchComponent";
import Link from "next/link";

export default function SearchMatches() {
  const [matches, setMatches] = useState<(MatchType & { _id?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [league, setLeague] = useState<League | "">("");
  const [division, setDivision] = useState<Division | "">("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/matches");
      const data = await response.json();
      if (data.success) {
        setMatches(data.data || []);
      } else {
        setError("Failed to fetch matches");
      }
    } catch (err) {
      setError("Failed to fetch matches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) => {
    const teamMatch =
      match.teamOneName.toLowerCase().includes(teamName.toLowerCase()) ||
      match.teamTwoName.toLowerCase().includes(teamName.toLowerCase());
    const sportMatch = match.sport.toLowerCase().includes(sport.toLowerCase());
    const locationMatch = match.location
      .toLowerCase()
      .includes(location.toLowerCase());
    const leagueMatch = league === "" || match.league === league;
    const divisionMatch = division === "" || match.division === division;

    return (
      teamMatch && sportMatch && locationMatch && leagueMatch && divisionMatch
    );
  });

  const handleReset = () => {
    setTeamName("");
    setSport("");
    setLocation("");
    setLeague("");
    setDivision("");
  };

  if (loading) return <div className="p-4 text-center">Loading matches...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Search Matches
          </h1>
          <p className="text-gray-600">
            Filter matches by any property to find what you're looking for
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Search..."
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sport
              </label>
              <input
                type="text"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                placeholder="Search..."
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search..."
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                League
              </label>
              <select
                value={league}
                onChange={(e) => setLeague(e.target.value as League | "")}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition">
                <option value="">All Leagues</option>
                {Object.values(League).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Division
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as Division | "")}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition">
                <option value="">All Divisions</option>
                {Object.values(Division).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition">
            Reset Filters
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600 font-semibold">
            Found {filteredMatches.length} match
            {filteredMatches.length !== 1 ? "es" : ""}
          </p>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">No matches found</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredMatches.map((match) => (
              <MatchComponent key={(match as any)._id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
