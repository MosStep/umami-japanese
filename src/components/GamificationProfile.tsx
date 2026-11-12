import React from 'react';
import { useApp } from '../context/AppContext';
import { DAILY_GOAL_MIN, localDayKey } from '../utils/streak';
import mascotImg from '../assets/mascot-fox.webp';
import { BookOpen, Eye, Headphones, Mic, TrendingUp, Trophy, Lock } from 'lucide-react';

const WEEKDAY_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const XP_PER_LEVEL = 250;

/** The last `n` local days, oldest first. */
const lastDays = (n: number): Date[] => {
  const out: Date[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(d);
  }
  return out;
};

export const GamificationProfile: React.FC = () => {
  const { stats, wordStates, minedSentences, setActiveTab } = useApp();

  const knownWords = Object.values(wordStates).filter((s) => s === 'known').length;
  const learningWords = Object.values(wordStates).filter((s) => s === 'learning').length;
  const totalXP = stats.xp_viewing + stats.xp_reading + stats.xp_listening + stats.xp_shadowing;
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const levelXP = totalXP % XP_PER_LEVEL;
  const minutes = Math.floor(stats.total_immersion_minutes);

  const todayKey = localDayKey(new Date());
  const todayMin = Math.floor(stats.daily_minutes?.[todayKey] ?? 0);
  const todayXP = stats.daily_xp?.[todayKey] ?? 0;
  const goalPct = Math.min(100, Math.round((todayMin / DAILY_GOAL_MIN) * 100));
  const goalDone = todayMin >= DAILY_GOAL_MIN;

  // Days inside the current streak (ending on the last active day) count as active even before per-day data existed.
  const streakDays = new Set<string>();
  if (stats.last_active_day && stats.streak_days > 0) {
    const [y, m, d] = stats.last_active_day.split('-').map(Number);
    for (let i = 0; i < Math.min(stats.streak_days, 7); i++) streakDays.add(localDayKey(new Date(y, m - 1, d - i)));
  }
  const week = lastDays(7).map((d) => {
    const key = localDayKey(d);
    const active = streakDays.has(key) || (stats.daily_minutes?.[key] ?? 0) >= 1 || (stats.daily_xp?.[key] ?? 0) > 0;
    return { key, label: WEEKDAY_TH[d.getDay()], active, today: key === todayKey };
  });

  const mascotLine = goalDone
    ? 'วันนี้ถึงเป้าแล้ว เก่งมาก! พรุ่งนี้มาต่อกันนะ'
    : stats.streak_days > 1
    ? `ต่อเนื่องมา ${stats.streak_days} วันแล้ว ดูอีก ${DAILY_GOAL_MIN - todayMin} นาทีก็ถึงเป้าวันนี้!`
    : `ดูคลิปวันละ ${DAILY_GOAL_MIN} นาที แล้วภาษาญี่ปุ่นจะค่อย ๆ ติดหูเอง`;

  // Milestones: each shows progress toward its target.
  const milestones = [
    { title: 'เรียนต่อเนื่อง 3 วัน', value: stats.streak_days, target: 3, emoji: '🔥' },
    { title: 'เรียนต่อเนื่อง 7 วัน', value: stats.streak_days, target: 7, emoji: '🔥' },
    { title: 'เรียนต่อเนื่อง 30 วัน', value: stats.streak_days, target: 30, emoji: '🏮' },
    { title: 'จำได้ 10 คำ', value: knownWords, target: 10, emoji: '📗' },
    { title: 'จำได้ 100 คำ', value: knownWords, target: 100, emoji: '📚' },
    { title: 'ดูคลิปรวม 60 นาที', value: minutes, target: 60, emoji: '🎬' },
    { title: 'ดูคลิปรวม 10 ชั่วโมง', value: minutes, target: 600, emoji: '🏆' },
    { title: 'เก็บประโยค 10 ประโยค', value: minedSentences.length, target: 10, emoji: '🔖' },
  ];
  const unlocked = milestones.filter((m) => m.value >= m.target).length;

  const skills = [
    { title: 'ดูคลิป', icon: Eye, xp: stats.xp_viewing, color: 'from-blue-500 to-indigo-600', text: 'text-indigo-400' },
    { title: 'อ่านและคำศัพท์', icon: BookOpen, xp: stats.xp_reading, color: 'from-emerald-500 to-teal-600', text: 'text-emerald-400' },
    { title: 'ฟัง', icon: Headphones, xp: stats.xp_listening, color: 'from-purple-500 to-pink-600', text: 'text-purple-400' },
    { title: 'พูดตาม', icon: Mic, xp: stats.xp_shadowing, color: 'from-rose-500 to-orange-600', text: 'text-rose-400' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
      {/* Mascot + level */}
      <section className="rounded-3xl bg-gradient-to-br from-[#2b3a63] to-slate-900 border border-slate-800 p-4 flex items-center gap-4">
        <img src={mascotImg} alt="" className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm text-slate-200 leading-snug">{mascotLine}</p>
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="font-bold text-white">เลเวล {level}</span>
              <span className="font-mono">
                {levelXP}/{XP_PER_LEVEL} XP
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-rose-400" style={{ width: `${(levelXP / XP_PER_LEVEL) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Today + streak week */}
      <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-4">
        <div className="flex items-center gap-4">
          {/* Goal ring */}
          <div
            className="relative w-20 h-20 shrink-0 rounded-full grid place-items-center"
            style={{ background: `conic-gradient(#f59e0b ${goalPct * 3.6}deg, #1e293b 0deg)` }}
            role="progressbar"
            aria-valuenow={goalPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="เป้าดูคลิปวันนี้"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 grid place-items-center text-center">
              <span className="text-lg font-bold text-white leading-none">
                {Math.min(todayMin, DAILY_GOAL_MIN)}
                <span className="block text-[11px] font-normal text-slate-400">/{DAILY_GOAL_MIN} นาที</span>
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white">{goalDone ? 'ถึงเป้าวันนี้แล้ว 🎉' : 'เป้าวันนี้'}</p>
            <p className="text-sm text-slate-400">วันนี้ได้ {todayXP} XP</p>
            {!goalDone && (
              <button
                onClick={() => setActiveTab('feed')}
                className="mt-2 min-h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold"
              >
                ไปดูคลิป
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-200">🔥 เรียนต่อเนื่อง {stats.streak_days} วัน</p>
            <p className="text-xs text-slate-500">7 วันล่าสุด</p>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {week.map((d) => (
              <div key={d.key} className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full grid place-items-center text-base ${
                    d.active ? 'bg-amber-500/20 border border-amber-400/60' : 'bg-slate-800 border border-slate-700'
                  } ${d.today ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                  aria-label={`${d.label} ${d.active ? 'เรียนแล้ว' : 'ยังไม่ได้เรียน'}`}
                >
                  {d.active ? '🔥' : ''}
                </div>
                <span className={`text-[11px] ${d.today ? 'text-indigo-300 font-bold' : 'text-slate-500'}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Totals */}
      <section className="grid grid-cols-2 gap-3">
        {[
          { label: 'คำที่จำได้', value: knownWords, unit: 'คำ', sub: `กำลังเรียน ${learningWords}` },
          { label: 'เวลาดูคลิป', value: minutes, unit: 'นาที', sub: `${(minutes / 60).toFixed(1)} ชั่วโมง` },
          { label: 'ประโยคที่เก็บ', value: minedSentences.length, unit: 'ประโยค', sub: 'ฝึกได้ที่หน้า ฝึก' },
          { label: 'XP ทั้งหมด', value: totalXP, unit: 'XP', sub: `เลเวล ${level}` },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
            <p className="text-xs text-slate-400">{c.label}</p>
            <p className="text-2xl font-bold text-white">
              {c.value} <span className="text-sm font-normal text-slate-500">{c.unit}</span>
            </p>
            <p className="text-xs text-slate-500">{c.sub}</p>
          </div>
        ))}
      </section>

      {/* Milestones */}
      <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" /> เหรียญรางวัล
          </h2>
          <span className="text-xs text-slate-400">
            ได้แล้ว {unlocked}/{milestones.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {milestones.map((m) => {
            const done = m.value >= m.target;
            return (
              <div
                key={m.title}
                className={`flex items-center gap-3 p-3 rounded-2xl border ${done ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-950 border-slate-800'}`}
              >
                <span className={`text-2xl ${done ? '' : 'grayscale opacity-40'}`} aria-hidden="true">
                  {m.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${done ? 'text-amber-200' : 'text-slate-300'}`}>{m.title}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%` }} />
                  </div>
                </div>
                {done ? (
                  <span className="text-xs font-bold text-amber-300">ได้แล้ว</span>
                ) : (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {Math.min(m.value, m.target)}/{m.target}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* XP by skill */}
      <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" /> XP แยกตามทักษะ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.title} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-200">
                    <Icon className={`w-4 h-4 ${skill.text}`} /> {skill.title}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{skill.xp} XP</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${skill.color}`} style={{ width: `${Math.min(100, (skill.xp / 1000) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
