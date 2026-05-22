import { useState, useEffect, useRef } from "react";
import { Search, BookOpen, Video, Trophy, FileText, HelpCircle, X, Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  courses: Array<{ id: string; title: string; description: string }>;
  lectures: Array<{ id: string; title: string; description: string }>;
  quizzes: Array<{ id: string; title: string; description: string }>;
  pyqs: Array<{ id: string; subject: string; topic: string; question: string }>;
  currentAffairs: Array<{ id: string; title: string; category: string }>;
}

const categoryIcons: Record<string, any> = {
  courses: BookOpen,
  lectures: Video,
  quizzes: Trophy,
  pyqs: HelpCircle,
  currentAffairs: FileText,
};

const categoryLabels: Record<string, string> = {
  courses: "Courses",
  lectures: "Lectures",
  quizzes: "Quizzes",
  pyqs: "PYQs",
  currentAffairs: "Current Affairs",
};

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    courses: [],
    lectures: [],
    quizzes: [],
    pyqs: [],
    currentAffairs: []
  });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults({ courses: [], lectures: [], quizzes: [], pyqs: [], currentAffairs: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/upsc/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data);
        }
      } catch {
        setResults({ courses: [], lectures: [], quizzes: [], pyqs: [], currentAffairs: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleResultClick = (category: string, item: any) => {
    let path = "";
    switch (category) {
      case "courses":
        path = `/courses/${item.id}`;
        break;
      case "lectures":
        path = `/courses`; // Navigate to course page, would need to map to specific course
        break;
      case "quizzes":
        path = `/quizzes`; // Navigate to quizzes
        break;
      case "pyqs":
        setIsOpen(false);
        // Would navigate to PYQ page with filter
        return;
      case "currentAffairs":
        setIsOpen(false);
        // Would navigate to Current Affairs page
        return;
    }
    if (path) {
      navigate(path);
      setIsOpen(false);
    }
  };

  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="relative" ref={searchRef}>
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all"
      >
        <Search className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Search...</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[500px] max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
            {/* Search Input */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, lectures, quizzes, PYQs, current affairs..."
                  className="w-full bg-white/5 border border-purple-500/10 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/30"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : query.length < 2 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Type at least 2 characters to search</p>
                </div>
              ) : totalResults === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {Object.entries(results).map(([category, items]) => {
                    if (items.length === 0) return null;
                    const Icon = categoryIcons[category];
                    
                    return (
                      <div key={category} className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-4 h-4 text-purple-400" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {categoryLabels[category]} ({items.length})
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {items.map((item: any, idx) => (
                            <div
                              key={item.id || idx}
                              onClick={() => handleResultClick(category, item)}
                              className="p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-purple-500/20 transition-all cursor-pointer group"
                            >
                              <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-purple-300 transition-colors">
                                {item.title || item.question}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                {item.description || item.topic || item.category}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border flex items-center justify-between">
              <p className="text-[10px] text-gray-500">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">Esc</kbd> to close
              </p>
              {totalResults > 0 && (
                <span className="text-[10px] text-muted-foreground">{totalResults} results</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalSearch;
