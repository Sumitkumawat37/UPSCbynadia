import React, { createContext, useContext, useState, ReactNode } from "react";

interface PurchaseContextType {
  purchasedCourses: string[];
  purchaseCourse: (courseId: string) => void;
  hasPurchased: (courseId: string) => boolean;
  canAccessLecture: (courseId: string, isFreePreview: boolean) => boolean;
}

const PurchaseContext = createContext<PurchaseContextType | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>(() => {
    const saved = localStorage.getItem("edumaster_purchases");
    // Course "1" is unlocked by default for demo
    return saved ? JSON.parse(saved) : ["1"];
  });

  const purchaseCourse = (courseId: string) => {
    setPurchasedCourses((prev) => {
      const updated = [...new Set([...prev, courseId])];
      localStorage.setItem("edumaster_purchases", JSON.stringify(updated));
      return updated;
    });
  };

  const hasPurchased = (courseId: string) => purchasedCourses.includes(courseId);

  const canAccessLecture = (courseId: string, isFreePreview: boolean) => {
    return isFreePreview || hasPurchased(courseId);
  };

  return (
    <PurchaseContext.Provider value={{ purchasedCourses, purchaseCourse, hasPurchased, canAccessLecture }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error("usePurchase must be inside PurchaseProvider");
  return ctx;
}
