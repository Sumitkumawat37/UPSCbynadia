import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:5000/api/v1";

// Courses
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/courses`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch courses");
      return data.courses || [];
    },
  });
}

export function useCourse(courseId?: string) {
  return useQuery({
    queryKey: ["course", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch course");
      return data.course;
    },
  });
}

// Lectures
export function useLectures(courseId?: string) {
  return useQuery({
    queryKey: ["lectures", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/lectures/course/${courseId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch lectures");
      return data.data || [];
    },
  });
}

export function useLecture(lectureId?: string) {
  return useQuery({
    queryKey: ["lecture", lectureId],
    enabled: !!lectureId,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch lecture");
      return data.data;
    },
  });
}

// Quizzes
export function useQuizzes(courseId?: string) {
  return useQuery({
    queryKey: ["quizzes", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/quizzes/course/${courseId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch quizzes");
      return data.data || [];
    },
  });
}

export function useQuiz(quizId?: string) {
  return useQuery({
    queryKey: ["quiz", quizId],
    enabled: !!quizId,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch quiz");
      return data.data;
    },
  });
}

// Quiz Attempts
export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ quizId, userId, answers, score, total }: any) => {
      const response = await fetch(`${API_BASE_URL}/quizzes/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, userId, answers, score, total }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit quiz attempt");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizAttempts"] });
    },
  });
}
