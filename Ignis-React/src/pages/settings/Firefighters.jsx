import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Firefighters() {
  const [firefighters, setFirefighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { hasRole } = useAuth();
  const isSuperAdmin = hasRole("ROLE_SUPER_ADMIN");

  useEffect(() => {
    const fetchFirefighters = async () => {
      try {
        const response = await apiFetch("/api/firefighters");

        if (!response.ok) {
          setError("Nie udało się pobrać listy strażaków");
          return;
        }

        const data = await response.json();
        setFirefighters(data);
      } catch (error) {
        console.error("Błąd pobierania strażaków:", error);
        setError("Wystąpił błąd podczas pobierania danych");
      } finally {
        setLoading(false);
      }
    };

    fetchFirefighters();
  }, []);

  if (loading) {
    return <p>Ładowanie strażaków...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-2xl font-bold">Strażacy</h1>

      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-700 bg-gray-800 shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-left text-gray-100">
              <th className="p-3">ID</th>

              <th className="p-3">Imię i nazwisko</th>
              <th className="p-3">Status</th>
              {isSuperAdmin && <th className="p-3">Jednostka</th>}
              <th className="p-3"> </th>
            </tr>
          </thead>

          <tbody>
            {firefighters.map((firefighter) => (
              <tr
                key={firefighter.id}
                className="border-t border-gray-700 hover:bg-gray-700"
              >
                <td className="p-3">{firefighter.id}</td>

                <td className="p-3">
                  {firefighter.name} {firefighter.lastname}
                </td>
                {isSuperAdmin && (
                  <td className="p-3">{firefighter.fireStation}</td>
                )}

                <td className="p-3">
                  <Pencil size={18} className="text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Firefighters;
