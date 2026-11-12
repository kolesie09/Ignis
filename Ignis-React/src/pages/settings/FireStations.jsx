import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Plus } from "lucide-react";

import { apiFetch } from "../../api/api.js";

// Pusty formularz – używany na starcie i do wyczyszczenia pól po zapisie.
// Wszystkie wartości to "" (a nie null), bo pola są kontrolowane przez React.
const initialForm = {
  name: "",
  establishmentDate: "",
  municipalityId: "",
};

// Strona "Ustawienia → Jednostki OSP": formularz dodawania + lista jednostek.
export default function FireStations() {
  // --- Dane z backendu ---
  const [fireStations, setFireStations] = useState([]);
  const [municipalities, setMunicipalities] = useState([]); // do listy rozwijanej

  // --- Stan formularza ---
  const [form, setForm] = useState(initialForm);

  // --- Stan interfejsu ---
  const [loading, setLoading] = useState(true); // ładowanie listy jednostek
  const [saving, setSaving] = useState(false); // trwa wysyłanie formularza
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pusta tablica zależności [] = uruchom tylko raz, po wejściu na stronę.
  // Oba zapytania lecą równolegle – każde zarządza tylko swoim stanem.
  useEffect(() => {
    loadFireStations();
    loadMunicipalities();
  }, []);

  // GET /api/municipalities – lista gmin do wyboru w formularzu.
  const loadMunicipalities = async () => {
    try {
      setError("");

      const response = await apiFetch("/api/municipalities");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać gmin");
      }

      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // GET /api/fire-stations – lista jednostek (z gminą w środku).
  const loadFireStations = async () => {
    try {
      setLoading(true);
      setError("");

      // apiFetch sam dokleja token JWT do nagłówka Authorization.
      const response = await apiFetch("/api/fire-stations");

      // response.ok === true tylko dla statusów 200–299.
      if (!response.ok) {
        throw new Error("Nie udało się pobrać jednostek");
      }

      const data = await response.json();
      setFireStations(data);
    } catch (error) {
      setError(error.message);
    } finally {
      // finally wykona się zawsze – po sukcesie i po błędzie.
      setLoading(false);
    }
  };

  // Jedna funkcja dla wszystkich pól formularza.
  // Atrybut name pola (np. "municipalityId") wskazuje, który klucz w form zmienić.
  const handleChange = (event) => {
    const { name, value } = event.target;

    // ...currentForm kopiuje stare pola, [name]: value nadpisuje jedno z nich.
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  // Wyciąga komunikat błędu z odpowiedzi backendu.
  // .catch(() => null) – gdy odpowiedź nie jest JSON-em, nie wysypujemy się.
  // ?? bierze pierwszą wartość, która nie jest null/undefined.
  const readErrorMessage = async (response) => {
    const data = await response.json().catch(() => null);

    return data?.message ?? data?.detail ?? "Nie udało się dodać jednostki";
  };

  // POST /api/fire-stations – dodanie nowej jednostki.
  const handleSubmit = async (event) => {
    // Bez tego przeglądarka przeładowałaby stronę.
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedName = form.name.trim();

    // Szybka walidacja na froncie (backend i tak sprawdza to samo).
    if (!normalizedName) {
      setError("Nazwa jednostki jest wymagana");
      return;
    }

    try {
      setSaving(true);

      const response = await apiFetch("/api/fire-stations", {
        method: "POST",
        body: JSON.stringify({
          name: normalizedName,
          // Puste pole daty -> null (data jest opcjonalna).
          establishmentDate: form.establishmentDate || null,
          // <select> zwraca tekst ("1") -> zamieniamy na liczbę.
          // Pusty wybór: Number("") = 0, a 0 || null = null -> backend zwróci 400.
          municipalityId: Number(form.municipalityId) || null,
        }),
      });

      if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new Error(message);
      }

      const createdFireStation = await response.json();

      // Dopisujemy nową jednostkę lokalnie zamiast pobierać całą listę od nowa.
      // Tworzymy NOWĄ tablicę (React wykrywa zmianę po nowej referencji)
      // i sortujemy po polsku, tak jak sortuje backend.
      setFireStations((currentStations) =>
        [...currentStations, createdFireStation].sort(
          (firstStation, secondStation) =>
            firstStation.name.localeCompare(secondStation.name, "pl"),
        ),
      );

      setForm(initialForm);
      setSuccess(`Dodano jednostkę ${createdFireStation.name}.`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // "1945-05-12" -> "12.05.1945".
  // T00:00:00 wymusza czas lokalny – bez tego data mogłaby się przesunąć o dzień.
  const formatDate = (date) => {
    if (!date) {
      return "Brak danych";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("pl-PL");
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
          <Building2 size={26} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jednostki OSP</h1>

          <p className="mt-1 text-slate-500">
            Dodawaj jednostki dostępne w aplikacji.
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
        {/* ===== Lewa kolumna: formularz ===== */}
        <section
          className="
            h-fit rounded-xl border border-slate-200
            bg-white p-6 shadow-sm
          "
        >
          <div className="mb-5 flex items-center gap-3">
            <Plus size={21} className="text-red-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Dodaj jednostkę
            </h2>
          </div>

          {/* onSubmit łapie zarówno kliknięcie przycisku, jak i Enter */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nazwa – pole kontrolowane: wartość z form.name, zmiany przez handleChange */}
            <label className="block">
              <span
                className="
                  mb-2 block text-sm font-medium
                  text-slate-700
                "
              >
                Nazwa jednostki
              </span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Np. OSP Barlinek"
                maxLength={255}
                required
                className="
                  w-full rounded-lg border border-slate-300
                  px-3 py-2.5 outline-none transition
                  focus:border-red-500
                  focus:ring-2 focus:ring-red-100
                "
              />
            </label>

            {/* Data założenia – opcjonalna; max blokuje daty z przyszłości */}
            <label className="block">
              <span
                className="
                  mb-2 block text-sm font-medium
                  text-slate-700
                "
              >
                Data założenia
              </span>

              <input
                type="date"
                name="establishmentDate"
                value={form.establishmentDate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="
                  w-full rounded-lg border border-slate-300
                  px-3 py-2.5 outline-none transition
                  focus:border-red-500
                  focus:ring-2 focus:ring-red-100
                "
              />

              <p className="mt-2 text-xs text-slate-400">
                Pole nie jest obowiązkowe.
              </p>
            </label>

            {/* Gmina – opcje z /api/municipalities; value="" oznacza "nic nie wybrano" */}
            <label className="block">
              <span
                className="
                  mb-2 block text-sm font-medium
                  text-slate-700
                "
              >
                Gmina
              </span>

              <select
                name="municipalityId"
                value={form.municipalityId}
                onChange={handleChange}
                required
                className="
                  w-full rounded-lg border border-slate-300
                  px-3 py-2.5 outline-none transition
                  focus:border-red-500
                  focus:ring-2 focus:ring-red-100
                "
              >
                <option value="">Wybierz gminę</option>
                {municipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name}
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
              {saving ? "Dodawanie..." : "Dodaj jednostkę"}
            </button>
          </form>
        </section>

        {/* ===== Prawa kolumna: lista jednostek ===== */}
        <section
          className="
            overflow-hidden rounded-xl
            border border-slate-200
            bg-white shadow-sm
          "
        >
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Lista jednostek
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Liczba jednostek: {fireStations.length}
            </p>
          </div>

          {/* Trzy stany: ładowanie → pusta lista → lista z danymi */}
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Pobieranie jednostek...
            </div>
          ) : fireStations.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 size={38} className="mx-auto mb-3 text-slate-300" />

              <p className="font-medium text-slate-700">Brak jednostek</p>

              <p className="mt-1 text-sm text-slate-400">
                Dodaj pierwszą jednostkę za pomocą formularza.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {fireStations.map((station) => (
                // key = stabilne ID z bazy, żeby React rozpoznawał elementy listy
                <article
                  key={station.id}
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
                    <Building2 size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {station.name}
                    </h3>

                    {/* Gmina przychodzi z backendu jako obiekt { id, name } */}
                    <h4 className="mt-1 text-sm text-slate-500">
                      Gmina:{" "}
                      {station.municipality
                        ? station.municipality.name
                        : "Brak danych"}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Data założenia: {formatDate(station.establishmentDate)}
                    </p>
                  </div>

                  <span
                    className="
                      rounded-full bg-slate-100
                      px-3 py-1 text-xs
                      font-medium text-slate-500
                    "
                  >
                    ID: {station.id}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
