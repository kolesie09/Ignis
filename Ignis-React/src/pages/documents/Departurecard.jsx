import { Card, CardBody } from "../../components/Card";
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
  const used = new Set();

  for (const id in crews) {
    const crew = crews[id];

    if (!crew) {
      continue;
    }

    if (crew.driver) {
      used.add(crew.driver);
    }

    if (crew.commander) {
      used.add(crew.commander);
    }

    (crew.firefighters || []).forEach((firefighter) => {
      if (firefighter) {
        used.add(firefighter);
      }
    });
  }

  return used;
};

export default function DepartureCard() {
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [departureNumber, setDepartureNumber] = useState("");

  const [timeDeparture, setTimeDeparture] = useState("18:30");
  const [timeArrival, setTimeArrival] = useState("18:30");
  const [date, setDate] = useState(toISODate(today));

  const [locations, setLocations] = useState([]);
  const [streets, setStreets] = useState([]);

  const [location, setLocation] = useState("");
  const [street, setStreet] = useState("");

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingStreets, setLoadingStreets] = useState(false);

  const [distance, setDistance] = useState("");
  const [distances, setDistances] = useState(() =>
    Array.from({ length: 20 }, (_, index) => {
      const value = String(index + 1);

      return {
        value,
        label: `${value} km`,
      };
    }),
  );

  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");

  const [categories, setCategories] = useState([]);
  const [reasons, setReasons] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingReasons, setLoadingReasons] = useState(false);

  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [streetModalOpen, setStreetModalOpen] = useState(false);
  const [distanceModalOpen, setDistanceModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);

  const [newCityName, setNewCityName] = useState("");
  const [newStreetName, setNewStreetName] = useState("");
  const [newDistanceValue, setNewDistanceValue] = useState("");
  const [newReasonName, setNewReasonName] = useState("");

  const [cityModalError, setCityModalError] = useState("");
  const [streetModalError, setStreetModalError] = useState("");
  const [distanceModalError, setDistanceModalError] = useState("");
  const [reasonModalError, setReasonModalError] = useState("");

  const reporters = [
    "Kowalski",
    "Nowak",
    "Wiśniewski",
    "Zieliński",
    "Lewandowski",
  ];

  const [crews, setCrews] = useState({});

  // Fetch vehicles on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true);

        const response = await apiFetch("/api/vehicles");

        if (!response.ok) {
          console.error("Nie udało się pobrać pojazdów");
          return;
        }

        const data = await response.json();

        const vehicleOptions = data.map((vehicle) => ({
          id: String(vehicle.id),
          title: vehicle.title,
          firefightersCount: vehicle.firefightersCount,
        }));

        setVehicles(vehicleOptions);

        setCrews((prev) => {
          const updatedCrews = { ...prev };

          vehicleOptions.forEach((vehicle) => {
            if (!updatedCrews[vehicle.id]) {
              updatedCrews[vehicle.id] = emptyCrew(vehicle.firefightersCount);
            }
          });

          return updatedCrews;
        });
      } catch (error) {
        console.error("Błąd pobierania pojazdów:", error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  const usedAll = useMemo(() => collectUsed(crews), [crews]);

  const excludeFor = (vehicleId) => {
    const excluded = new Set(usedAll);
    const crew = crews[vehicleId];

    if (crew) {
      [crew.driver, crew.commander, ...(crew.firefighters || [])]
        .filter(Boolean)
        .forEach((person) => excluded.delete(person));
    }

    return [...excluded];
  };

  const handleChangeCrew = (vehicleId, value) => {
    setCrews((prev) => ({
      ...prev,
      [vehicleId]: value,
    }));
  };

  const getErrorMessage = async (response, fallbackMessage) => {
    try {
      const text = await response.text();

      if (!text) {
        return fallbackMessage;
      }

      return text;
    } catch {
      return fallbackMessage;
    }
  };

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
          value: String(city.id),
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
          value: String(street.id),
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await apiFetch("/api/incident-types");

        if (!response.ok) {
          console.error("Nie udało się pobrać kategorii zdarzeń");
          return;
        }

        const data = await response.json();

        const categoryOptions = data.map((category) => ({
          value: String(category.id),
          label: category.name,
        }));

        setCategories(categoryOptions);
      } catch (error) {
        console.error("Błąd pobierania kategorii zdarzeń:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!category) {
      setReasons([]);
      setReason("");
      return;
    }

    const fetchReasons = async () => {
      try {
        setLoadingReasons(true);

        const response = await apiFetch(
          `/api/incidents?incidentTypeId=${category}`,
        );

        if (!response.ok) {
          console.error("Nie udało się pobrać powodów wyjazdu");
          return;
        }

        const data = await response.json();

        const reasonOptions = data.map((reason) => ({
          value: String(reason.id),
          label: reason.name,
        }));

        setReasons(reasonOptions);
        setReason("");
      } catch (error) {
        console.error("Błąd pobierania powodów wyjazdu:", error);
      } finally {
        setLoadingReasons(false);
      }
    };

    fetchReasons();
  }, [category]);

  const handleAddCity = async () => {
    const trimmedCityName = newCityName.trim();

    setCityModalError("");

    if (!trimmedCityName) {
      setCityModalError("Podaj nazwę miejscowości.");
      return;
    }

    try {
      const response = await apiFetch("/api/cities", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedCityName,
        }),
      });

      if (response.status === 409) {
        const message = await getErrorMessage(
          response,
          "Taka miejscowość już istnieje.",
        );

        setCityModalError(message);
        return;
      }

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Nie udało się dodać miejscowości.",
        );

        setCityModalError(message);
        return;
      }

      const newCity = await response.json();

      const newOption = {
        value: String(newCity.id),
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
    const trimmedStreetName = newStreetName.trim();

    setStreetModalError("");

    if (!location) {
      setStreetModalError("Najpierw wybierz miejscowość.");
      return;
    }

    if (!trimmedStreetName) {
      setStreetModalError("Podaj nazwę ulicy.");
      return;
    }

    try {
      const response = await apiFetch("/api/streets", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedStreetName,
          cityId: Number(location),
        }),
      });

      if (response.status === 409) {
        const message = await getErrorMessage(
          response,
          "Taka ulica już istnieje w wybranej miejscowości.",
        );

        setStreetModalError(message);
        return;
      }

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Nie udało się dodać ulicy.",
        );

        setStreetModalError(message);
        return;
      }

      const newStreet = await response.json();

      const newOption = {
        value: String(newStreet.id),
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

  const handleAddDistance = () => {
    const trimmedDistance = newDistanceValue.trim();

    setDistanceModalError("");

    if (!trimmedDistance) {
      setDistanceModalError("Podaj liczbę kilometrów.");
      return;
    }

    const distanceNumber = Number(trimmedDistance);

    if (!Number.isInteger(distanceNumber)) {
      setDistanceModalError("Liczba kilometrów musi być liczbą całkowitą.");
      return;
    }

    if (distanceNumber <= 0) {
      setDistanceModalError("Liczba kilometrów musi być większa od 0.");
      return;
    }

    const distanceValue = String(distanceNumber);

    const distanceExists = distances.some(
      (distanceOption) => distanceOption.value === distanceValue,
    );

    if (distanceExists) {
      setDistanceModalError("Taka liczba kilometrów już jest na liście.");
      return;
    }

    const newDistanceOption = {
      value: distanceValue,
      label: `${distanceValue} km`,
    };

    setDistances((prev) =>
      [...prev, newDistanceOption].sort(
        (a, b) => Number(a.value) - Number(b.value),
      ),
    );

    setDistance(distanceValue);
    setNewDistanceValue("");
    setDistanceModalError("");
    setDistanceModalOpen(false);
  };

  const handleAddReason = async () => {
    const trimmedReasonName = newReasonName.trim();

    setReasonModalError("");

    if (!category) {
      setReasonModalError("Najpierw wybierz kategorię.");
      return;
    }

    if (!trimmedReasonName) {
      setReasonModalError("Podaj powód wyjazdu.");
      return;
    }

    try {
      const response = await apiFetch("/api/incidents", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedReasonName,
          incidentTypeId: Number(category),
        }),
      });

      if (response.status === 409) {
        const message = await getErrorMessage(
          response,
          "Taki powód już istnieje w wybranej kategorii.",
        );

        setReasonModalError(message);
        return;
      }

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Nie udało się dodać powodu wyjazdu.",
        );

        setReasonModalError(message);
        return;
      }

      const newReason = await response.json();

      const newOption = {
        value: String(newReason.id),
        label: newReason.name,
      };

      setReasons((prev) => [...prev, newOption]);
      setReason(String(newReason.id));

      setNewReasonName("");
      setReasonModalError("");
      setReasonModalOpen(false);
    } catch (error) {
      console.error("Błąd dodawania powodu wyjazdu:", error);
      setReasonModalError("Wystąpił błąd podczas dodawania powodu wyjazdu.");
    }
  };

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
                id="departure-number"
                className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                placeholder="Wpisz numer wyjazdu ..."
                value={departureNumber}
                onChange={(e) => setDepartureNumber(e.target.value)}
              />
            </div>

            <TimeInput
              className="mt-5"
              value={timeDeparture}
              onChange={setTimeDeparture}
              label="Godzina rozpoczęcia: "
              minuteStep={5}
              min="06:00"
              max="22:00"
            />

            <TimeInput
              className="mt-5"
              value={timeArrival}
              onChange={setTimeArrival}
              label="Godzina zakończenia: "
              minuteStep={5}
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
                  disabled={loadingCities}
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

            <div className="mt-5 flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={distance}
                  onChange={setDistance}
                  options={distances}
                  label="Liczba kilometrów: "
                  placeholder="— wybierz liczbę kilometrów —"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setDistanceModalOpen(true)}
                className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                title="Dodaj inną liczbę kilometrów"
              >
                +
              </button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <SelectInput
              value={category}
              onChange={setCategory}
              options={categories}
              label="Kategoria: "
              placeholder={
                loadingCategories
                  ? "Ładowanie kategorii..."
                  : "— wybierz kategorię —"
              }
              disabled={loadingCategories}
              required
            />

            <div className="mt-5 flex items-center gap-2">
              <div className="flex-1">
                <SelectInput
                  value={reason}
                  onChange={setReason}
                  options={reasons}
                  label="Powód: "
                  placeholder={
                    !category
                      ? "— najpierw wybierz kategorię —"
                      : loadingReasons
                        ? "Ładowanie powodów..."
                        : "— wybierz powód —"
                  }
                  disabled={!category || loadingReasons}
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setReasonModalOpen(true)}
                disabled={!category}
                className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
                title="Dodaj powód wyjazdu"
              >
                +
              </button>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-3 lg:row-start-2">
          <CardBody className="p-4">
            <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-4">
              {loadingVehicles ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ładowanie pojazdów...
                </p>
              ) : vehicles.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Brak pojazdów w bazie danych.
                </p>
              ) : (
                vehicles.map((vehicle) => (
                  <CrewCar
                    key={vehicle.id}
                    title={vehicle.title}
                    teams={reporters}
                    value={
                      crews[vehicle.id] || emptyCrew(vehicle.firefightersCount)
                    }
                    onChange={(value) => handleChangeCrew(vehicle.id, value)}
                    firefightersCount={vehicle.firefightersCount}
                    exclude={excludeFor(vehicle.id)}
                  />
                ))
              )}
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

      <AddItemModal
        open={distanceModalOpen}
        title="Dodaj liczbę kilometrów"
        label="Liczba kilometrów"
        placeholder="Np. 25"
        value={newDistanceValue}
        onChange={(value) => {
          setNewDistanceValue(value);
          setDistanceModalError("");
        }}
        onClose={() => {
          setDistanceModalOpen(false);
          setNewDistanceValue("");
          setDistanceModalError("");
        }}
        onSave={handleAddDistance}
        error={distanceModalError}
      />

      <AddItemModal
        open={reasonModalOpen}
        title="Dodaj powód wyjazdu"
        label="Powód wyjazdu"
        placeholder="Np. Pożar sadzy w kominie"
        value={newReasonName}
        onChange={(value) => {
          setNewReasonName(value);
          setReasonModalError("");
        }}
        onClose={() => {
          setReasonModalOpen(false);
          setNewReasonName("");
          setReasonModalError("");
        }}
        onSave={handleAddReason}
        disabled={!category}
        error={reasonModalError}
      />
    </>
  );
}
