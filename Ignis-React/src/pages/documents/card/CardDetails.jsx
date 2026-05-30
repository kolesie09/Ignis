import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../api/api";
import { Card, CardBody } from "../../../components/Card";

export default function CardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await apiFetch(`/api/departure-cards/${id}`);

        if (!response.ok) {
          throw new Error("Nie udało się pobrać szczegółów karty.");
        }

        const data = await response.json();
        console.log("CARD DETAILS:", data);
        setCard(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return <p className="p-5 text-center">Ładowanie szczegółów karty...</p>;
  }

  if (error) {
    return <p className="p-5 text-center text-red-500">{error}</p>;
  }

  if (!card) {
    return <p className="p-5 text-center">Nie znaleziono karty.</p>;
  }
  const InfoItem = ({ label, value }) => (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value || "Brak danych"}
      </p>
    </div>
  );
  return (
    <Card>
      <CardBody className="p-6 text-zinc-100">
        <button
          onClick={() => navigate("/documents/history")}
          className="mb-5 rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ← Wróć do historii
        </button>
        <div className="mb-8 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Szczegóły dokumentu
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            Karta wyjazdu nr {card.departureNumber}
          </h1>
        </div>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Dane podstawowe
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoItem label="Data wyjazdu" value={card.departureDate} />
            <InfoItem
              label="Godziny"
              value={`${card.hourDeparture?.slice(0, 5)} - ${card.hourReturn?.slice(0, 5)}`}
            />
            <InfoItem label="Miejscowość" value={card.cityName} />
            <InfoItem label="Ulica" value={card.streetName || "Brak"} />
            <InfoItem label="Zdarzenie" value={card.incidentName} />
            <InfoItem label="Typ karty" value={card.typeCardName} />
            <InfoItem label="Dowódca" value={card.commanderName} />
            <InfoItem label="Utworzył" value={card.createdByName} />
          </div>
        </section>
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Pojazdy i obsada
          </h2>

          {card.vehicles?.length > 0 ? (
            <div className="space-y-4">
              {card.vehicles.map((vehicles) => (
                <div
                  key={vehicles.vehicleToCardId}
                  className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
                >
                  <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Pojazd: {vehicles.operationalName}
                  </h3>

                  <div className="space-y-2">
                    {vehicles.crew?.map((person) => (
                      <div
                        key={`${vehicles.vehicleToCardId}-${person.firefighterId}-${person.functionName}`}
                        className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 text-sm dark:bg-zinc-900"
                      >
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {person.fullName}
                        </span>

                        <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {person.functionName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Brak przypisanych pojazdów i obsady.
            </p>
          )}
        </section>
      </CardBody>
    </Card>
  );
}
