import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Medal, 
  Award, 
  GraduationCap, 
  TrendingUp, 
  Star,
  Search,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { LeaderboardEntry } from '../types';
import { GlassCard } from '../components/common/GlassCard';

interface LeaderboardPageProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  entries = [],
  currentUserId,
}) => {
  const safeEntries = Array.isArray(entries) ? entries : [];
  const [filterDept, setFilterDept] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filteredEntries = safeEntries.filter((e) => {
    if (!e) return false;
    const matchDept = filterDept === 'All' || e.department === filterDept;
    const matchSearch = (e.userName || '').toLowerCase().includes(search.toLowerCase()) || (e.department || '').toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const top3 = safeEntries.slice(0, 3);
  const departments = ['All', 'Computer Science & Eng', 'Artificial Intelligence & DS', 'Electronics & Comm', 'Mechanical Eng'];

  return (
    <div className="space-y-12 max-w-7xl mx-auto" id="leaderboard-page-container">
      {/* 1. Header Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-pink-100 text-[#DB2777] rounded-full border border-pink-200"
        >
          <Trophy className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>CAMPUS CODER HALL OF FAME</span>
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18131A] font-outfit">
          Leaderboard & Rankings
        </h1>

        <p className="text-xs sm:text-sm text-[#6B6470]">
          Compete in technical quizzes, hackathons, and community sprints to earn XP and unlock campus distinction badges.
        </p>
      </div>

      {/* 2. Top 3 Podium Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6 max-w-4xl mx-auto">
        {/* Rank 2 (Silver) */}
        {top3[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <GlassCard hoverEffect className="p-6 text-center space-y-3 border-purple-200">
              <div className="relative inline-block">
                <img
                  src={top3[1].avatar}
                  alt={top3[1].userName}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-purple-300"
                />
                <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-extrabold flex items-center justify-center shadow-md">
                  2
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#18131A]">{top3[1].userName}</h3>
                <span className="text-[10px] text-[#6B6470]">{top3[1].department}</span>
              </div>
              <div className="p-2.5 bg-[#FFF8FC] rounded-2xl border border-[#F3DCE8]">
                <span className="text-xs font-mono font-extrabold text-[#A855F7] block">
                  {top3[1].points.toLocaleString()} XP
                </span>
                <span className="text-[10px] text-[#6B6470] flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> {top3[1].streak} week streak
                </span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Rank 1 (Gold - Center & Elevated) */}
        {top3[0] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <GlassCard
              intensity="solid"
              hoverEffect
              className="p-8 text-center space-y-4 border-2 border-[#EC4899] shadow-2xl shadow-pink-500/20 relative"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                👑 Campus Champion
              </div>

              <div className="relative inline-block mt-2">
                <img
                  src={top3[0].avatar}
                  alt={top3[0].userName}
                  className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-pink-500 shadow-md"
                />
                <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-[#EC4899] text-white text-xs font-extrabold flex items-center justify-center shadow-lg">
                  1
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#18131A]">{top3[0].userName}</h3>
                <span className="text-xs text-[#6B6470]">{top3[0].department}</span>
              </div>

              <div className="p-3 bg-[#FFF1F7] rounded-2xl border border-pink-200">
                <span className="text-sm font-mono font-extrabold text-[#DB2777] block">
                  {top3[0].points.toLocaleString()} XP
                </span>
                <span className="text-xs text-[#6B6470] flex items-center justify-center gap-1 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-[#EC4899]" /> {top3[0].streak} week streak
                </span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="order-3"
          >
            <GlassCard hoverEffect className="p-6 text-center space-y-3 border-cyan-200">
              <div className="relative inline-block">
                <img
                  src={top3[2].avatar}
                  alt={top3[2].userName}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-cyan-300"
                />
                <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-[#0891B2] text-white text-xs font-extrabold flex items-center justify-center shadow-md">
                  3
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#18131A]">{top3[2].userName}</h3>
                <span className="text-[10px] text-[#6B6470]">{top3[2].department}</span>
              </div>
              <div className="p-2.5 bg-[#FFF8FC] rounded-2xl border border-[#F3DCE8]">
                <span className="text-xs font-mono font-extrabold text-[#0891B2] block">
                  {top3[2].points.toLocaleString()} XP
                </span>
                <span className="text-[10px] text-[#6B6470] flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> {top3[2].streak} week streak
                </span>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>

      {/* 3. Search & Department Filters */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-[#6B6470] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#F3DCE8] rounded-xl focus:outline-none focus:border-[#EC4899]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                filterDept === dept
                  ? 'bg-[#18131A] text-white border-[#18131A]'
                  : 'bg-white text-[#6B6470] border-[#F3DCE8] hover:border-pink-300'
              }`}
            >
              {dept === 'All' ? 'All Departments' : dept.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Complete Rankings Table */}
      <div className="max-w-4xl mx-auto bg-white/90 rounded-3xl border border-[#F3DCE8] p-4 sm:p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#F3DCE8] text-[#6B6470] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3">Student Builder</th>
                <th className="py-3">Department</th>
                <th className="py-3">Badges</th>
                <th className="py-3 text-right px-3">XP Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3DCE8]/60">
              {filteredEntries.map((row) => {
                const isCurrentUser = row.userId === currentUserId;
                return (
                  <tr
                    key={row.userId}
                    className={`hover:bg-[#FFF8FC] transition-colors ${
                      isCurrentUser ? 'bg-[#FFF1F7] font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        row.rank === 1 ? 'bg-amber-100 text-amber-800' :
                        row.rank === 2 ? 'bg-purple-100 text-purple-800' :
                        row.rank === 3 ? 'bg-cyan-100 text-cyan-800' : 'text-[#6B6470]'
                      }`}>
                        #{row.rank}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} alt={row.userName} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-pink-300" />
                        <div>
                          <span className="font-bold text-[#18131A] block">{row.userName}</span>
                          {isCurrentUser && <span className="text-[9px] text-[#EC4899] font-bold">You</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[#6B6470]">{row.department}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {row.badges.map((b, i) => (
                          <span key={i} className="px-2 py-0.5 text-[9px] font-bold bg-[#FFF8FC] text-[#DB2777] rounded-md border border-[#F3DCE8]">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right px-3 font-mono font-bold text-[#EC4899]">
                      {row.points.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
