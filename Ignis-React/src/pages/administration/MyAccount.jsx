import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { Input, Select } from "../../components/Inputs.jsx";
import { Button } from "../../components/Button.jsx";
import { Avatar } from "../../components/Avatar.jsx";

export default function MyAccount() {
  const [firefighter, setFirefighter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentFirefighter = async () => {
      try {
        const response = await apiFetch("/api/firefighters/me");

        if (!response.ok) {
          setError("Nie udało się pobrać danych użytkownika");
          return;
        }

        const data = await response.json();
        setFirefighter(data);
      } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error);
        setError("Wystąpił błąd podczas pobierania danych");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentFirefighter();
  }, []);

  const formatRole = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Administrator";
      case "ROLE_USER":
        return "Użytkownik";
      default:
        return role;
    }
  };

  const isAdmin = firefighter?.roles?.includes("ROLE_ADMIN");

  if (loading) {
    return <p className="p-6 text-gray-100">Ładowanie danych użytkownika...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }
  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-2xl font-bold">Moje konto</h1>

      {firefighter && (
        <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow">
          <p>
            <span className="font-semibold">Login:</span> {firefighter.login}
          </p>
          <p>
            <span className="font-semibold">Imię:</span> {firefighter.name}
          </p>
          <p>
            <span className="font-semibold">Nazwisko:</span>{" "}
            {firefighter.lastname}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {firefighter.email}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {firefighter.status}
          </p>
          <p>
            <span className="font-semibold">Jednostka:</span>{" "}
            {firefighter.fireStation}
          </p>
          <p>
            <span className="font-semibold">Rola:</span>{" "}
            {firefighter.roles?.map(formatRole).join(", ")}
          </p>
          {isAdmin && (
            <button
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={() => console.log("Kliknięto przycisk administratora")}
            >
              Panel administratora
            </button>
          )}
        </div>
      )}
    </div>
  );
}
