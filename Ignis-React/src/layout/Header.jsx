import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Button } from "../components/Button.jsx";

export default function Header({
  theme,
  setTheme,
  setOpenSidebar,
  rightOffset = false,
}) {
  return (
    <header
      className={`sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur ${
        rightOffset ? "md:pr-[320px]" : ""
      } md:pl-64`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <button className="md:hidden" onClick={() => setOpenSidebar((s) => !s)}>
          <Menu className="h-6 w-6 text-zinc-700 dark:text-zinc-100" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            OSP Cloud
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              placeholder="Szukaj..."
              className="bg-transparent outline-none text-sm text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 w-56"
            />
          </div>
          <Button variant="ghost">
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            icon={theme === "dark" ? Sun : Moon}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Jasny" : "Ciemny"}
          </Button>
        </div>
      </div>
    </header>
  );
}
