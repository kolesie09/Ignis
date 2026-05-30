import React, { useEffect, useState } from "react";
import { Card, CardBody } from "../../components/Card";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/api";

export default function History() {
  const [openRight, setOpenRight] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await apiFetch("/api/departure-cards");

        if (!response.ok) {
          throw new Error("Nie udało się pobrać historii kart.");
        }

        const data = await response.json();
        setCards(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="grid ">
      <Card>
        <CardBody className="overflow-x-auto p-0">
          <h1 className="text-3xl font-semibold text-center p-5 text-zinc-900 dark:text-zinc-100">
            Historia dokumentów
          </h1>
          {loading && (
            <p className="p-5 text-center text-zinc-500">
              Ładowanie historii kart...
            </p>
          )}

          {error && <p className="p-5 text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="py-3 pl-5 pr-6">Karta</th>
                  <th className="py-3 pr-6">Dowódca</th>
                  <th className="py-3 pr-6">Godziny</th>
                  <th className="py-3 pr-6">Data wyjazdu</th>
                  <th className="py-3 pr-5 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {cards.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 ${
                      idx % 2 === 0
                        ? "bg-white dark:bg-zinc-900"
                        : "bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <td className="py-3 pl-5 pr-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          Karta wyjazdu nr {r.departureNumber}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {r.placeName} • {r.incidentName} • {r.typeCardName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-6 text-zinc-900 dark:text-zinc-100">
                      {r.commanderName}{" "}
                    </td>
                    <td className="py-3 pr-6 text-zinc-900 dark:text-zinc-100">
                      {r.hourDeparture?.slice(0, 5)} -{" "}
                      {r.hourReturn?.slice(0, 5)}{" "}
                    </td>
                    <td className="py-3 pr-6 text-zinc-900 dark:text-zinc-100">
                      {r.departureDate}
                    </td>
                    <td className="py-3 pr-5 text-right">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <MenuButton className="p-2 rounded-lg text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <MoreVertical className="h-4 w-4" />
                        </MenuButton>
                        <MenuItems
                          className={
                            " z-100 w-24  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800"
                          }
                          anchor="bottom end"
                          portal
                        >
                          <MenuItem>
                            <button
                              onClick={() => {
                                setSelected(r);
                                setOpenRight(true);
                                navigate("/documents/history/card/" + r.id);
                              }}
                              className="group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 data-[focus]:bg-blue-500 data-[focus]:text-white"
                            >
                              Pokaż
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              onClick={() => {
                                setSelected(r);
                                setOpenRight(true);
                                navigate("/documents/history/card/" + r.id);
                              }}
                              className="group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 data-[focus]:bg-blue-500 data-[focus]:text-white"
                            >
                              Edytuj
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
