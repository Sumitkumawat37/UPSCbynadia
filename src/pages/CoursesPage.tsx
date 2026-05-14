import { useCourses } from "@/lib/supabase-data";
import { usePurchase } from "@/lib/purchase-context";
import { useNavigate } from "react-router-dom";
import { Lock, ShoppingCart, Eye, CheckCircle2, BookOpen } from "lucide-react";
import { toast } from "sonner";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { hasPurchased, purchaseCourse } = usePurchase();
  const { data: courses = [], isLoading } = useCourses();

  const handleBuyCourse = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    toast.info("Processing demo payment...", { duration: 1500 });
    setTimeout(() => {
      purchaseCourse(courseId);
      toast.success("🎉 Course purchased! All lectures unlocked.");
    }, 1500);
  };

  if (isLoading) return (
    <div className="space-y-4 animate-fade-in">
      <div className="h-16 rounded-3xl shimmer-bg" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-3xl overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="aspect-square shimmer-bg" />
            <div className="p-3 space-y-2">
              <div className="h-3 rounded-full shimmer-bg" />
              <div className="h-3 w-2/3 rounded-full shimmer-bg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-4 shadow-lg shadow-sky-300/20">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-0 left-8 w-12 h-12 bg-white/10 rounded-full animate-float-reverse" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 animate-float-slow">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Course Marketplace</h2>
            <p className="text-white/70 text-[10px]">Tap any course · 2 free lectures included</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
        {courses.map((course, i) => {
          const purchased = hasPurchased(course.id);
          return (
            <div
              key={course.id}
              className="overflow-hidden cursor-pointer flex flex-col rounded-3xl bg-white shadow-md border border-slate-50 animate-slide-up card-interactive tilt-hover"
              onClick={() => navigate(`/courses/${course.id}`)}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Square thumbnail */}
              <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl bg-sky-50">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-item:hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl gradient-hero opacity-90 animate-float-slow">
                    <span>{course.thumbnail_emoji || "📚"}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Status badge */}
                {purchased ? (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-lg animate-pop-in">
                    <CheckCircle2 className="w-2.5 h-2.5" /> ENROLLED
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 bg-white/90 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <Eye className="w-2.5 h-2.5" /> 2 FREE
                  </div>
                )}

                {/* Category */}
                {course.category && (
                  <div className="absolute top-2 left-2 gradient-hero text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    {course.category}
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <h3 className="font-bold text-xs text-white line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  {!purchased ? (
                    <p className="text-sm font-bold text-primary">₹{course.price}</p>
                  ) : (
                    <p className="text-[10px] text-emerald-600 font-bold">▶ Continue</p>
                  )}
                  <p className="text-[10px] text-slate-400 truncate">{course.instructor}</p>
                </div>
                {!purchased ? (
                  <button
                    className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center shadow-md shadow-sky-200 hover-scale ripple shrink-0"
                    onClick={(e) => handleBuyCourse(e, course.id)}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-white" />
                  </button>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl shadow-sm text-slate-400 text-sm">
          No courses yet. Check back soon!
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
