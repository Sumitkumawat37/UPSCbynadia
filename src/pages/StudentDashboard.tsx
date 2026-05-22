import { useMemo, useEffect, useState } from "react";
import { useCourses, useQuizAttempts, useLectures } from "@/lib/supabase-data";
import { usePurchase } from "@/lib/purchase-context";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { BookOpen, Trophy, Video, CheckCircle, TrendingUp, ChevronRight, Flame, Target, Star, AlertTriangle } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPurchased } = usePurchase();
  const { data: courses = [] } = useCourses();
  const { data: lectures = [] } = useLectures();
  const { data: attempts = [] } = useQuizAttempts();

  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/v1/upsc/analytics?userId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);

  const completedLectures = stats?.completedLectures || 0;
  const totalLectures = lectures.length;
  const lecturePercent = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  const avgQuizScore = stats?.avgAccuracy || 0;

  const purchasedCourses = courses.filter((c) => hasPurchased(c.id));

  const chartData = attempts.slice(0, 6).reverse().map((a, i) => ({
    quiz: `Q${i + 1}`,
    score: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
  }));

  const statCards = [
    { icon: BookOpen,     label: "Courses",      value: purchasedCourses.length.toString(), grad: "from-sky-400 to-cyan-500",     delay: 0 },
    { icon: Trophy,       label: "Avg Score",    value: `${avgQuizScore}%`,                 grad: "from-emerald-400 to-teal-500",delay: 70 },
    { icon: Video,        label: "Lectures",     value: `${completedLectures}/${totalLectures}`, grad: "from-violet-400 to-purple-500", delay: 140 },
    { icon: CheckCircle,  label: "Quizzes",      value: (stats?.totalQuizzes || attempts.length).toString(), grad: "from-amber-400 to-orange-500",delay: 210 },
  ];

  const barColors = ["#0ea5e9", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"];

  // Streak
  const streakDays = stats?.studyStreak || 0;

  // XP system
  const totalXP = completedLectures * 50 + (stats?.totalQuizzes || attempts.length) * 100;
  const xpLevel = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const xpPercent = Math.round((xpInLevel / 500) * 100);

  const levelNames = ["Beginner", "Aspirant", "Seeker", "Scholar", "Expert", "Champion", "Master"];
  const levelName = levelNames[Math.min(xpLevel - 1, levelNames.length - 1)];

  // Daily goal
  const dailyGoalTarget = 3;
  const dailyGoalDone = Math.min(completedLectures % dailyGoalTarget || (completedLectures > 0 ? dailyGoalTarget : 0), dailyGoalTarget);
  const dailyGoalPercent = Math.round((dailyGoalDone / dailyGoalTarget) * 100);

  return (
    <div className="space-y-6 animate-slide-up">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-4 shadow-lg shadow-sky-300/20">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full animate-float" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 animate-float-slow">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">My Dashboard</h2>
            <p className="text-white/70 text-[10px]">Track your UPSC prep progress</p>
          </div>
        </div>
      </div>

      {/* ── STREAK + XP ROW ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-50 text-center card-interactive">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-2 shadow-md">
            <Flame className="w-6 h-6 text-white streak-fire" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{streakDays}</p>
          <p className="text-[10px] text-slate-400 font-semibold">Day Streak</p>
          <div className="flex items-center justify-center gap-1 mt-1.5">
            {[...Array(Math.min(streakDays, 7))].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 animate-pop-in" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
            {streakDays === 0 && <p className="text-[9px] text-slate-300">Start today!</p>}
          </div>
        </div>

        {/* XP / Level card */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-50 card-interactive">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md level-badge">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-slate-800">Lv.{xpLevel}</p>
              <p className="text-[9px] text-amber-500 font-bold">{levelName}</p>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 xp-bar-fill"
              style={{ "--xp-pct": `${xpPercent}%` } as React.CSSProperties}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-[9px] text-slate-400">{xpInLevel} XP</p>
            <p className="text-[9px] text-slate-400">500 XP</p>
          </div>
        </div>
      </div>

      {/* ── DAILY GOAL ── */}
      <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">Daily Goal</p>
              <p className="text-[10px] text-slate-400">Complete {dailyGoalTarget} lectures today</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-extrabold text-violet-600">{dailyGoalDone}/{dailyGoalTarget}</p>
          </div>
        </div>
        <div className="w-full h-2.5 bg-violet-50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all duration-1000 ease-out"
            style={{ width: `${dailyGoalPercent}%` }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          {[...Array(dailyGoalTarget)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-xl py-1.5 text-center text-[9px] font-bold ${
                i < dailyGoalDone
                  ? "bg-violet-100 text-violet-600 border border-violet-200"
                  : "bg-slate-50 text-slate-300 border border-slate-100"
              }`}
            >
              {i < dailyGoalDone ? (
                <span className="flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" /> Done</span>
              ) : (
                `Lecture ${i + 1}`
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-3xl p-4 shadow-md border border-slate-50 text-center animate-slide-up card-interactive group-item"
            style={{ animationDelay: `${stat.delay}ms` }}
          >
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.grad} flex items-center justify-center mx-auto mb-2 shadow-md hover-scale`}>
              <stat.icon className="w-5 h-5 text-white bounce-on-hover" />
            </div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── PROGRESS + CHART (side-by-side on desktop) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-800">Lecture Progress</h3>
            <span className="text-sm font-bold text-primary">{lecturePercent}%</span>
          </div>
          <div className="relative">
            <div className="w-full h-2.5 bg-sky-50 rounded-full overflow-hidden">
              <div
                className="h-full gradient-hero rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${lecturePercent}%` }}
              >
                <div className="absolute inset-0 shimmer-bg opacity-50" />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{completedLectures} of {totalLectures} lectures completed</p>
        </div>

        {chartData.length > 0 ? (
          <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-50">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="quiz" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'white', border: 'none', borderRadius: '1rem', boxShadow: '0 8px 24px -4px rgba(14,165,233,0.15)', fontSize: 12 }}
                  cursor={{ fill: 'rgba(14,165,233,0.05)' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <div />}
      </div>

      {/* ── ENROLLED COURSES ── */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-slate-800">Enrolled Courses</h3>
          <button onClick={() => navigate("/courses")} className="text-primary text-xs font-semibold flex items-center gap-1 link-underline hover:gap-2 transition-all">
            Browse more <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger">
          {purchasedCourses.map((course, i) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-3.5 cursor-pointer shadow-sm border border-slate-50 flex items-center gap-3 animate-slide-up card-interactive"
              style={{ animationDelay: `${i * 70}ms` }}
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className="w-11 h-11 rounded-2xl gradient-hero flex items-center justify-center text-2xl shadow-md shrink-0 animate-float-slow">
                {course.thumbnail_emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800 truncate">{course.title}</h4>
                <p className="text-slate-400 text-xs">{course.category}</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </div>
          ))}
          {purchasedCourses.length === 0 && (
            <div
              className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-50 cursor-pointer card-interactive"
              onClick={() => navigate("/courses")}
            >
              <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-3 animate-float-slow">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No enrolled courses yet</p>
              <p className="text-primary text-xs font-bold mt-1">Browse courses →</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
