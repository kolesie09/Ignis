import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";

export default function MembershipFees() {
  const [membershipFees, setMembershipFees] = useState([]);

  useEffect(() => {
    const fetchMembershipFees = async () => {
      try {
        const response = await apiFetch("/api/membership-fees");

        if (!response.ok) {
          console.error("Nie udało się pobrać danych składek członkowskich");
          return;
        }

        const data = await response.json();

        setMembershipFees(data);
      } catch (error) {
        console.error(
          "Błąd podczas pobierania danych składek członkowskich",
          error,
        );
      }
    };

    fetchMembershipFees();
  }, []);

  return (
    <div className="p-6 text-gray-100 mt-4 rounded-lg border border-gray-700 bg-gray-800 shadow">
      <h1 className="text-2xl font-bold"></h1>

      <h1 className="text-2xl font-bold mb-4">Składki członkowskie</h1>
      <p>
        Tu będzie zawartość dotycząca składek członkowskich.
        {membershipFees.map((r, idx) => (
          <div key={idx}>
            <p>Rok: {r.year}</p>
            <p>Kwota: {r.price}</p>
            <p>Data wpłaty: {r.dateOfPayment}</p>
            <p>Status : {r.statusPayment ? "Zapłacono" : "Nie zapłacono"}</p>
          </div>
        ))}
      </p>
    </div>
  );
}
