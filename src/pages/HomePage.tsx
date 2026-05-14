import { useState } from "react";
import { Play, FileText, Trophy, Bell, BookOpen, TrendingUp, Star, Video, Users, Zap, Target, Award, ChevronRight, Quote, GraduationCap, CheckCircle, Clock, Shield, ChevronDown, Medal, MapPin, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { usePurchase } from "@/lib/purchase-context";
import { useCourses, useAnnouncements, useLiveClasses } from "@/lib/supabase-data";
import teacherBanner from "@/assets/teacher-banner.jpg";

const reviews = [
  { name: "Priya Sharma", rank: "AIR 287", year: "UPSC 2024", location: "Delhi", text: "Nadiya Ma'am's structured approach cleared every concept. From polity to GS-2, I aced it all. Highly recommend!", rating: 5 },
  { name: "Rahul Verma", rank: "AIR 412", year: "UPSC 2023", location: "Mumbai", text: "Best mentor I've found online. Doubt replies are super fast and live classes are genuinely gold.", rating: 5 },
  { name: "Ananya Singh", rank: "Mains Qualified", year: "UPSC 2024", location: "Bengaluru", text: "The notes + quiz combo is brilliant. Cracked prelims on first attempt. No coaching centre needed!", rating: 5 },
  { name: "Mohammed Aslam", rank: "AIR 189", year: "UPSC 2024", location: "Hyderabad", text: "Affordable, structured, and the live tests kept me on track. Cleared with AIR 189. Life-changing!", rating: 5 },
];

const programs = [
  { icon: Video,    label: "Live Classes",  desc: "Daily 2–3 hr sessions with Nadiya Ma'am",  grad: "from-sky-400 to-cyan-500",    path: "/live-classes", badge: "Most Popular" },
  { icon: BookOpen, label: "Video Courses", desc: "Self-paced recorded lectures, rewatch anytime", grad: "from-violet-400 to-purple-500", path: "/courses", badge: null },
  { icon: FileText, label: "Study Notes",   desc: "Curated notes, PYQs & PDF downloads",       grad: "from-emerald-400 to-teal-500", path: "/notes",        badge: "500+ Notes" },
  { icon: Trophy,   label: "Mock Quizzes",  desc: "Weekly tests, auto-evaluated with analytics", grad: "from-amber-400 to-orange-500", path: "/quizzes",      badge: "200+ Tests" },
];

const faqs = [
  { q: "What is included in the Live Classes batch?", a: "Each batch includes 150+ live interactive classes, doubt sessions, current affairs coverage, full notes PDFs, and weekly mock tests. All sessions are recorded for later revision." },
  { q: "How long will it take to prepare for UPSC with this platform?", a: "Our structured 12-month program is designed to cover the complete UPSC syllabus. Most students see significant improvement within 3–4 months. We also offer crash courses for specific papers." },
  { q: "Can I access the content after the batch ends?", a: "Yes! All recorded lectures and notes remain accessible for 2 years after your batch ends. You can revisit any topic anytime." },
  { q: "Is there any free trial available?", a: "Absolutely! You get 2 free lecture previews in every course. Simply sign up, browse the Course Marketplace, and tap any course to access the free preview lectures." },
  { q: "How is Nadiya Ma'am different from other UPSC mentors?", a: "Nadiya Ma'am combines simplified teaching with personal feedback. With a 92% student satisfaction rate and 45+ students clearing UPSC, her track record speaks for itself. She personally reviews doubts within 24 hours." },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPurchased } = usePurchase();
  const { data: courses = [] } = useCourses();
  const { data: announcements = [] } = useAnnouncements();
  const { data: liveClasses = [] } = useLiveClasses();

  const upcomingLive = liveClasses.filter((c) => c.status === "upcoming");
  const purchasedCourses = courses.filter((c) => hasPurchased(c.id));

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-5">

      {/* ══ HERO — Value Proposition ══ */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-5 shadow-xl shadow-sky-400/30 animate-fade-in">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl animate-blob" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-xl animate-blob-2" />
        <div className="absolute top-6 right-28 w-8 h-8 bg-white/30 rounded-full animate-float" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-8 right-12 w-5 h-5 bg-yellow-300/60 rounded-full animate-float-reverse" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 pr-3">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2.5 animate-slide-in-left">
              <Flame className="w-3 h-3 text-yellow-300" />
              <span className="text-white text-[10px] font-bold tracking-wide">Batch Starting Soon</span>
            </div>

            {/* Main headline */}
            <h1 className="text-white font-extrabold text-[21px] leading-tight mb-1 animate-slide-in-left" style={{ animationDelay: '0.08s', fontFamily: 'Poppins, sans-serif' }}>
              Pass UPSC in<br /><span className="text-yellow-300">12 Months</span> with<br />Live Guidance
            </h1>
            <p className="text-white/75 text-[11px] mb-3.5 leading-relaxed animate-slide-in-left" style={{ animationDelay: '0.16s' }}>
              Hi {user?.name?.split(' ')[0] || 'Aspirant'}! Expert classes + proven study system. 45+ students cleared UPSC. 🎯
            </p>

            {/* CTAs */}
            <div className="flex gap-2 animate-slide-in-left" style={{ animationDelay: '0.24s' }}>
              <button
                onClick={() => navigate('/courses')}
                className="btn-action ripple text-xs font-extrabold px-5 py-2.5 rounded-full urgency-pulse"
              >
                Enroll Now
              </button>
              <button
                onClick={() => navigate('/live-classes')}
                className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-white/30 hover:bg-white/30 transition-all ripple press"
              >
                Free Demo
              </button>
            </div>
          </div>

          {/* Teacher photo + floating chips */}
          <div className="relative shrink-0 animate-slide-in-right mt-1">
            <div className="w-[86px] h-[86px] rounded-full overflow-hidden border-4 border-white/50 shadow-2xl animate-float-slow">
              <img src={teacherBanner} alt="Nadiya Ma'am" className="w-full h-full object-cover object-top scale-110" />
            </div>
            <div className="absolute -bottom-1 -left-10 glass rounded-2xl px-2.5 py-1 shadow-lg flex items-center gap-1 animate-float" style={{ animationDelay: '0.6s' }}>
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-bold text-slate-700">4.9★</span>
            </div>
            <div className="absolute -top-2 -left-12 glass rounded-2xl px-2.5 py-1 shadow-lg flex items-center gap-1 animate-float" style={{ animationDelay: '1.1s' }}>
              <Users className="w-3 h-3 text-sky-500" />
              <span className="text-[10px] font-bold text-slate-700">2,500+</span>
            </div>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="flex gap-2 mt-4 relative z-10 animate-slide-in-left" style={{ animationDelay: '0.32s' }}>
          {[
            { icon: Shield, label: "45+ Cleared UPSC" },
            { icon: CheckCircle, label: "92% Completion" },
            { icon: Clock, label: "24hr Doubt Reply" },
          ].map((b) => (
            <div key={b.label} className="trust-badge flex items-center gap-1.5 px-2.5 py-1.5 hover-scale-sm">
              <b.icon className="w-3 h-3 text-white shrink-0" />
              <span className="text-white text-[9px] font-semibold whitespace-nowrap">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ OUR PROGRAMS ══ */}
      <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Our Programs</h2>
            <p className="text-slate-400 text-[10px]">Choose your path to UPSC success</p>
          </div>
          <button onClick={() => navigate('/courses')} className="text-primary text-xs font-bold link-underline">
            All Courses →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {programs.map((item, i) => (
            <div
              key={item.label}
              className="bg-white rounded-3xl p-4 cursor-pointer shadow-md border border-slate-50 animate-slide-up card-interactive group-item tilt-hover relative overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => navigate(item.path)}
            >
              {item.badge && (
                <div className="absolute top-2.5 right-2.5 gradient-action text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pop-in">
                  {item.badge}
                </div>
              )}
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.grad} flex items-center justify-center shadow-md mb-3 hover-scale`}>
                <item.icon className="w-5 h-5 text-white bounce-on-hover" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">{item.label}</h4>
              <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ ANIMATED STATS BAR ══ */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
        {[
          { icon: Users,   value: "2,500+", label: "Students",     grad: "from-sky-400 to-cyan-500" },
          { icon: Trophy,  value: "45+",    label: "Selections",   grad: "from-amber-400 to-orange-500" },
          { icon: Star,    value: "4.9★",  label: "Rating",       grad: "from-violet-400 to-purple-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-3 text-center shadow-md border border-slate-50 stat-counter animate-count-up"
          >
            <p className={`text-lg font-extrabold bg-gradient-to-br ${s.grad} bg-clip-text text-transparent`}>{s.value}</p>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ══ ABOUT INSTRUCTOR ══ */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-50 animate-slide-up overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-sky-50 blob pointer-events-none opacity-60" />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-100 shadow-lg animate-float-slow">
                <img src={teacherBanner} alt="Nadiya Ma'am" className="w-full h-full object-cover object-top scale-110" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-base text-slate-800">Nadiya Ma'am</h3>
                <div className="bg-sky-100 text-sky-600 text-[9px] font-bold px-2 py-0.5 rounded-full">Verified</div>
              </div>
              <p className="text-slate-500 text-xs">UPSC CSE Mentor · Polity, History & GS</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                <span className="text-[10px] text-slate-500 ml-1">4.9 · 2,500+ students</span>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger">
            {[
              { icon: GraduationCap, label: "10+ Years Mentoring",    bg: "bg-sky-50",     text: "text-sky-600" },
              { icon: Medal,         label: "45+ UPSC Clearances",    bg: "bg-amber-50",   text: "text-amber-600" },
              { icon: Users,         label: "2,500+ Students",        bg: "bg-violet-50",  text: "text-violet-600" },
              { icon: Award,         label: "92% Success Rate",       bg: "bg-emerald-50", text: "text-emerald-600" },
            ].map((c) => (
              <div key={c.label} className={`flex items-center gap-2 ${c.bg} rounded-xl p-2.5 hover-scale-sm press`}>
                <c.icon className={`w-3.5 h-3.5 ${c.text} shrink-0`} />
                <span className="text-[10px] font-semibold text-slate-700">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Featured in */}
          <div className="mt-3 pt-3 border-t border-slate-50">
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide mb-2">Expertise</p>
            <div className="flex flex-wrap gap-1.5">
              {["Polity", "History", "Geography", "Economics", "Current Affairs", "Essay", "CSAT"].map((tag) => (
                <span key={tag} className="bg-sky-50 text-sky-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-sky-100 hover-scale-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ WHY CHOOSE ══ */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-50 animate-slide-up">
        <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Choose This Platform?</h2>
        <p className="text-slate-400 text-xs mb-4">Simple, effective, proven UPSC prep</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          { [
            { icon: Zap,     title: "Simple & Flexible",    desc: "Learn at your pace · mobile-friendly",          bg: "bg-sky-100",     text: "text-sky-600",     delay: 0 },
            { icon: Target,  title: "Expert-Led Content",   desc: "Polity to GS — crafted by UPSC specialists",    bg: "bg-violet-100",  text: "text-violet-600",  delay: 60 },
            { icon: Shield,  title: "24hr Doubt Support",   desc: "Personal feedback on every query",               bg: "bg-rose-100",    text: "text-rose-600",    delay: 120 },
            { icon: Award,   title: "Proven Track Record",  desc: "45+ UPSC clears · 4.9★ student rating",         bg: "bg-emerald-100", text: "text-emerald-600", delay: 180 },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3 group-item press rounded-xl px-2 py-2 -mx-1 animate-slide-in-left" style={{ animationDelay: `${f.delay}ms` }}>
              <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center shrink-0 hover-scale`}>
                <f.icon className={`w-4 h-4 ${f.text} bounce-on-hover`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800">{f.title}</h4>
                <p className="text-slate-400 text-[10px]">{f.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-200 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ══ ANNOUNCEMENTS ══ */}
      {announcements.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-slate-800">Announcements</h3>
            <button onClick={() => navigate("/notifications")} className="text-primary text-xs font-semibold link-underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {announcements.slice(0, 4).map((a, i) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-3.5 flex items-start gap-3 shadow-sm animate-slide-up card-interactive"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  a.type === "info" ? "bg-sky-100" : a.type === "success" ? "bg-emerald-100" : "bg-amber-100"
                }`}>
                  <Bell className={`w-4 h-4 ${
                    a.type === "info" ? "text-sky-500" : a.type === "success" ? "text-emerald-500" : "text-amber-500"
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-slate-800">{a.title}</h4>
                  <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ STUDENT REVIEWS — infinite auto-scroll carousel ══ */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Success Stories</h2>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
              <span className="text-[10px] font-bold text-slate-500 ml-1">4.9/5 · 500+ Reviews</span>
            </div>
          </div>
        </div>
        {/* Carousel: duplicate the cards so infinite scroll appears seamless */}
        <div className="carousel-wrapper -mx-4">
          <div className="carousel-track px-4 gap-3">
            {[...reviews, ...reviews].map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-4 w-[268px] shrink-0 shadow-md border border-slate-50 card-interactive"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Medal className="w-2.5 h-2.5" />
                    {r.rank}
                  </div>
                  <span className="text-[10px] text-slate-400">{r.year}</span>
                </div>
                <Quote className="w-6 h-6 text-sky-200 mb-1.5" />
                <p className="text-slate-500 text-xs leading-relaxed mb-3">"{r.text}"</p>
                <div className="flex items-center gap-2.5 pt-2.5 border-t border-slate-50">
                  <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                    {r.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700">{r.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-300" />
                      <p className="text-[10px] text-slate-400">{r.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FAQ SECTION ══ */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-50 animate-slide-up">
        <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Frequently Asked Questions</h2>
        <p className="text-slate-400 text-xs mb-4">Everything you need to know before enrolling</p>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openFaq === i ? 'border-sky-200 shadow-sm shadow-sky-100' : 'border-slate-100'
              }`}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 press"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-semibold text-slate-800 leading-snug">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-sky-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                <p className="text-slate-500 text-xs leading-relaxed px-4 pb-3.5">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BOTTOM CTA ══ */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-5 shadow-xl shadow-sky-400/20 animate-slide-up text-center">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full animate-float" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full animate-float-reverse" />
        <div className="relative z-10">
          <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest mb-1">Ready to Start?</p>
          <h2 className="text-white font-extrabold text-xl mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join 2,500+ Students<br />on the Path to IAS
          </h2>
          <p className="text-white/70 text-xs mb-4">First 2 lectures free · Cancel anytime</p>
          <div className="flex gap-2.5 justify-center">
            <button
              onClick={() => navigate('/courses')}
              className="btn-action ripple text-sm font-extrabold px-6 py-3 rounded-full urgency-pulse"
            >
              Enroll Now 🚀
            </button>
            <button
              onClick={() => navigate('/live-classes')}
              className="bg-white/20 text-white text-sm font-semibold px-5 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all press"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* ══ MY RESULTS ══ */}
      <div
        className="bg-white rounded-3xl p-4 cursor-pointer shadow-md border border-slate-50 flex items-center gap-4 animate-slide-up card-interactive ripple neon-glow"
        onClick={() => navigate("/results")}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md shrink-0 animate-float-slow">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-slate-800">My Performance</h4>
          <p className="text-slate-400 text-xs">Track quiz scores & analytics</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center hover-scale">
          <ChevronRight className="w-4 h-4 text-sky-400" />
        </div>
      </div>

    </div>
  );
};

export default HomePage;
