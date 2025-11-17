import React, { useState, useMemo } from "react";
import { statisticsfirefighter, year } from "../../data/mock";
import { RowInfo } from "../../components/Statistics/Tabel";
import { Card, CardBody } from "../../components/Card";

import SelectInput from "../../components/SelectInput";

export default function Firefighter() {
  const [yearValue, setYearValue] = useState("");
  const yearOptions = useMemo(
    () =>
      year
        .slice() // (opcjonalnie) kopia
        .sort((a, b) => b.year - a.year) // malejąco
        .map((y) => ({ value: String(y.year), label: String(y.year) })),
    []
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
      <Card className=" col-start-4">
        <CardBody className="p-4">
          <SelectInput
            label="Rok"
            value={yearValue}
            onChange={setYearValue} // dostajesz string, np. "2025"
            options={yearOptions}
            placeholder="— wybierz —"
          />
        </CardBody>
      </Card>
      <Card className="col-span-4">
        <CardBody className="p-4 ">
          <table className="  table-auto w-full border-collapse text-l border-spacing-y-2 border-spacing-x-0">
            <thead>
              <tr>
                <th>LP</th>
                <th>Nazwa</th>
                <th>Liczba wyjazdów</th>
                <th>Poświęcony czas</th>
                <th>Procent</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {statisticsfirefighter.map((n) => (
                <RowInfo
                  id={n.id}
                  who={n.who}
                  departure={n.departure}
                  hour={n.hour}
                  percent={n.percent}
                />
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
