import { Eye, EyeOff } from "lucide-react";

interface TabBlurOverlayProps {
  visible: boolean;
  onResume?: () => void;
}

export const TabBlurOverlay = ({ visible, onResume }: TabBlurOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-[30] flex flex-col items-center justify-center"
      style={{ backdropFilter: "blur(24px)", background: "rgba(0,0,0,0.75)" }}
    >
      <div className="animate-bounce mb-4">
        <EyeOff className="w-10 h-10 text-white/70" />
      </div>
      <p className="text-white font-bold text-base mb-1">Lecture Paused</p>
      <p className="text-white/60 text-xs mb-5 text-center px-6">
        Content is blurred while you're away.<br />
        Return to this tab to continue watching.
      </p>
      {onResume && (
        <button
          onClick={onResume}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-full border border-white/30 transition-all hover:scale-105"
        >
          <Eye className="w-4 h-4" /> Resume
        </button>
      )}
    </div>
  );
};
