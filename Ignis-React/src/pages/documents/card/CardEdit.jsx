import { Card, CardBody } from "../../../components/Card";
import TimeInput from "../../../components/TimeInput";
import DateInput from "../../../components/DateInput";
import SelectInput from "../../../components/SelectInput";
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CrewCar from "../../../components/DepartureCard/CarCrewCard";
import { apiFetch } from "../../../api/api";
import AddItemModal from "../../../components/AddItemModal";

const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
};

// Helper functions for crew management
const getFirefighterSlots = (places) => {
  const placesNumber = Number(places);

  if (!Number.isFinite(placesNumber)) {
    return 0;
  }

  return Math.max(placesNumber - 2, 0);
};

const emptyCrew = (n) => {
  const count = Number(n);

  if (!Number.isFinite(count)) {
    return {
      driver: "",
      commander: "",
      firefighters: [],
    };
  }

  return {
    driver: "",
    commander: "",
    firefighters: Array(Math.max(count, 0)).fill(""),
  };
};

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

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getCrewMemberId = (member) => {
  const id = member.firefighterId ?? member.id;

  return id != null ? String(id) : "";
};

const getCrewMemberFunction = (member) => {
  return normalizeText(
    member.functionName ??
      member.typeFunctionName ??
      member.roleName ??
      member.role ??
      member.function ??
      "",
  );
};

const mapVehicleCrewToFormCrew = (vehicleCrew) => {
  const crewMembers = vehicleCrew.crew ?? vehicleCrew.firefighters ?? [];

  let driver = "";
  let commander = "";
  const firefighters = [];

  crewMembers.forEach((member) => {
    const firefighterId = getCrewMemberId(member);
    const functionName = getCrewMemberFunction(member);

    if (!firefighterId) {
      return;
    }

    if (functionName.includes("kierowca")) {
      driver = firefighterId;
      return;
    }

    if (functionName.includes("dowodca")) {
      commander = firefighterId;
      return;
    }

    firefighters.push(firefighterId);
  });

  return {
    driver,
    commander,
    firefighters,
  };
};

const getVehicleIdFromCardVehicle = (vehicleCrew) => {
  const vehicleId =
    vehicleCrew.vehicleId ??
    vehicleCrew.garageId ??
    vehicleCrew.vehicle?.id ??
    vehicleCrew.garage?.id;

  return vehicleId != null ? String(vehicleId) : "";
};

export default function CardEdit() {
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingCard, setLoadingCard] = useState(true);

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [firefighters, setFirefighters] = useState([]);
  const [loadingFirefighters, setLoadingFirefighters] = useState(false);

  const [departureNumber, setDepartureNumber] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [savedCardId, setSavedCardId] = useState(null);

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

  const [distances, setDistances] = useState(
    Array.from({ length: 20 }, (_, index) => {
      const km = index + 1;

      return {
        value: String(km),
        label: `${km} km`,
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

  const [pendingStreetId, setPendingStreetId] = useState("");
  const [pendingReasonId, setPendingReasonId] = useState("");

  const [crews, setCrews] = useState({});

  useEffect(() => {
    const fetchCardToEdit = async () => {
      try {
        setLoadingCard(true);

        const response = await apiFetch(`/api/departure-cards/${id}`);

        if (!response.ok) {
          console.error("Nie udało się pobrać karty do edycji.");
          return;
        }

        const data = await response.json();

        console.log("KARTA DO EDYCJI:", data);
        console.log("POJAZDY I ZAŁOGA Z KARTY:", data.vehicles ?? data.vehicle);

        setDepartureNumber(String(data.departureNumber ?? ""));
        setDate(data.departureDate ?? "");

        setTimeDeparture(
          data.hourDeparture ? data.hourDeparture.slice(0, 5) : "",
        );
        setTimeArrival(data.hourReturn ? data.hourReturn.slice(0, 5) : "");

        setPendingStreetId(data.streetId != null ? String(data.streetId) : "");
        setPendingReasonId(
          data.incidentId != null ? String(data.incidentId) : "",
        );

        setLocation(data.cityId != null ? String(data.cityId) : "");
        setCategory(
          data.incidentTypeId != null ? String(data.incidentTypeId) : "",
        );

        if (data.trip != null) {
          const tripValue = String(data.trip);

          setDistances((prev) => {
            const exists = prev.some((option) => option.value === tripValue);

            if (exists) {
              return prev;
            }

            return [
              ...prev,
              {
                value: tripValue,
                label: `${tripValue} km`,
              },
            ].sort((a, b) => Number(a.value) - Number(b.value));
          });

          setDistance(tripValue);
        } else {
          setDistance("");
        }

        const cardVehicles = data.vehicles ?? data.vehicle ?? [];

        const mappedCrews = cardVehicles.reduce((acc, vehicleCrew) => {
          const vehicleId = getVehicleIdFromCardVehicle(vehicleCrew);

          if (!vehicleId) {
            return acc;
          }

          acc[vehicleId] = mapVehicleCrewToFormCrew(vehicleCrew);

          return acc;
        }, {});

        setCrews((prev) => ({
          ...prev,
          ...mappedCrews,
        }));
      } catch (error) {
        console.error("Błąd podczas pobierania karty do edycji:", error);
      } finally {
        setLoadingCard(false);
      }
    };

    fetchCardToEdit();
  }, [id]);
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
          places: vehicle.places,
        }));

        setVehicles(vehicleOptions);

        setCrews((prev) => {
          const updatedCrews = { ...prev };

          vehicleOptions.forEach((vehicle) => {
            const firefighterSlots = getFirefighterSlots(vehicle.places);
            const existingCrew = updatedCrews[vehicle.id];

            if (!existingCrew) {
              updatedCrews[vehicle.id] = emptyCrew(firefighterSlots);
              return;
            }

            updatedCrews[vehicle.id] = {
              driver: existingCrew.driver ?? "",
              commander: existingCrew.commander ?? "",
              firefighters: [
                ...(existingCrew.firefighters ?? []),
                ...Array(firefighterSlots).fill(""),
              ].slice(0, firefighterSlots),
            };
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

  useEffect(() => {
    const fetchFirefighters = async () => {
      try {
        setLoadingFirefighters(true);

        const response = await apiFetch("/api/firefighters");

        if (!response.ok) {
          console.error("Nie udało się pobrać strażaków");
          return;
        }

        const data = await response.json();

        const firefighterOptions = data.map((firefighter) => ({
          value: String(firefighter.id),
          label:
            firefighter.nick ||
            `${firefighter.lastname ?? ""} ${firefighter.name?.charAt(0) ?? ""}`.trim(),
        }));

        setFirefighters(firefighterOptions);
      } catch (error) {
        console.error("Błąd pobierania strażaków:", error);
      } finally {
        setLoadingFirefighters(false);
      }
    };

    fetchFirefighters();
  }, []);

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
        setStreet("");
        setStreets([]);

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
      } catch (error) {
        console.error("Błąd pobierania ulic:", error);
      } finally {
        setLoadingStreets(false);
      }
    };

    fetchStreets();
  }, [location]);

  useEffect(() => {
    if (!pendingStreetId || streets.length === 0) {
      return;
    }

    const streetExists = streets.some(
      (option) => option.value === pendingStreetId,
    );

    if (streetExists) {
      setStreet(pendingStreetId);
    }

    setPendingStreetId("");
  }, [pendingStreetId, streets]);

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

  useEffect(() => {
    if (!pendingReasonId || reasons.length === 0) {
      return;
    }

    const reasonExists = reasons.some(
      (option) => option.value === pendingReasonId,
    );

    if (reasonExists) {
      setReason(pendingReasonId);
    }

    setPendingReasonId("");
  }, [pendingReasonId, reasons]);

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

  const clearFormError = (fieldName) => {
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  const validateDepartureCard = () => {
    const errors = {};

    if (!departureNumber.trim()) {
      errors.departureNumber = "Podaj numer wyjazdu.";
    }

    if (!date) {
      errors.date = "Wybierz datę zdarzenia.";
    }

    if (!timeDeparture) {
      errors.timeDeparture = "Podaj godzinę rozpoczęcia.";
    }

    if (!timeArrival) {
      errors.timeArrival = "Podaj godzinę zakończenia.";
    }

    if (timeDeparture && timeArrival && timeArrival < timeDeparture) {
      errors.timeArrival =
        "Godzina zakończenia nie może być wcześniejsza niż rozpoczęcia.";
    }

    if (!location) {
      errors.location = "Wybierz miejscowość.";
    }

    if (streets.length > 0 && !street) {
      errors.street = "Wybierz ulicę albo dodaj nową.";
    }

    if (!distance) {
      errors.distance = "Wybierz liczbę kilometrów.";
    }

    if (!category) {
      errors.category = "Wybierz kategorię.";
    }

    if (!reason) {
      errors.reason = "Wybierz powód wyjazdu.";
    }

    const selectedVehicles = Object.entries(crews).filter(([_, crew]) => {
      return (
        crew.driver || crew.commander || (crew.firefighters || []).some(Boolean)
      );
    });

    if (selectedVehicles.length === 0) {
      errors.crews = "Uzupełnij obsadę przynajmniej jednego pojazdu.";
    }

    selectedVehicles.forEach(([vehicleId, crew]) => {
      if (!crew.driver) {
        errors[`crew_${vehicleId}_driver`] = "Wybierz kierowcę.";
      }

      if (!crew.commander) {
        errors[`crew_${vehicleId}_commander`] = "Wybierz dowódcę.";
      }
    });

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSaveDepartureCard = async () => {
    const isValid = validateDepartureCard();

    if (!isValid) {
      return;
    }

    const selectedCrews = Object.entries(crews)
      .filter(([_, crew]) => {
        return (
          crew.driver ||
          crew.commander ||
          (crew.firefighters || []).some(Boolean)
        );
      })
      .map(([vehicleId, crew]) => ({
        vehicleId: Number(vehicleId),
        driverId: crew.driver ? Number(crew.driver) : null,
        commanderId: crew.commander ? Number(crew.commander) : null,
        firefighterIds: (crew.firefighters || [])
          .filter(Boolean)
          .map((firefighterId) => Number(firefighterId)),
      }));

    const departureCardData = {
      departureNumber: departureNumber ? Number(departureNumber) : null,
      date,
      timeDeparture,
      timeArrival,
      cityId: location ? Number(location) : null,
      streetId: street ? Number(street) : null,
      distance: distance ? Number(distance) : null,
      incidentId: reason ? Number(reason) : null,
      commanderId: 2,
      typeCardId: 1,
      crews: selectedCrews,
    };

    try {
      const response = await apiFetch(`/api/departure-cards/${id}/revision`, {
        method: "POST",
        body: JSON.stringify(departureCardData),
      });

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Nie udało się zapisać karty wyjazdu.",
        );

        console.error(message);
        return;
      }

      const savedCard = await response.json();

      setSavedCardId(savedCard.id);
      setSuccessMessage("Karta wyjazdu została poprawiona pomyślnie.");
      setSuccessModalOpen(true);

      console.log("Zapisano kartę wyjazdu:", savedCard);
    } catch (error) {
      console.error("Błąd zapisu karty wyjazdu:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);

    if (savedCardId) {
      navigate(`/documents/history/card/${savedCardId}`);
    }
  };

  if (loadingCard) {
    return (
      <div className="p-6 text-center text-zinc-600 dark:text-zinc-300">
        Ładowanie karty do edycji...
      </div>
    );
  }
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
                disabled
                onChange={(e) => {
                  setDepartureNumber(e.target.value);
                  clearFormError("departureNumber");
                }}
              />
              {formErrors.departureNumber && (
                <p className="mt-2 text-sm text-red-600">
                  {formErrors.departureNumber}
                </p>
              )}
            </div>

            <TimeInput
              className="mt-5"
              value={timeDeparture}
              onChange={setTimeDeparture}
              label="Godzina rozpoczęcia: "
              minuteStep={5}
              min="00:00"
              max="23:59"
              error={formErrors.timeDeparture}
            />

            <TimeInput
              className="mt-5"
              value={timeArrival}
              onChange={setTimeArrival}
              label="Godzina zakończenia: "
              minuteStep={5}
              min="00:00"
              max="23:59"
              error={formErrors.timeArrival}
            />

            <DateInput
              className="mt-5"
              value={date}
              onChange={setDate}
              label="Data zdarzenia: "
              dayStep={1}
              min="2000-01-01"
              max={toISODate(nextYear)}
              error={formErrors.date}
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
                  error={formErrors.location}
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
                        : streets.length === 0
                          ? "— brak ulic dla miejscowości —"
                          : "— wybierz ulicę —"
                  }
                  required
                  disabled={!location || loadingStreets}
                  error={formErrors.street}
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
                  error={formErrors.distance}
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
              error={formErrors.category}
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
                  error={formErrors.reason}
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
              {loadingFirefighters && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ładowanie strażaków...
                </p>
              )}

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
                    teams={firefighters}
                    value={
                      crews[vehicle.id] ||
                      emptyCrew(Math.max(Number(vehicle.places) - 2, 0))
                    }
                    onChange={(value) => handleChangeCrew(vehicle.id, value)}
                    places={vehicle.places}
                    exclude={excludeFor(vehicle.id)}
                  />
                ))
              )}
            </div>
            {formErrors.crews && (
              <p className="mt-3 text-sm text-red-600">{formErrors.crews}</p>
            )}
          </CardBody>
        </Card>
        <div className="lg:col-span-3 flex justify-end">
          <button
            type="button"
            onClick={handleSaveDepartureCard}
            className="rounded-xl bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
          >
            Zapisz kartę wyjazdu
          </button>
        </div>
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

      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                ✓
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Sukces
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {successMessage}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCloseSuccessModal}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
              >
                Przejdź do karty
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
