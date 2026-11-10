import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Plus } from "lucide-react";

import { apiFetch } from "../../api/api.js";

/*
  Początkowy stan formularza.

  Trzymamy go w osobnej stałej, ponieważ używamy go:
  1. przy pierwszym uruchomieniu komponentu,
  2. po poprawnym dodaniu jednostki, aby wyczyścić formularz.
*/
const initialForm = {
  name: "",
  establishmentDate: "",
};

export default function FireStations() {
  /*
    Lista jednostek pobrana z backendu.

    Początkowo jest pusta:
    []
  */
  const [fireStations, setFireStations] = useState([]);

  /*
    Dane aktualnie wpisane w formularzu.

    Przykładowy stan:
    {
      name: "OSP Barlinek",
      establishmentDate: "1945-05-12"
    }
  */
  const [form, setForm] = useState(initialForm);

  /*
    loading informuje, czy trwa pobieranie listy jednostek.

    Dzięki temu zamiast pustej strony możemy wyświetlić:
    "Pobieranie jednostek..."
  */
  const [loading, setLoading] = useState(true);

  /*
    saving informuje, czy trwa zapisywanie nowej jednostki.

    Używamy go między innymi do:
    - zablokowania przycisku,
    - zmiany napisu na "Dodawanie...".
  */
  const [saving, setSaving] = useState(false);

  /*
    error przechowuje komunikat błędu.

    Gdy jest pustym tekstem:
    ""

    komunikat nie zostaje wyświetlony.
  */
  const [error, setError] = useState("");

  /*
    success przechowuje komunikat sukcesu po dodaniu jednostki.
  */
  const [success, setSuccess] = useState("");

  /*
    useEffect uruchamia się po pierwszym wyświetleniu komponentu.

    Pusta tablica zależności:
    []

    oznacza, że efekt wykona się tylko raz, po wejściu na stronę.
  */
  useEffect(() => {
    loadFireStations();
  }, []);

  /*
    Funkcja pobierająca wszystkie jednostki z backendu.
  */
  const loadFireStations = async () => {
    try {
      /*
        Rozpoczynamy pobieranie danych.
      */
      setLoading(true);

      /*
        Czyścimy poprzedni komunikat błędu.
      */
      setError("");

      /*
        Wysyłamy request:

        GET /api/fire-stations

        apiFetch powinien automatycznie dołączyć token użytkownika.
      */
      const response = await apiFetch("/api/fire-stations");

      /*
        response.ok jest równe true dla odpowiedzi HTTP 200–299.

        Przykładowo:
        200 OK       → true
        201 Created  → true
        400          → false
        403          → false
        500          → false
      */
      if (!response.ok) {
        throw new Error("Nie udało się pobrać jednostek");
      }

      /*
        Zamieniamy odpowiedź JSON na dane JavaScript.

        Backend powinien zwrócić tablicę:

        [
          {
            id: 1,
            name: "OSP Barlinek",
            establishmentDate: "1945-05-12"
          }
        ]
      */
      const data = await response.json();

      /*
        Zapisujemy pobrane jednostki w stanie komponentu.

        Zmiana stanu powoduje ponowne renderowanie komponentu.
      */
      setFireStations(data);
    } catch (error) {
      /*
        Ten fragment wykonuje się, gdy wystąpi błąd.

        error.message zawiera tekst przekazany do:

        throw new Error("...")
      */
      setError(error.message);
    } finally {
      /*
        finally wykonuje się zawsze:
        - po sukcesie,
        - po błędzie.

        Kończymy więc stan ładowania.
      */
      setLoading(false);
    }
  };

  /*
    Jedna funkcja obsługująca zmianę wszystkich pól formularza.

    Dla inputa:
    name="name"

    zmieni:
    form.name

    Dla inputa:
    name="establishmentDate"

    zmieni:
    form.establishmentDate
  */
  const handleChange = (event) => {
    /*
      event.target oznacza element formularza,
      który właśnie został zmieniony.

      Przykładowo dla nazwy:

      name  = "name"
      value = "OSP Barlinek"
    */
    const { name, value } = event.target;

    /*
      currentForm to poprzednia wartość formularza.

      Operator:
      ...currentForm

      kopiuje wszystkie dotychczasowe pola.

      Zapis:
      [name]: value

      oznacza dynamiczny wybór pola.

      Gdy name === "name", JavaScript wykona:

      name: value

      Gdy name === "establishmentDate", wykona:

      establishmentDate: value
    */
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  /*
    Funkcja próbuje odczytać komunikat błędu zwrócony przez backend.

    Backend może zwrócić na przykład:

    {
      "message": "Jednostka już istnieje"
    }

    albo:

    {
      "detail": "Jednostka już istnieje"
    }
  */
  const readErrorMessage = async (response) => {
    /*
      response.json() może zakończyć się błędem,
      jeżeli backend zwróci zwykły tekst albo pustą odpowiedź.

      Dlatego używamy:
      .catch(() => null)
    */
    const data = await response.json().catch(() => null);

    /*
      Operator ?? wybiera pierwszą wartość,
      która nie jest null ani undefined.

      Kolejność:
      1. data.message
      2. data.detail
      3. nasz domyślny komunikat
    */
    return data?.message ?? data?.detail ?? "Nie udało się dodać jednostki";
  };

  /*
    Funkcja wykonywana po wysłaniu formularza.
  */
  const handleSubmit = async (event) => {
    /*
      Domyślnie formularz HTML przeładowuje stronę.

      preventDefault() zatrzymuje to zachowanie,
      dzięki czemu request obsługujemy w React.
    */
    event.preventDefault();

    /*
      Czyścimy stare komunikaty.
    */
    setError("");
    setSuccess("");

    /*
      trim() usuwa spacje z początku i końca tekstu.

      Przykład:

      "  OSP Barlinek  "

      po trim():

      "OSP Barlinek"
    */
    const normalizedName = form.name.trim();

    /*
      Dodatkowa walidacja po stronie frontendu.

      HTML ma również required, ale warto sprawdzić dane
      przed wysłaniem requestu.
    */
    if (!normalizedName) {
      setError("Nazwa jednostki jest wymagana");
      return;
    }

    try {
      /*
        Informujemy interfejs, że trwa zapis.
      */
      setSaving(true);

      /*
        Wysyłamy request:

        POST /api/fire-stations
      */
      const response = await apiFetch("/api/fire-stations", {
        method: "POST",

        /*
          JSON.stringify zamienia obiekt JavaScript na tekst JSON.

          Obiekt:

          {
            name: "OSP Barlinek"
          }

          zostanie wysłany jako:

          {
            "name": "OSP Barlinek"
          }
        */
        body: JSON.stringify({
          name: normalizedName,

          /*
            Gdy data została wybrana, wysyłamy ją.

            Gdy pole jest puste, wysyłamy null.
          */
          establishmentDate: form.establishmentDate || null,
        }),
      });

      /*
        Gdy backend zwróci błąd, próbujemy odczytać
        dokładny komunikat.
      */
      if (!response.ok) {
        const message = await readErrorMessage(response);

        /*
          Rzucenie błędu powoduje przejście do catch.
        */
        throw new Error(message);
      }

      /*
        Backend zwraca utworzoną jednostkę,
        razem z ID wygenerowanym przez bazę.

        Przykład:

        {
          id: 4,
          name: "OSP Barlinek",
          establishmentDate: "1945-05-12"
        }
      */
      const createdFireStation = await response.json();

      /*
        Dodajemy nową jednostkę do aktualnej listy.

        Nie musimy ponownie pobierać całej listy z backendu,
        ponieważ backend zwrócił utworzony rekord.
      */
      setFireStations((currentStations) =>
        /*
          Tworzymy nową tablicę:

          [
            ...stare jednostki,
            nowa jednostka
          ]
        */
        [...currentStations, createdFireStation].sort(
          /*
            Sortujemy jednostki alfabetycznie po nazwie.

            localeCompare(..., "pl")
            uwzględnia polskie zasady sortowania.
          */
          (firstStation, secondStation) =>
            firstStation.name.localeCompare(secondStation.name, "pl"),
        ),
      );

      /*
        Czyścimy formularz po poprawnym zapisie.
      */
      setForm(initialForm);

      /*
        Pokazujemy użytkownikowi komunikat sukcesu.
      */
      setSuccess(`Dodano jednostkę ${createdFireStation.name}.`);
    } catch (error) {
      /*
        Obsługujemy błędy:
        - backendu,
        - sieci,
        - odczytu danych.
      */
      setError(error.message);
    } finally {
      /*
        Niezależnie od wyniku kończymy stan zapisywania.
      */
      setSaving(false);
    }
  };

  /*
    Funkcja formatująca datę do polskiego formatu.

    Backend zwraca:
    1945-05-12

    Użytkownik zobaczy:
    12.05.1945
  */
  const formatDate = (date) => {
    /*
      Jeżeli data nie została podana, pokazujemy komunikat.
    */
    if (!date) {
      return "Brak danych";
    }

    /*
      Dodajemy T00:00:00, aby JavaScript potraktował datę
      jako lokalną północ.

      Bez tego w niektórych strefach czasowych data
      mogłaby przesunąć się o jeden dzień.
    */
    return new Date(`${date}T00:00:00`).toLocaleDateString("pl-PL");
  };

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-8">
      {/*
        Link powrotny do głównej strony ustawień.
      */}
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

      {/*
        Nagłówek strony.
      */}
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

      {/*
        Warunkowe renderowanie błędu.

        Jeżeli error jest pusty:
        ""

        ten fragment nie zostanie wyświetlony.
      */}
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

      {/*
        Warunkowe renderowanie komunikatu sukcesu.
      */}
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

      {/*
        Układ dwóch kolumn.

        Na dużych ekranach:
        - lewa kolumna ma 380px,
        - prawa zajmuje pozostałe miejsce.

        Na małych ekranach elementy układają się jeden pod drugim.
      */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/*
          Lewa kolumna — formularz dodawania jednostki.
        */}
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

          {/*
            onSubmit uruchamia handleSubmit po kliknięciu przycisku
            albo po naciśnięciu Enter.
          */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span
                className="
                  mb-2 block text-sm font-medium
                  text-slate-700
                "
              >
                Nazwa jednostki
              </span>

              {/*
                Jest to kontrolowany input.

                React przechowuje jego wartość w:
                form.name

                Każda zmiana uruchamia:
                handleChange
              */}
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
                /*
                  max ustawia dzisiejszą datę jako maksymalną.

                  Dzięki temu użytkownik nie może wybrać
                  przyszłej daty założenia.
                */
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

            <button
              type="submit"
              /*
                Podczas zapisywania blokujemy przycisk.

                Zapobiega to wysłaniu formularza kilka razy.
              */
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

              {/*
                Warunkowo zmieniamy tekst przycisku.
              */}
              {saving ? "Dodawanie..." : "Dodaj jednostkę"}
            </button>
          </form>
        </section>

        {/*
          Prawa kolumna — lista istniejących jednostek.
        */}
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

          {/*
            Renderujemy jeden z trzech stanów:

            1. trwa ładowanie,
            2. lista jest pusta,
            3. lista zawiera jednostki.
          */}
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
            /*
              Gdy mamy jednostki, mapujemy tablicę.

              Dla każdego elementu tworzymy osobny <article>.
            */
            <div className="divide-y divide-slate-200">
              {fireStations.map((station) => (
                /*
                  key pomaga Reactowi rozpoznawać elementy listy.

                  Najlepiej używać stabilnego, unikalnego ID z bazy.
                */
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
