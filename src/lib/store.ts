import { useCallback, useEffect, useState } from "react";
import type { GeneratedEmail, MeetingSummary, Preferences, TaskPlan, User } from "@/types";

const KEYS = {
  user: "awpa.user",
  emails: "awpa.emails",
  meetings: "awpa.meetings",
  plans: "awpa.plans",
  prefs: "awpa.prefs",
} as const;

export const defaultPrefs: Preferences = {
  defaultTone: "Professional",
  defaultSummaryLength: "Concise",
  defaultPriority: "Medium",
  theme: "system",
  emailNotifications: true,
  productivityReminders: false,
};

const EVENT = "awpa:store";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read(key, fallback));
    setHydrated(true);
    const handler = () => setValue(read(key, fallback));
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback((next: T) => write(key, next), [key]);
  return { value, update, hydrated };
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useUser() {
  const { value, update, hydrated } = useStored<User | null>(KEYS.user, null);
  const signIn = (name: string, email: string) =>
    update({ id: uid(), name, email, created_at: new Date().toISOString() });
  const signOut = () => update(null);
  return { user: value, signIn, signOut, setUser: update, hydrated };
}

export function usePrefs() {
  const { value, update, hydrated } = useStored<Preferences>(KEYS.prefs, defaultPrefs);
  return { prefs: { ...defaultPrefs, ...value }, setPrefs: update, hydrated };
}

export function useEmails() {
  const { value, update, hydrated } = useStored<GeneratedEmail[]>(KEYS.emails, []);
  return {
    emails: value,
    save: (e: GeneratedEmail) => update([e, ...value.filter((x) => x.id !== e.id)]),
    remove: (id: string) => update(value.filter((x) => x.id !== id)),
    hydrated,
  };
}

export function useMeetings() {
  const { value, update, hydrated } = useStored<MeetingSummary[]>(KEYS.meetings, []);
  return {
    meetings: value,
    save: (m: MeetingSummary) => update([m, ...value.filter((x) => x.id !== m.id)]),
    remove: (id: string) => update(value.filter((x) => x.id !== id)),
    hydrated,
  };
}

export function usePlans() {
  const { value, update, hydrated } = useStored<TaskPlan[]>(KEYS.plans, []);
  return {
    plans: value,
    save: (p: TaskPlan) => update([p, ...value.filter((x) => x.id !== p.id)]),
    remove: (id: string) => update(value.filter((x) => x.id !== id)),
    hydrated,
  };
}

export function applyTheme(theme: Preferences["theme"]) {
  if (typeof document === "undefined") return;
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}
