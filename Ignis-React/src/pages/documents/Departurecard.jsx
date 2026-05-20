import { Card, CardBody, CardHeader } from "../../components/Card";
import TimeInput from "../../components/TimeInput";
import DateInput from "../../components/DateInput";
import SelectInput from "../../components/SelectInput";
import React, { useMemo, useState, useEffect } from "react";
import CrewCar from "../../components/DepartureCard/CarCrewCard";
import { apiFetch } from "../../api/api";
import AddItemModal from "../../components/AddItemModal";

const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const emptyCrew = (n) => ({
  driver: "",
  commander: "",
  firefighters: Array(n).fill(""),
});

const collectUsed = (crews) => {
  const s = new Set();
  for (const id in crews) {
    const c = crews[id];
    if (!c) continue;
    if (c.driver) s.add(c.driver);
    if (c.commander) s.add(c.commander);
    (c.firefighters || []).forEach((f) => f && s.add(f));
  }
  return s;
};

export default function DepartureCard({
  vehicles = [
    { id: "499z01", title: "499z01", firefightersCount: 4 },
    { id: "499z02", title: "499z02", firefightersCount: 2 },
    { id: "499z03", title: "499z03", firefightersCount: 6 },
  ],
}) {
  const [locations, setLocations] = useState([]);
  const [streets, setStreets] = useState([]);

  const [location, setLocation] = useState("");
  const [street, setStreet] = useState("");

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingStreets, setLoadingStreets] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);

        const response = await apiFetch("/api/cities");

        if (!response.ok) {
          console.error("Nie udało się pobrać miejscowości");
          return;
        }

        const data = await response.json();

        const cityOptions = data.map((city) => ({
          value: city.id,
          label: city.name,
        }));

        setLocations(cityOptions);
      } catch (error) {
        console.error("Błąd pobierania miejscowości:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (!location) {
      setStreets([]);
      setStreet("");
      return;
    }

    const fetchStreets = async () => {
      try {
        setLoadingStreets(true);

        const response = await apiFetch(`/api/streets?cityId=${location}`);

        if (!response.ok) {
          console.error("Nie udało się pobrać ulic");
          return;
        }

        const data = await response.json();

        const streetOptions = data.map((street) => ({
          value: street.id,
          label: street.name,
        }));

        setStreets(streetOptions);
        setStreet("");
      } catch (error) {
        console.error("Błąd pobierania ulic:", error);
      } finally {
        setLoadingStreets(false);
      }
    };

    fetchStreets();
  }, [location]);

  // stan: id pojazdu -> jego obsada
  const [crews, setCrews] = useState(() =>
    Object.fromEntries(
      vehicles.map((v) => [v.id, emptyCrew(v.firefightersCount)]),
    ),
  );

  // wszyscy już użyci (we wszystkich wozach)
  const usedAll = useMemo(() => collectUsed(crews), [crews]);

  // exclude dla danej karty = wszyscy użyci poza jej własnymi wyborami
  const excludeFor = (id) => {
    const copy = new Set(usedAll);
    const c = crews[id];
    if (c) {
      [c.driver, c.commander, ...(c.firefighters || [])]
        .filter(Boolean)
        .forEach((p) => copy.delete(p)); // nie wykluczaj własnych aktualnych wyborów
    }
    return [...copy];
  };

  const handleChange = (id, value) => {
    setCrews((prev) => ({ ...prev, [id]: value }));
  };
  const id = "reporter";
  const _label = "Zgłaszający";
  const _placeholder = "Wpisz nazwisko…";
  const [value, setValue] = React.useState("");
  const reporters = [
    "Kowalski",
    "Nowak",
    "Wiśniewski",
    "Zieliński",
    "Lewandowski",
  ];
  const [timeDeparture, setTimeDeparture] = React.useState("18:30");
  const [timeArrival, setTimeArrival] = React.useState("18:30");
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);
  const [date, setDate] = React.useState(toISODate(today));

  const [distance, setDistance] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [reason, setReason] = React.useState("");

  const [_crew, _setCrew] = useState({
    driver: "",
    commander: "",
    firefighters: Array(4).fill(""),
  });

  const distances = [
    { value: "5", label: "5 km" },
    { value: "10", label: "10 km" },
    { value: "20", label: "20 km" },
  ];

  const categories = [
    { value: "traffic", label: "Wypadek drogowy" },
    { value: "fire", label: "Pożar" },
    { value: "medical", label: "Pomoc medyczna" },
  ];

  const reasons = [
    { value: "alarm", label: "Alarm" },
    { value: "false_alarm", label: "Fałszywy alarm" },
    { value: "assistance", label: "Pomoc innym służbom" },
  ];

  const handleAddCity = async () => {
    setCityModalError("");

    if (!newCityName.trim()) {
      setCityModalError("Podaj nazwę miejscowości.");
      return;
    }

    try {
      const response = await apiFetch("/api/cities", {
        method: "POST",
        body: JSON.stringify({
          name: newCityName.trim(),
        }),
      });

      if (response.status === 409) {
        const message = await response.text();
        setCityModalError(message);
        return;
      }

      if (!response.ok) {
        setCityModalError("Nie udało się dodać miejscowości.");
        return;
      }

      const newCity = await response.json();

      const newOption = {
        value: newCity.id,
        label: newCity.name,
      };

      setLocations((prev) => [...prev, newOption]);
      setLocation(String(newCity.id));

      setNewCityName("");
      setCityModalError("");
      setCityModalOpen(false);
    } catch (error) {
      console.error("Błąd dodawania miejscowości:", error);
      setCityModalError("Wystąpił błąd podczas dodawania miejscowości.");
    }
  };

  const handleAddStreet = async () => {
    setStreetModalError("");

    if (!location) {
      setStreetModalError("Najpierw wybierz miejscowość.");
      return;
    }

    if (!newStreetName.trim()) {
      setStreetModalError("Podaj nazwę ulicy.");
      return;
    }

    try {
      const response = await apiFetch("/api/streets", {
        method: "POST",
        body: JSON.stringify({
          name: newStreetName.trim(),
          cityId: Number(location),
        }),
      });

      if (response.status === 409) {
        const message = await response.text();
        setStreetModalError(message);
        return;
      }

      if (!response.ok) {
        setStreetModalError("Nie udało się dodać ulicy.");
        return;
      }

      const newStreet = await response.json();

      const newOption = {
        value: newStreet.id,
        label: newStreet.name,
      };

      setStreets((prev) => [...prev, newOption]);
      setStreet(String(newStreet.id));

      setNewStreetName("");
      setStreetModalError("");
      setStreetModalOpen(false);
    } catch (error) {
      console.error("Błąd dodawania ulicy:", error);
      setStreetModalError("Wystąpił błąd podczas dodawania ulicy.");
    }
  };

  const [cityModalOpen, setCityModalOpen] = React.useState(false);
  const [streetModalOpen, setStreetModalOpen] = React.useState(false);

  const [newCityName, setNewCityName] = React.useState("");
  const [newStreetName, setNewStreetName] = React.useState("");

  const [cityModalError, setCityModalError] = React.useState("");
  const [streetModalError, setStreetModalError] = React.useState("");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 items-start auto-rows-auto">
        <Card>
          <CardBody className="p-4">
            <div className="w-full flex items-center gap-3">
              <label className="shrink-0 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">
                Numer wyjazdu:
              </label>

              <input
                id={id}
                className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                placeholder="Wpisz numer wyjazdu ..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              <datalist id={`${id}-list`}>
                {reporters.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>

            <TimeInput
              className="mt-5"
              value={timeDeparture}
              onChange={setTimeDeparture}
              label="Godzina rozpoczęcia: "
              minuteStep={5} // np. skok co 5 min
              min="06:00"
              max="22:00"
            />

            <TimeInput
              className="mt-5"
              value={timeArrival}
              onChange={setTimeArrival}
              label="Godzina zakończenia: "
              minuteStep={5} // np. skok co 5 min
              min="06:00"
              max="22:00"
            />

            <DateInput
              className="mt-5"
              value={date}
              onChange={setDate}
              label="Data zdarzenia: "
              dayStep={1}
              min={toISODate(today)}
              max={toISODate(nextYear)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={location}
                  onChange={setLocation}
                  options={locations}
                  label="Miejscowość: "
                  placeholder={
                    loadingCities
                      ? "Ładowanie miejscowości..."
                      : "— wybierz miejscowość —"
                  }
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setCityModalOpen(true)}
                className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                title="Dodaj miejscowość"
              >
                +
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={street}
                  onChange={setStreet}
                  options={streets}
                  label="Ulica: "
                  placeholder={
                    !location
                      ? "— najpierw wybierz miejscowość —"
                      : loadingStreets
                        ? "Ładowanie ulic..."
                        : "— wybierz ulicę —"
                  }
                  required
                  disabled={!location || loadingStreets}
                />
              </div>

              <button
                type="button"
                onClick={() => setStreetModalOpen(true)}
                disabled={!location}
                className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
                title="Dodaj ulicę"
              >
                +
              </button>
            </div>

            <SelectInput
              className="mt-5"
              value={distance}
              onChange={setDistance}
              options={distances}
              label="Liczba kilometrów: "
              placeholder="— wybierz liczbę kilometrów —"
              required
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <SelectInput
              value={category}
              onChange={setCategory}
              options={categories}
              label="Kategoria: "
              placeholder="— wybierz kategorię —"
              required
            />
            <SelectInput
              className="mt-5"
              value={reason}
              onChange={setReason}
              options={reasons}
              label="Powód: "
              placeholder="— wybierz powód —"
              required
            />
          </CardBody>
        </Card>
        <Card className="lg:col-span-3 lg:row-start-2">
          <CardBody className="p-4">
            <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-4">
              {vehicles.map((v) => (
                <CrewCar
                  key={v.id}
                  title={v.title}
                  teams={reporters} // ta sama lista dla wszystkich
                  value={crews[v.id]}
                  onChange={(val) => handleChange(v.id, val)}
                  firefightersCount={v.firefightersCount}
                  exclude={excludeFor(v.id)} // ⬅️ globalne wykluczenia
                />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <AddItemModal
        open={cityModalOpen}
        title="Dodaj miejscowość"
        label="Nazwa miejscowości"
        placeholder="Np. Barlinek"
        value={newCityName}
        onChange={(value) => {
          setNewCityName(value);
          setCityModalError("");
        }}
        onClose={() => {
          setCityModalOpen(false);
          setNewCityName("");
          setCityModalError("");
        }}
        onSave={handleAddCity}
        error={cityModalError}
      />

      <AddItemModal
        open={streetModalOpen}
        title="Dodaj ulicę"
        label="Nazwa ulicy"
        placeholder="Np. Boczna"
        value={newStreetName}
        onChange={(value) => {
          setNewStreetName(value);
          setStreetModalError("");
        }}
        onClose={() => {
          setStreetModalOpen(false);
          setNewStreetName("");
          setStreetModalError("");
        }}
        onSave={handleAddStreet}
        disabled={!location}
        error={streetModalError}
      />
    </>
  );
}
