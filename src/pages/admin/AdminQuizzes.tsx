import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuizzes, useQuizQuestions } from "@/lib/supabase-data";
import { Plus, Trophy, Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const AdminQuizzes = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: quizzes = [] } = useQuizzes();

  return (
    <div className="space-y-4 animate-slide-up">
      <h2 className="text-xl font-bold">Quiz Management</h2>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild><Button className="w-full"><Plus className="w-4 h-4 mr-2" /> Create New Quiz</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Quiz</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Quiz Title</Label><Input placeholder="e.g. Algebra Basics Quiz" /></div>
            <Button className="w-full" onClick={() => { toast.success("Quiz created"); setShowForm(false); }}>Create Quiz</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="space-y-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center"><Trophy className="w-5 h-5 text-warning" /></div>
                <div>
                  <h4 className="font-semibold text-sm">{quiz.title}</h4>
                  <p className="text-xs text-muted-foreground">{(quiz as any).courses?.title} · {quiz.duration}</p>
                </div>
              </div>
              <Badge variant={quiz.status === "available" ? "default" : "secondary"}>{quiz.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminQuizzes;
