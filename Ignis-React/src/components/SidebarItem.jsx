// SidebarItem.jsx
import React from "react";
import { NavLink, useInRouterContext } from "react-router-dom";

// Link, który działa z/bez routera
function LinkMaybe({ to, href, className, onClick, children, end }) {
  const inRouter = useInRouterContext();
  if (inRouter && to != null) {
    return (
      <NavLink to={to} end={end} className={className} onClick={onClick}>
        {children}
      </NavLink>
    );
  }
  return (
    <a
      href={href ?? (typeof to === "string" ? to : "#")}
      onClick={(e) => {
        // nie skacz do góry strony gdy nie ma realnego href/to
        if ((!href && !to) || href === "#" || to === "#") e.preventDefault();
        onClick?.(e);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

export default function SidebarItem({
  label,
  icon: Icon, // opcjonalna ikona (np. z lucide-react)
  to, // preferowane w SPA; alternatywnie podaj href
  href,
  subItems, // brak -> zwykły link; jest -> dropdown
  defaultOpen = false,
  onNavigate, // wywołaj np. by zamknąć sidebar na mobile
  className = "",
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();

  const normalized = React.useMemo(() => {
    if (!subItems) return [];
    if (Array.isArray(subItems)) {
      // ["Settings"] lub [{label, to?, href?, onClick?}]
      return subItems.map((it) =>
        typeof it === "string" ? { label: it } : it
      );
    }
    // mapa: { "Settings": "/settings" }
    return Object.entries(subItems).map(([k, v]) =>
      typeof v === "string" ? { label: k, to: v } : { label: k, ...v }
    );
  }, [subItems]);

  const baseItem =
    "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group";
  const iconCls =
    "flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white";

  const handleLeafClick = (e, item) => {
    item?.onClick?.(e);
    onNavigate?.(item);
  };

  // 1) LINK (bez subItems)
  if (!normalized.length) {
    return (
      <li>
        <LinkMaybe
          to={to}
          href={href}
          onClick={(e) => handleLeafClick(e, { label, to, href })}
          className={`${baseItem} ${className} ${
            // aktywny stan tylko gdy to=... (NavLink); dla <a> po prostu baseItem
            typeof to === "string"
              ? ({ isActive }) =>
                  `${baseItem} ${
                    isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`
              : ""
          }`}
          end={to === "/"}
        >
          {Icon ? (
            <Icon className={iconCls} aria-hidden="true" />
          ) : (
            <svg
              className={iconCls}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="6" />
            </svg>
          )}
          <span className="ml-3">{label}</span>
        </LinkMaybe>
      </li>
    );
  }

  // 2) DROPDOWN (z subItems)
  return (
    <li>
      <button
        type="button"
        aria-controls={`dropdown-${id}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${baseItem} w-full text-left ${className}`}
      >
        {Icon ? (
          <Icon className={iconCls} aria-hidden="true" />
        ) : (
          <svg
            className={iconCls}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="5" y="5" width="10" height="10" rx="2" />
          </svg>
        )}
        <span className="flex-1 ml-3 whitespace-nowrap">{label}</span>
        <svg
          className={`w-6 h-6 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </button>

      <ul
        id={`dropdown-${id}`}
        className={`${open ? "block" : "hidden"} py-2 space-y-2`}
      >
        {normalized.map((item) => (
          <li key={item.label}>
            <LinkMaybe
              to={item.to}
              href={item.href}
              onClick={(e) => handleLeafClick(e, item)}
              className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              end={item.to === "/"}
            >
              {item.label}
            </LinkMaybe>
          </li>
        ))}
      </ul>
    </li>
  );
}
