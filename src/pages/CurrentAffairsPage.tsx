import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileText, Search, Bookmark, BookmarkCheck, Megaphone,
  CheckCircle, ArrowRight, Share2, HelpCircle
} from "lucide-react";

interface CurrentAffair {
  id: string;
  title: string;
  content: string;
  category: string;
  compilation_month: string;
  mcqs: { question: string; options: string[]; correct_index: number }[];
  published_at: string;
}

const CATEGORIES = ["All", "Polity", "Economy", "Environment", "Science & Tech", "International Relations"];

const CurrentAffairsPage = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<CurrentAffair[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  // MCQ state
  const [activeMcqArticle, setActiveMcqArticle] = useState<CurrentAffair | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [checkedMcq, setCheckedMcq] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      let query = supabase.from("current_affairs").select("*");
      if (category !== "All") query = query.eq("category", category);
      if (search.trim()) query = query.ilike("title", `%${search}%`);

      const { data, error } = await query.order("published_at", { ascending: false });
      if (error) throw error;

      setArticles((data || []).map(item => ({
        ...item,
        mcqs: Array.isArray(item.mcqs) ? item.mcqs : JSON.parse(item.mcqs || "[]")
      })));

      if (user) {
        const { data: bData } = await supabase.from("current_affair_bookmarks").select("article_id").eq("user_id", user.id);
        setBookmarks(bData?.map(b => b.article_id) || []);
      }
    } catch {
      toast.error("Failed to load current affairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category, search]);

  const toggleBookmark = async (id: string) => {
    if (!user) return toast.error("Please login to bookmark articles");
    const isBookmarked = bookmarks.includes(id);
    try {
      if (isBookmarked) {
        await supabase.from("current_affair_bookmarks").delete().eq("user_id", user.id).eq("article_id", id);
        setBookmarks(prev => prev.filter(x => x !== id));
        toast.success("Bookmark removed");
      } else {
        await supabase.from("current_affair_bookmarks").insert({ user_id: user.id, article_id: id });
        setBookmarks(prev => [...prev, id]);
        toast.success("Article bookmarked");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const handleStartMcq = (article: CurrentAffair) => {
    setActiveMcqArticle(article);
    setSelectedAnswers({});
    setCheckedMcq(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Title */}
      <div className="bg-[#0D0D0D]/50 border border-[#A855F7]/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center justify-between neon-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] icon-container-glow">
            <FileText className="w-5 h-5 text-white icon-glow-purple" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Current Affairs</h1>
            <p className="text-[#777777] text-sm">Daily analysis, UPSC compilations & practice questions</p>
          </div>
        </div>
      </div>

      {activeMcqArticle ? (
        /* Daily MCQ Practice player */
        <Card className="p-6 bg-[#0D0D0D]/50 border border-[#A855F7]/20 space-y-6 animate-slide-up neon-border">
          <div className="flex items-center justify-between border-b border-[#A855F7]/20 pb-4">
            <h3 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-[#A855F7] icon-glow-purple" /> Daily Article MCQs</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveMcqArticle(null)} className="text-[#A855F7] hover:text-[#C084FC]">Exit MCQs</Button>
          </div>
          {activeMcqArticle.mcqs.map((m, mIdx) => (
            <div key={mIdx} className="space-y-3">
              <p className="text-sm font-semibold text-white">Q{mIdx+1}. {m.question}</p>
              <div className="space-y-2">
                {m.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[mIdx] === oIdx;
                  const isCorrect = oIdx === m.correct_index;

                  let style = "border-[#A855F7]/20 hover:border-[#A855F7]/40";
                  if (isSelected) style = "border-[#A855F7] bg-[#A855F7]/10 font-semibold shadow-[0_0_10px_rgba(168,85,247,0.2)]";
                  if (checkedMcq) {
                    if (isCorrect) style = "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
                    else if (isSelected) style = "border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !checkedMcq && setSelectedAnswers(prev => ({ ...prev, [mIdx]: oIdx }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all ${style} bg-[#0D0D0D]/30`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            {!checkedMcq ? (
              <Button onClick={() => setCheckedMcq(true)} disabled={Object.keys(selectedAnswers).length < activeMcqArticle.mcqs.length} className="flex-1 bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                Check Answers
              </Button>
            ) : (
              <Button onClick={() => setActiveMcqArticle(null)} className="flex-1 bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#C084FC] hover:bg-[#A855F7]/20">
                Finish Practice
              </Button>
            )}
          </div>
        </Card>
      ) : (
        /* Article Feed */
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 bg-[#0D0D0D]/50 border border-[#A855F7]/20 p-4 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles & concepts…"
                className="w-full bg-[#050505]/50 border border-[#A855F7]/20 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#A855F7]/50 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
              />
            </div>
            {/* Category Pill select */}
            <div className="flex gap-1.5 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                    (cat === category) ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-[#0D0D0D]/50 border-[#A855F7]/20 text-[#777777] hover:text-white hover:border-[#A855F7]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 text-violet-400 animate-spin" /></div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-[#777777] bg-[#0D0D0D]/50 border border-[#A855F7]/20 rounded-2xl">
              <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#A855F7]" />
              <p className="text-sm">No current affairs articles found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map(article => (
                <Card key={article.id} className="p-5 bg-[#0D0D0D]/50 border border-[#A855F7]/20 flex flex-col justify-between hover:border-[#A855F7]/40 transition-all space-y-4 neon-border">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-[#A855F7] bg-[#A855F7]/10 px-2.5 py-1 rounded-full border border-[#A855F7]/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]">{article.category}</span>
                      <p className="text-[10px] text-[#777777]">{new Date(article.published_at).toLocaleDateString()}</p>
                    </div>
                    <h3 className="font-bold text-base text-white leading-snug">{article.title}</h3>
                    <p className="text-xs md:text-sm text-[#B3B3B3] line-clamp-3 leading-relaxed font-mono whitespace-pre-line">{article.content}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#A855F7]/20">
                    <div className="flex gap-2">
                      <button onClick={() => toggleBookmark(article.id)} className="p-2 rounded-lg hover:bg-[#0D0D0D]/50">
                        {bookmarks.includes(article.id) ? <BookmarkCheck className="w-4 h-4 text-[#A855F7] icon-glow-purple" /> : <Bookmark className="w-4 h-4 text-[#777777]" />}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[#0D0D0D]/50 text-[#777777] hover:text-white"><Share2 className="w-4 h-4" /></button>
                    </div>
                    {article.mcqs.length > 0 && (
                      <Button onClick={() => handleStartMcq(article)} size="sm" variant="ghost" className="text-[#A855F7] hover:text-[#C084FC]">
                        Solve {article.mcqs.length} MCQs <ArrowRight className="w-4 h-4 ml-1 icon-glow-purple" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentAffairsPage;
