import React, { useState } from "react";
import { LeaderboardUser } from "../types";
import { Trophy, Flame, Shield, Medal, Star, Sparkles } from "lucide-react";

interface GamifiedLeaderboardProps {
  streak: number;
  points: number;
  badges: string[];
  userName: string;
  userAvatar: string;
}

export default function GamifiedLeaderboard({ streak, points, badges, userName, userAvatar }: GamifiedLeaderboardProps) {
  // Simulated Community leaderboard database
  const initialLeaderboard: LeaderboardUser[] = [
    { id: "lead-1", name: "Zahra Skardo", avatar: "👩‍🎓", points: 850, streak: 12, rank: 1 },
    { id: "lead-2", name: "Kargil Linguist", avatar: "👨‍🏫", points: 720, streak: 8, rank: 2 },
    { id: "lead-3", name: "Ali Baltistan", avatar: "🏔️", points: 640, streak: 15, rank: 3 },
    { id: "user-current", name: userName || "You (Learner)", avatar: userAvatar || "🎓", points: points, streak: streak, rank: 4, isCurrentUser: true },
    { id: "lead-5", name: "Fatima Purik", avatar: "🌸", points: 310, streak: 5, rank: 5 },
    { id: "lead-6", name: "Hassan Khaplu", avatar: "🛡️", points: 180, streak: 2, rank: 6 }
  ];

  // Dynamic ranking based on current points
  const sortedLeaderboard = [...initialLeaderboard]
    .map(user => user.isCurrentUser ? { ...user, points, streak, name: userName, avatar: userAvatar } : user)
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  // Badges database
  const badgeDatabase = [
    {
      id: "badge-first-steps",
      title: "First Steps",
      description: "Completed your first lesson greetings step.",
      icon: "🚶",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      id: "badge-match-master",
      title: "Vocabulary Master",
      description: "Completed the interactive matching pairs game.",
      icon: "🧠",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      id: "badge-grammar-master",
      title: "Grammar Champion",
      description: "Successfully solved the SOV sentence puzzle builder.",
      icon: "🛡️",
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      id: "badge-dialects",
      title: "Dual Dialect Explorer",
      description: "Practiced both Balti and Purigi translations.",
      icon: "🌎",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn" id="gamification-section">
      {/* Badges and streaks stats (Left column) */}
      <div className="lg:col-span-1 space-y-6">
        {/* Streak and Point summaries */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
            <Trophy className="w-48 h-48 text-white" />
          </div>

          <h3 className="text-md font-bold uppercase tracking-wider text-slate-400">Your Streak & Power</h3>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-amber-500/15 rounded-xl flex items-center justify-center text-amber-400">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight block">{streak} Days</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Streak</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight block">{points} XP</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Linguistic XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earned Badges Checklist */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 font-sans uppercase tracking-wider mb-4">Milestone Badges</h4>
          <div className="space-y-3">
            {badgeDatabase.map((badge) => {
              const isEarned = badges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                    isEarned
                      ? "bg-slate-50 border-slate-200"
                      : "bg-slate-50/40 border-slate-100 opacity-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-xs shrink-0 ${
                    isEarned ? badge.color : "bg-slate-200 text-slate-400 border-slate-200"
                  }`}>
                    {badge.icon}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">{badge.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight">{badge.description}</span>
                  </div>
                  {isEarned && (
                    <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm ml-auto">
                      Earned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards (Right column - span 2) */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight font-sans">Periodic Regional Leaderboard</h3>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Refreshes weekly</span>
        </div>

        <div className="space-y-2.5">
          {sortedLeaderboard.map((user) => {
            const isTop3 = user.rank <= 3;
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  user.isCurrentUser
                    ? "bg-emerald-50/50 border-emerald-200/60 ring-1 ring-emerald-500/10"
                    : "bg-slate-50/60 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank bubble */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    user.rank === 1
                      ? "bg-amber-100 text-amber-700"
                      : user.rank === 2
                      ? "bg-slate-200 text-slate-700"
                      : user.rank === 3
                      ? "bg-amber-50 text-amber-800"
                      : "text-slate-400"
                  }`}>
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <span className="text-xl shrink-0">{user.avatar}</span>

                  <div>
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-sans">
                      {user.name}
                      {user.isCurrentUser && (
                        <span className="text-[9px] uppercase font-bold tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Streak: {user.streak} days
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-800 block font-mono">{user.points} XP</span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
