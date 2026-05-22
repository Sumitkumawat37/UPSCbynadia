import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuditLogEntry {
  action: string;
  details: any;
  timestamp: string;
  userId?: string;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const AUDIT_STORAGE_KEY = "upsc_audit_logs";

export const useSecurity = () => {
  const navigate = useNavigate();
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Log audit events to localStorage
  const logAuditEvent = (action: string, details: any = {}) => {
    try {
      const userId = localStorage.getItem("user_id") || "anonymous";
      const entry: AuditLogEntry = {
        action,
        details,
        timestamp: new Date().toISOString(),
        userId
      };

      const existingLogs = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
      existingLogs.push(entry);

      // Keep only last 1000 logs
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }

      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(existingLogs));
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  };

  // Get audit logs
  const getAuditLogs = (): AuditLogEntry[] => {
    try {
      return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  // Clear audit logs
  const clearAuditLogs = () => {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  };

  // Session timeout handling
  useEffect(() => {
    const resetActivityTimer = () => {
      lastActivityRef.current = Date.now();
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
      activityTimerRef.current = setTimeout(handleSessionTimeout, SESSION_TIMEOUT_MS);
    };

    const handleSessionTimeout = () => {
      const inactiveTime = Date.now() - lastActivityRef.current;
      if (inactiveTime >= SESSION_TIMEOUT_MS) {
        logAuditEvent("SESSION_TIMEOUT", { inactiveTime });
        toast.warning("Session expired due to inactivity. Please log in again.");
        navigate("/login");
        localStorage.removeItem("user_id");
      }
    };

    // Track user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach(event => {
      window.addEventListener(event, resetActivityTimer);
    });

    resetActivityTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetActivityTimer);
      });
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [navigate]);

  // Input sanitization helper
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, "") // Remove HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (basic)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  return {
    logAuditEvent,
    getAuditLogs,
    clearAuditLogs,
    sanitizeInput,
    validateEmail,
    validatePhone
  };
};

export default useSecurity;
