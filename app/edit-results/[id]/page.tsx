"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Forfeit, MatchType } from "@/types/match";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function EditResults() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const matchId = params.id as string;

  const [match, setMatch] = useState<(MatchType & { _id?: string }) | null>(
    null,
  );
  const [forfeit, setForfeit] = useState<Forfeit | undefined>(Forfeit.NONE);
  const [teamOneScore, setTeamOneScore] = useState<number | undefined>();
  const [teamTwoScore, setTeamTwoScore] = useState<number | undefined>();
  const [teamOneEmail, setTeamOneEmail] = useState("");
  const [teamTwoEmail, setTeamTwoEmail] = useState("");
  const [teamOneDate, setTeamOneDate] = useState("");
  const [teamTwoDate, setTeamTwoDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    fetchMatch();
  }, [isLoggedIn, router, matchId]);

  const fetchMatch = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}`);
      const data = await response.json();
      if (data.success) {
        const matchData = data.data;
        setMatch(matchData);
        setForfeit(matchData.forfeit || Forfeit.NONE);
        setTeamOneScore(matchData.teamOneScore);
        setTeamTwoScore(matchData.teamTwoScore);
        setTeamOneEmail(matchData.teamOneEmailRecipient || "");
        setTeamTwoEmail(matchData.teamTwoEmailRecipient || "");
        setTeamOneDate(
          matchData.teamOneEmailDate
            ? new Date(matchData.teamOneEmailDate).toISOString().slice(0, 16)
            : "",
        );
        setTeamTwoDate(
          matchData.teamTwoEmailDate
            ? new Date(matchData.teamTwoEmailDate).toISOString().slice(0, 16)
            : "",
        );
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

    const updateData: Partial<MatchType> = {
      forfeit: forfeit,
      completed: false,
    };

    if (forfeit === Forfeit.NONE) {
      updateData.teamOneScore = teamOneScore;
      updateData.teamTwoScore = teamTwoScore;
      updateData.completed =
        teamOneScore !== undefined && teamTwoScore !== undefined;
    } else if (forfeit === Forfeit.TEAMONE || forfeit === Forfeit.TEAMTWO) {
      if (teamOneEmail && teamOneDate) {
        updateData.teamOneEmailRecipient = teamOneEmail;
        updateData.teamOneEmailDate = new Date(teamOneDate);
      }
      if (teamTwoEmail && teamTwoDate) {
        updateData.teamTwoEmailRecipient = teamTwoEmail;
        updateData.teamTwoEmailDate = new Date(teamTwoDate);
      }
      updateData.completed = true;
    } else if (forfeit === Forfeit.BOTH) {
      if (teamOneEmail && teamOneDate && teamTwoEmail && teamTwoDate) {
        updateData.teamOneEmailRecipient = teamOneEmail;
        updateData.teamOneEmailDate = new Date(teamOneDate);
        updateData.teamTwoEmailRecipient = teamTwoEmail;
        updateData.teamTwoEmailDate = new Date(teamTwoDate);
        updateData.completed = true;
      }
    }

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Edit Match Results
            </h1>
            <p className="text-blue-100">
              {match.teamOneName} vs {match.teamTwoName}
            </p>
            <p className="text-blue-100 text-sm">
              {match.date instanceof Date
                ? match.date.toDateString()
                : new Date(match.date).toDateString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Forfeit Type
              </label>
              <select
                value={forfeit}
                onChange={(e) => setForfeit(Number(e.target.value) as Forfeit)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition">
                <option value={Forfeit.NONE}>No Forfeit</option>
                <option value={Forfeit.TEAMONE}>
                  {match.teamOneName} Forfeited
                </option>
                <option value={Forfeit.TEAMTWO}>
                  {match.teamTwoName} Forfeited
                </option>
                <option value={Forfeit.BOTH}>Both Teams Forfeited</option>
              </select>
            </div>

            {forfeit === Forfeit.NONE && (
              <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-6 text-lg">
                  Match Scores
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {match.teamOneName} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={teamOneScore ?? ""}
                      onChange={(e) =>
                        setTeamOneScore(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {match.teamTwoName} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={teamTwoScore ?? ""}
                      onChange={(e) =>
                        setTeamTwoScore(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {(forfeit === Forfeit.TEAMONE || forfeit === Forfeit.BOTH) && (
              <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-6 text-lg">
                  {match.teamOneName} Buyback Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={teamOneEmail}
                      onChange={(e) => setTeamOneEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                      placeholder="team@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Buyback Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={teamOneDate}
                      onChange={(e) => setTeamOneDate(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {(forfeit === Forfeit.TEAMTWO || forfeit === Forfeit.BOTH) && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-6 text-lg">
                  {match.teamTwoName} Buyback Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={teamTwoEmail}
                      onChange={(e) => setTeamTwoEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                      placeholder="team@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Buyback Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={teamTwoDate}
                      onChange={(e) => setTeamTwoDate(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-8 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Saving..." : "Save Results"}
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
