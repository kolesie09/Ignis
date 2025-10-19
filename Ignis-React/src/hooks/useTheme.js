import { useEffect, useState } from "react";

export function useTheme() {
  const [openRight, setOpenRight] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return (
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    openRight,
    setOpenRight,
    openSidebar,
    setOpenSidebar,
  };
}
