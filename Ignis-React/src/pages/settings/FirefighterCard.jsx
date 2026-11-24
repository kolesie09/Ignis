import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";

function FirefighterCard() {
  const { id } = useParams();
  const [firefighter, setFirefighter] = useState(null);

  const [error, setError] = useState(null);

  const fetchFirefighter = async () => {
    try {
      const response = await apiFetch(`/api/firefighters/${id}`);
      if (!response.ok) {
        setError("Nie udało się pobrać danych strażaka");
        return;
      }

      const data = await response.json();
      setFirefighter(data);
    } catch (error) {
      console.error("Błąd pobierania strażaków:", error);
      setError("Wystąpił błąd podczas pobierania danych");
    }
  };

  useEffect(() => {
    fetchFirefighter();
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!firefighter) return <p>Ładowanie...</p>;
  return (
    <h1>
      Karta strażaka #{id} {firefighter.name}
    </h1>
  );
}

export default FirefighterCard;
