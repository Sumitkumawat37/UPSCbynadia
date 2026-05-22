import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";
import { FloatingParticles } from "@/components/FloatingParticles";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      {/* Animated floating particles background */}
      <FloatingParticles count={18} />

      {/* Decorative neon glow blobs */}
      <div className="fixed top-20 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-blob" style={{ zIndex: 0 }} />
      <div className="fixed top-1/2 -left-32 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none animate-blob-2" style={{ zIndex: 0 }} />
      <div className="fixed bottom-32 right-16 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ zIndex: 0 }} />

      {/* Desktop sidebar */}
      <SidebarNav />

      {/* Content area: shifts right on desktop */}
      <div className="md:ml-72 flex flex-col min-h-screen overflow-hidden">
        <AppHeader />
        <main className="flex-1 pb-28 md:pb-10 px-4 py-5 md:px-8 md:py-7 relative z-10 overflow-y-auto overflow-x-hidden
          max-w-5xl mx-auto w-full
          md:max-w-none md:mx-0">
          {children}
        </main>
      </div>

      {/* Bottom nav: mobile only */}
      <BottomNav />
    </div>
  );
}
