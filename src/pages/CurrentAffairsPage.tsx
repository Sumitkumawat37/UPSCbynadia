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
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Current Affairs</h1>
            <p className="text-muted-foreground text-sm">Daily analysis, UPSC compilations & practice questions</p>
          </div>
        </div>
      </div>

      {activeMcqArticle ? (
        /* Daily MCQ Practice player */
        <Card className="p-6 bg-card border border-border space-y-6 animate-slide-up">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2"><HelpCircle className="w-5 h-5 text-indigo-400" /> Daily Article MCQs</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveMcqArticle(null)}>Exit MCQs</Button>
          </div>
          {activeMcqArticle.mcqs.map((m, mIdx) => (
            <div key={mIdx} className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Q{mIdx+1}. {m.question}</p>
              <div className="space-y-2">
                {m.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[mIdx] === oIdx;
                  const isCorrect = oIdx === m.correct_index;

                  let style = "border-border hover:border-violet-500/30";
                  if (isSelected) style = "border-violet-500 bg-violet-500/5 font-semibold";
                  if (checkedMcq) {
                    if (isCorrect) style = "border-green-500 bg-green-500/10 text-green-400";
                    else if (isSelected) style = "border-red-500 bg-red-500/10 text-red-400";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !checkedMcq && setSelectedAnswers(prev => ({ ...prev, [mIdx]: oIdx }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all ${style}`}
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
              <Button onClick={() => setCheckedMcq(true)} disabled={Object.keys(selectedAnswers).length < activeMcqArticle.mcqs.length} className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600">
                Check Answers
              </Button>
            ) : (
              <Button onClick={() => setActiveMcqArticle(null)} className="flex-1 bg-violet-500/10 border border-violet-500/20 text-violet-300">
                Finish Practice
              </Button>
            )}
          </div>
        </Card>
      ) : (
        /* Article Feed */
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles & concepts…"
                className="w-full bg-white/5 border border-purple-500/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/30"
              />
            </div>
            {/* Category Pill select */}
            <div className="flex gap-1.5 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                    (cat === category) ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20" : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
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
            <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-2xl">
              <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30 text-violet-400" />
              <p className="text-sm">No current affairs articles found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map(article => (
                <Card key={article.id} className="p-5 bg-card border border-border flex flex-col justify-between hover:border-violet-500/20 transition-all space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">{article.category}</span>
                      <p className="text-[10px] text-muted-foreground">{new Date(article.published_at).toLocaleDateString()}</p>
                    </div>
                    <h3 className="font-bold text-base text-foreground leading-snug">{article.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed font-mono whitespace-pre-line">{article.content}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex gap-2">
                      <button onClick={() => toggleBookmark(article.id)} className="p-2 rounded-lg hover:bg-white/5">
                        {bookmarks.includes(article.id) ? <BookmarkCheck className="w-4 h-4 text-violet-400" /> : <Bookmark className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Share2 className="w-4 h-4" /></button>
                    </div>
                    {article.mcqs.length > 0 && (
                      <Button onClick={() => handleStartMcq(article)} size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                        Solve {article.mcqs.length} MCQs <ArrowRight className="w-4 h-4 ml-1" />
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
