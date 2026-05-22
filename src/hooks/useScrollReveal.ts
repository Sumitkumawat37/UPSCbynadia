import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );

    // Observe the container and all reveal children
    const children = el.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    children.forEach((child) => observer.observe(child));
    if (el.classList.contains("reveal") || el.classList.contains("reveal-left") || el.classList.contains("reveal-right") || el.classList.contains("reveal-scale")) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
