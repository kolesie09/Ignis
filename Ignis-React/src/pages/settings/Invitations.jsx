import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Plus } from "lucide-react";

import { apiFetch } from "../../api/api.js";
export default function Invitations() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [validDays, setValidDays] = useState("7");
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState("");
  const dayOptions = [1, 7, 14, 30];

  // Wyciąga komunikat błędu z odpowiedzi backendu.
  // .catch(() => null) – gdy odpowiedź nie jest JSON-em, nie wysypujemy się.
  // ?? bierze pierwszą wartość, która nie jest null/undefined.
  const readErrorMessage = async (response) => {
    const data = await response.text().catch(() => null);

    return data || "Nie udało się wygenerować linku";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await apiFetch(
        `/api/station-invitations/generate?validDays=${validDays}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new Error(message);
      }
      const newToken = await response.text();
      setToken(newToken);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-8">
      <Link
        to="/settings"
        className="
          mb-6 inline-flex items-center gap-2
          text-sm text-slate-500
          transition hover:text-red-600
        "
      >
        <ArrowLeft size={18} />
        Wróć do ustawień
      </Link>

      {/* ===== Nagłówek strony ===== */}
      <header className="mb-8 flex items-center gap-4">
        <div
          className="
            flex h-12 w-12 items-center justify-center
            rounded-xl bg-red-50 text-red-600
          "
        >
          <UserPlus size={26} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Zaproszenia</h1>

          <p className="mt-1 text-slate-500">
            Dodawaj strażaków do swojej jednostki.
          </p>
        </div>
      </header>

      {/* ===== Komunikaty (renderowane tylko gdy tekst nie jest pusty) ===== */}
      {error && (
        <div
          className="
            mb-5 rounded-lg border border-red-200
            bg-red-50 p-4 text-sm text-red-700
          "
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="
            mb-5 rounded-lg border border-green-200
            bg-green-50 p-4 text-sm text-green-700
          "
        >
          {success}
        </div>
      )}

      <section
        className="
            h-fit rounded-xl border border-slate-200
            bg-white p-6 shadow-sm
          "
      >
        <div className="grid gap-6 lg:grid-cols-[380px_lfr]">
          <div className="mb-5 flex items-center gap-3">
            <Plus size={21} className="text-red-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Dodaj strażaka
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Gmina – opcje z /api/municipalities; value="" oznacza "nic nie wybrano" */}
            <label className="block">
              <span
                className="
                  mb-2 block text-sm font-medium
                  text-slate-700
                "
              >
                Ważność linku
              </span>

              <select
                name="validDays"
                value={validDays}
                onChange={(e) => setValidDays(e.target.value)}
                required
                className="
                  w-full rounded-lg border border-slate-300
                  px-3 py-2.5 outline-none transition
                  focus:border-red-500
                  focus:ring-2 focus:ring-red-100
                "
              >
                <option value="">Wybierz liczbę dni</option>
                {dayOptions.map((days) => (
                  <option key={days} value={days}>
                    {days} dni
                  </option>
                ))}
              </select>
            </label>

            {/* disabled podczas zapisu – chroni przed podwójnym wysłaniem */}
            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex w-full items-center
                justify-center gap-2 rounded-lg
                bg-red-600 px-4 py-2.5
                font-semibold text-white transition
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Plus size={19} />
              {saving ? "Generowanie..." : "Wygeneruj link"}
            </button>
          </form>
          {token && <div className=" break-all">{token}</div>}
        </div>
      </section>
    </main>
  );
}
