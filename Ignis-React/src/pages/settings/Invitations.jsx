import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Plus, User } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { apiFetch } from "../../api/api.js";
export default function Invitations() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingFirefighters, setPendingFirefighters] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);

  const [statuses, setStatuses] = useState([]);
  const [approvingFirefighter, setApprovingFirefighter] = useState(null);
  const [selectedStatusId, setSelectedStatusId] = useState("");

  const [validDays, setValidDays] = useState("7");
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState("");
  const dayOptions = [1, 7, 14, 30];

  const [copyStatus, setCopyStatus] = useState("");

  const inviteLink = `${window.location.origin}/register?token=${token}`;

  useEffect(() => {
    loadingPendingFirefighters();
    loadStatuses();
  }, []);

  // Wyciąga komunikat błędu z odpowiedzi backendu.
  // .catch(() => null) – gdy odpowiedź nie jest JSON-em, nie wysypujemy się.
  // ?? bierze pierwszą wartość, która nie jest null/undefined.
  const readErrorMessage = async (response) => {
    const data = await response.text().catch(() => null);

    return data || "Nie udało się wygenerować linku";
  };

  const handleClose = () => {
    setToken("");
    setCopyStatus("");
  };

  const handleCloseApprove = () => {
    setApprovingFirefighter(null);
    setSelectedStatusId("");
  };

  const loadingPendingFirefighters = async () => {
    try {
      setLoadingPending(true);
      setError("");

      // apiFetch sam dokleja token JWT do nagłówka Authorization.
      const response = await apiFetch("/api/firefighters/pending");

      // response.ok === true tylko dla statusów 200–299.
      if (!response.ok) {
        throw new Error(
          "Nie udało się pobrać listy nowo zarejestrowanych strażaków",
        );
      }

      const data = await response.json();
      setPendingFirefighters(data);
    } catch (error) {
      setError(error.message);
    } finally {
      // finally wykona się zawsze – po sukcesie i po błędzie.
      setLoadingPending(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const handleApprove = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await apiFetch(
        `/api/firefighters/${approvingFirefighter.id}/approve`,
        {
          method: "PATCH",
          body: JSON.stringify({
            firefighterStatusId: Number(selectedStatusId) || null,
          }),
        },
      );
      if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new Error(message);
      }

      setPendingFirefighters((prev) =>
        prev.filter(
          (firefighter) => approvingFirefighter.id !== firefighter.id,
        ),
      );

      setSuccess(`Strażak został zaakceptowany`);
      handleCloseApprove();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownloadPdf = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await apiFetch(
        `/api/station-invitations/${token}/poster`,
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Nie udało się pobrać plakatu");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "zaproszenie.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch {
      setCopyStatus("error");
    }
  };

  const loadStatuses = async () => {
    setError("");
    try {
      const response = await apiFetch(`/api/firefighter-statuses`);
      if (!response.ok) {
        throw new Error("Brak możliwości pobrania statusów");
      }

      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      setError(error.message);
    }
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
      {/* Dwie kolumny na dużym ekranie (380px + reszta), jedna pod drugą na telefonie */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section
          className="
              h-fit rounded-xl border border-slate-200
              bg-white p-6 shadow-sm
            "
        >
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
          {token && (
            // Warstwa 1: tło na cały ekran, przyciemnione, wyśrodkowuje okienko
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              {/* Warstwa 2: okienko */}
              <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Link zaproszenia
                </h2>

                {/* break-all: długi link łamie się w dowolnym miejscu zamiast wychodzić poza okno */}
                <p className="mb-4 break-all rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                  {inviteLink}
                </p>
                {copyStatus === "copied" ? (
                  <h4 className="flex justify-center font-medium text-green-700">
                    Skopiowano!
                  </h4>
                ) : copyStatus === "error" ? (
                  <h4 className="flex justify-center font-medium text-red-700">
                    Nie udało się skopiować linku
                  </h4>
                ) : (
                  ""
                )}

                {/* QR: białe tło + padding = margines, którego potrzebują skanery */}
                <div className="mb-6 flex justify-center">
                  <div className="rounded-lg bg-white p-3">
                    <QRCodeSVG value={inviteLink} size={200} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 mb-2.5"
                >
                  Pobierz PDF
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 mb-2.5"
                >
                  Kopiuj link
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700"
                >
                  Zamknij
                </button>
              </div>
            </div>
          )}
        </section>
        {/* === Prawa kolumna === */}
        <section
          className="
              overflow-hidden rounded-xl
              border border-slate-200
              bg-white shadow-sm
            "
        >
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Liczba oczekujących na akceptacje
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Liczba oczekujących: {pendingFirefighters.length}
            </p>
          </div>

          {/* Trzy stany: ładowanie → pusta lista → lista z danymi */}
          {loadingPending ? (
            <div className="p-8 text-center text-slate-500">
              Pobieranie oczekujących...
            </div>
          ) : pendingFirefighters.length === 0 ? (
            <div className="p-8 text-center">
              <User size={38} className="mx-auto mb-3 text-slate-300" />

              <p className="font-medium text-slate-700">Brak oczekującyh</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pendingFirefighters.map((firefighter) => (
                // key = stabilne ID z bazy, żeby React rozpoznawał elementy listy
                <article
                  key={firefighter.id}
                  className="
                      flex items-center gap-4
                      px-6 py-4
                    "
                >
                  <div
                    className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-lg bg-slate-100
                        text-slate-600
                      "
                  >
                    <User size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {firefighter.name} {firefighter.lastname}
                    </h3>
                    <h4 className="mt-1 text-sm text-slate-500">
                      {firefighter.email}
                    </h4>
                  </div>

                  <span
                    className="
                        rounded-full bg-slate-100
                        px-3 py-1 text-xs
                        font-medium text-slate-500
                      "
                  ></span>
                  <button
                    type="button"
                    onClick={() => setApprovingFirefighter(firefighter)}
                    className="inline-flex items-center
                        justify-center gap-2 rounded-lg
                        bg-red-600 px-4 py-2.5
                        font-semibold text-white transition
                        hover:bg-red-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60"
                  >
                    <Plus size={19} />
                    Akcpetuj
                  </button>
                </article>
              ))}
            </div>
          )}
          {approvingFirefighter && (
            // Warstwa 1: tło na cały ekran, przyciemnione, wyśrodkowuje okienko
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              {/* Warstwa 2: okienko */}
              <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Wybierz status nowego strażaka
                </h2>

                <form onSubmit={handleApprove} className="space-y-5">
                  <select
                    name="selectedStatusId"
                    value={selectedStatusId}
                    onChange={(e) => setSelectedStatusId(e.target.value)}
                    required
                    className="
                    w-full rounded-lg border border-slate-300
                    px-3 py-2.5 outline-none transition
                    focus:border-red-500
                    focus:ring-2 focus:ring-red-100
                  "
                  >
                    <option value="">Wybierz status</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 mb-2.5"
                  >
                    Wybierz
                  </button>
                </form>
                <button
                  type="button"
                  onClick={handleCloseApprove}
                  className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700"
                >
                  Zamknij
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
