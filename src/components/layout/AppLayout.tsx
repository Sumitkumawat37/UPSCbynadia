import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-20 -right-16 w-64 h-64 bg-sky-200/30 blob pointer-events-none" style={{ zIndex: 0 }} />
      <div className="fixed top-1/2 -left-20 w-56 h-56 bg-cyan-200/20 blob-2 pointer-events-none" style={{ zIndex: 0 }} />
      <div className="fixed bottom-32 right-8 w-40 h-40 bg-blue-200/20 blob pointer-events-none" style={{ zIndex: 0, animationDelay: '2s' }} />

      {/* Desktop sidebar */}
      <SidebarNav />

      {/* Content area: shifts right on desktop */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 pb-28 md:pb-10 px-4 py-5 md:px-8 md:py-7 relative z-10
          max-w-lg mx-auto w-full
          md:max-w-none md:mx-0">
          {children}
        </main>
      </div>

      {/* Bottom nav: mobile only */}
      <BottomNav />
    </div>
  );
}
