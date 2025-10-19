import React from "react";
import SidebarItem from "../components/SidebarItem";
// (opcjonalnie ikony)
import { Home, FileText, ShoppingBag, Mail } from "lucide-react";

export default function Sidebar({ open, onOpenChange }) {
  // Zamknij ESC
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Kliknięcie linku zamyka panel (szczególnie przydatne na mobile)
  const closeAnd =
    (fn) =>
    (...args) => {
      if (typeof fn === "function") fn(...args);
      onOpenChange(false);
    };

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        aria-hidden={!open}
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        aria-label="Sidenav"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 md:static `}
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <ul className="space-y-2">
            <SidebarItem
              label="Dashboard"
              icon={Home}
              to={"/home"}
              onNavigate={() => onOpenChange(false)}
            />

            <SidebarItem
              label="Dokumentacja"
              icon={FileText}
              subItems={[
                { label: "Karta wyjazdu", to: "/documents/departurecard" },
                { label: "Karta szkoleń", to: "#billing" },
                { label: "Karta ćwiczeń", to: "#invoice" },
                { label: "Karta kierowcy", to: "#invoice" },
              ]}
              onNavigate={() => onOpenChange(false)}
            />

            <SidebarItem
              label="Overview"
              icon={Home}
              to={"/home"}
              onNavigate={() => onOpenChange(false)}
            />

            <SidebarItem
              label="Pages"
              icon={FileText}
              subItems={["Settings", "Kanban", "Calendar"]}
              onNavigate={() => onOpenChange(false)}
            />

            <SidebarItem
              label="Sales"
              icon={ShoppingBag}
              subItems={[
                { label: "Products", href: "#products" },
                { label: "Billing", href: "#billing" },
                { label: "Invoice", href: "#invoice" },
              ]}
              onNavigate={() => onOpenChange(false)}
            />

            <SidebarItem
              label="Messages"
              icon={Mail}
              href="#messages"
              onNavigate={() => onOpenChange(false)}
            />
          </ul>

          {/* Dolna sekcja */}
          <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
            {["Docs", "Components", "Help"].map((label) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={closeAnd()}
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                >
                  {/* (ikony zostawiłem jak w Twoim kodzie – skrócone dla czytelności) */}
                  <span className="ml-3">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
