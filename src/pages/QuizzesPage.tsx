import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuizzes } from "@/lib/supabase-data";
import { usePurchase } from "@/lib/purchase-context";
import { useNavigate } from "react-router-dom";
import { Trophy, Clock, ChevronRight, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const QuizzesPage = () => {
  const navigate = useNavigate();
  const { hasPurchased } = usePurchase();
  const { data: quizzes = [] } = useQuizzes();

  const handleQuizClick = (quiz: typeof quizzes[0]) => {
    if (!hasPurchased(quiz.course_id)) {
      toast.error("Purchase the course to access this quiz.");
      return;
    }
    if (quiz.status === "available") {
      navigate(`/quiz/${quiz.id}`);
    }
  };

  const scrollRef = useScrollReveal();

  return (
    <div className="space-y-4 animate-slide-up" ref={scrollRef}>
      <h2 className="text-xl font-bold animate-text-glow">Quizzes & Tests</h2>

      <div className="space-y-3">
        {quizzes.map((quiz, i) => {
          const purchased = hasPurchased(quiz.course_id);
          return (
            <Card
              key={quiz.id}
              className={`p-4 transition-all reveal spotlight-card ${
                purchased && quiz.status === "available" ? "cursor-pointer hover:card-shadow-lg hover:scale-[1.01] active:scale-[0.99]" : ""
              } ${!purchased ? "opacity-70" : ""}`}
              onClick={() => handleQuizClick(quiz)}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !purchased ? "bg-muted" :
                  quiz.status === "available" ? "bg-warning/10" : "bg-muted"
                } icon-glass`}>
                  {!purchased ? (
                    <Lock className="w-5 h-5 text-muted-foreground icon-glow-purple" />
                  ) : quiz.status === "available" ? (
                    <Trophy className="w-5 h-5 text-warning icon-glow-purple" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground icon-glow-purple" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{quiz.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>{(quiz as any).courses?.title}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 icon-glow-purple" /> {quiz.duration}</span>
                  </div>
                  {!purchased && (
                    <p className="text-[10px] text-destructive mt-0.5">Purchase course to access</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {purchased && quiz.status === "available" && (
                    <Badge className="bg-warning/10 text-warning border-0">Start</Badge>
                  )}
                  {quiz.status === "upcoming" && <Badge variant="secondary">Upcoming</Badge>}
                  {!purchased && <Lock className="w-4 h-4 text-muted-foreground" />}
                  {purchased && quiz.status === "available" && <ChevronRight className="w-4 h-4 text-muted-foreground icon-glow-purple" />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuizzesPage;
