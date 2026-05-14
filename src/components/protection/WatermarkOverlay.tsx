import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface WatermarkOverlayProps {
  visible?: boolean;
}

const POSITIONS = [
  { top: "15%", left: "10%" },
  { top: "15%", left: "55%" },
  { top: "45%", left: "30%" },
  { top: "45%", left: "65%" },
  { top: "72%", left: "10%" },
  { top: "72%", left: "55%" },
];

export const WatermarkOverlay = ({ visible = true }: WatermarkOverlayProps) => {
  const { user } = useAuth();
  const [posIndex, setPosIndex] = useState(0);

  // Slowly drift watermark position every 8 seconds
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => {
      setPosIndex((p) => (p + 1) % POSITIONS.length);
    }, 8000);
    return () => clearInterval(t);
  }, [visible]);

  if (!visible || !user) return null;

  const pos = POSITIONS[posIndex];
  const timestamp = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[20] overflow-hidden"
      aria-hidden="true"
      data-protected
    >
      {/* Primary drifting watermark */}
      <div
        className="absolute transition-all duration-[3000ms] ease-in-out select-none"
        style={{
          top: pos.top,
          left: pos.left,
          opacity: 0.12,
          transform: "rotate(-25deg)",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <p className="text-white text-[11px] font-bold whitespace-nowrap leading-tight drop-shadow-lg">
          {user.name || user.email}
        </p>
        <p className="text-white text-[10px] whitespace-nowrap leading-tight drop-shadow-lg">
          {user.email}
        </p>
        <p className="text-white text-[9px] whitespace-nowrap opacity-80 drop-shadow-lg">
          UPSC Nadiya · {timestamp}
        </p>
      </div>

      {/* Secondary static watermark (diagonal) */}
      <div
        className="absolute select-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          opacity: 0.04,
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <p className="text-white text-2xl font-black whitespace-nowrap tracking-widest drop-shadow-xl">
          UPSC BY NADIYA
        </p>
        <p className="text-white text-sm text-center whitespace-nowrap opacity-70">
          {user.email}
        </p>
      </div>
    </div>
  );
};
