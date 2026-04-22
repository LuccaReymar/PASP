"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Division, League, MatchType } from "@/types/match";
import { useAuth, UserRole } from "@/app/context/AuthContext";
import Link from "next/link";

// Helper functions for proper date handling
function formatDateForInput(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateFromInput(dateString: string): Date {
  const [datePart, timePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-");
  const [hours, minutes] = timePart ? timePart.split(":") : ["00", "00"];
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
  );
}

export default function EditProperties() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();
  const matchId = params.id as string;

  const [match, setMatch] = useState<(MatchType & { _id?: string }) | null>(
    null,
  );
  const [teamOneName, setTeamOneName] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");
  const [date, setDate] = useState("");
  const [league, setLeague] = useState<League>(League.MEN);
  const [division, setDivision] = useState<Division>(Division.MONDAY_6PM);
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [teamOneEmail, setTeamOneEmail] = useState("");
  const [teamTwoEmail, setTeamTwoEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || role !== UserRole.ADMIN) {
      router.push("/");
      return;
    }
    fetchMatch();
  }, [isLoggedIn, router, role, matchId]);

  const fetchMatch = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}`);
      const data = await response.json();
      if (data.success) {
        const matchData = data.data;
        setMatch(matchData);
        setTeamOneName(matchData.teamOneName);
        setTeamTwoName(matchData.teamTwoName);
        setDate(formatDateForInput(matchData.date).slice(0, 10));
        setLeague(matchData.league);
        setDivision(matchData.division);
        setSport(matchData.sport);
        setLocation(matchData.location);
        setTeamOneEmail(matchData.teamOneEmailRecipient || "");
        setTeamTwoEmail(matchData.teamTwoEmailRecipient || "");
      } else {
        setError("Match not found");
      }
    } catch (err) {
      setError("Failed to fetch match");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!teamOneName || !teamTwoName || !date || !sport || !location) {
      setError("All fields are required");
      setSubmitting(false);
      return;
    }

    const updateData: Partial<MatchType> = {
      teamOneName,
      teamTwoName,
      date: parseDateFromInput(date),
      league,
      division,
      sport,
      location,
      teamOneEmailRecipient: teamOneEmail || undefined,
      teamTwoEmailRecipient: teamTwoEmail || undefined,
    };

    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError("Failed to update match");
      }
    } catch (err) {
      setError("Failed to update match");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!match) return <div className="p-4 text-red-500">Match not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Edit Match Properties
            </h1>
            <p className="text-purple-100">Admin Only</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Team 1 Name *
                  </label>
                  <input
                    type="text"
                    value={teamOneName}
                    onChange={(e) => setTeamOneName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition"
                    placeholder="Team One"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Team 1 Email (optional)
                  </label>
                  <input
                    type="email"
                    value={teamOneEmail}
                    onChange={(e) => setTeamOneEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition"
                    placeholder="team1@example.com"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Team 2 Name *
                  </label>
                  <input
                    type="text"
                    value={teamTwoName}
                    onChange={(e) => setTeamTwoName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition"
                    placeholder="Team Two"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Team 2 Email (optional)
                  </label>
                  <input
                    type="email"
                    value={teamTwoEmail}
                    onChange={(e) => setTeamTwoEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition"
                    placeholder="team2@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Sport *
                </label>
                <input
                  type="text"
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition"
                  placeholder="Soccer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition"
                  placeholder="IM Fields"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  League *
                </label>
                <select
                  value={league}
                  onChange={(e) => setLeague(e.target.value as League)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition">
                  {Object.values(League).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Division *
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value as Division)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition">
                  {Object.values(Division).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-bold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
