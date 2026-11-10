import { Link } from "react-router-dom";
import {
  Building2,
  ChevronRight,
  ShieldCheck,
  UserCog,
  UserPlus,
} from "lucide-react";

const settingsItems = [
  {
    title: "Dodaj użytkownika",
    description: "Utwórz nowe konto użytkownika aplikacji.",
    icon: UserPlus,
    to: "/settings/users/add",
  },
  {
    title: "Użytkownicy i role",
    description: "Przeglądaj użytkowników oraz nadawaj im role.",
    icon: UserCog,
    to: "/settings/users",
  },
  {
    title: "Zarządzaj rolami",
    description: "Dodawaj i edytuj role dostępne w aplikacji.",
    icon: ShieldCheck,
    to: "/settings/roles",
  },
  {
    title: "Dane jednostki",
    description: "Podstawowe informacje o jednostce OSP.",
    icon: Building2,
    to: "/settings/fire-stations",
  },
];

function SettingsCard({ title, description, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="
        group flex items-center gap-4 rounded-xl
        border border-slate-200 bg-white p-5
        shadow-sm transition
        hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md
      "
    >
      <div
        className="
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-lg bg-red-50 text-red-600
        "
      >
        <Icon size={24} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <ChevronRight
        size={20}
        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-red-600"
      />
    </Link>
  );
}

export default function Settings() {
  return (
    <main className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Ustawienia</h1>

        <p className="mt-2 text-slate-500">
          Zarządzaj użytkownikami, rolami i podstawowymi danymi aplikacji.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsItems.map((item) => (
          <SettingsCard
            key={item.to}
            title={item.title}
            description={item.description}
            icon={item.icon}
            to={item.to}
          />
        ))}
      </div>
    </main>
  );
}
