"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        relative w-9 h-9 rounded-xl flex items-center justify-center
        bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700
        text-slate-600 dark:text-slate-300
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
        border border-slate-200/60 dark:border-slate-700/60
        shadow-sm hover:shadow-md
        outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900
      "
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark
            ? "opacity-0 rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100 text-amber-500"
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100 text-indigo-400"
            : "opacity-0 -rotate-90 scale-0"
        }`}
      />
    </button>
  );
};
