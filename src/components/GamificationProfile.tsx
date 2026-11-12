import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  Eye,
  Headphones,
  Mic,
  Award,
  TrendingUp,
} from 'lucide-react';

export const GamificationProfile: React.FC = () => {
  const { stats, wordStates, minedSentences } = useApp();

  const knownWords = Object.values(wordStates).filter((s) => s === 'known').length;
  const learningWords = Object.values(wordStates).filter((s) => s === 'learning').length;
  const totalWords = Object.keys(wordStates).length;

  const totalXP =
    stats.xp_viewing + stats.xp_reading + stats.xp_listening + stats.xp_shadowing;

  // Level calculation: 1 level per 250 XP
  const level = Math.floor(totalXP / 250) + 1;
  const currentLevelXP = totalXP % 250;

  const skills = [
    {
      title: 'ดูคลิป',
      icon: Eye,
      xp: stats.xp_viewing,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-indigo-400',
    },
    {
      title: 'อ่านและคำศัพท์',
      icon: BookOpen,
      xp: stats.xp_reading,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
    },
    {
      title: 'ฟัง',
      icon: Headphones,
      xp: stats.xp_listening,
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-400',
    },
    {
      title: 'พูดตาม',
      icon: Mic,
      xp: stats.xp_shadowing,
      color: 'from-rose-500 to-orange-600',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Profile Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-600/20">
            侍
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>เลเวล {level}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">ความคืบหน้าของฉัน</h1>
          </div>
        </div>

        {/* Level XP Progress */}
        <div className="w-full sm:w-64 space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">เลเวลถัดไป</span>
            <span className="text-indigo-400 font-mono">
              {currentLevelXP} / 250 XP
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300"
              style={{ width: `${(currentLevelXP / 250) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Core Immersion Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Flame className="w-4 h-4 fill-current" />
            <span>เรียนต่อเนื่อง</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {stats.streak_days} <span className="text-sm font-sans font-normal text-slate-500">วัน</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
            <Clock className="w-4 h-4" />
            <span>เวลาดูคลิป</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {Math.floor(stats.total_immersion_minutes)} <span className="text-sm font-sans font-normal text-slate-500">นาที</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>คำที่จำได้</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {knownWords} <span className="text-sm font-sans font-normal text-slate-500">คำ</span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>ประโยคที่เก็บ</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {minedSentences.length} <span className="text-sm font-sans font-normal text-slate-500">ประโยค</span>
          </div>
        </div>
      </div>

      {/* 4 Core Skills Breakdown */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>XP แยกตามทักษะ</span>
          </h3>
          <span className="text-xs font-mono font-bold text-indigo-300">
            รวม {totalXP} XP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill, idx) => {
            const Icon = skill.icon;
            const pct = Math.min(100, Math.round((skill.xp / 1000) * 100));

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${skill.textColor}`} />
                    <span className="text-sm font-medium text-slate-200">
                      {skill.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {skill.xp} XP
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
