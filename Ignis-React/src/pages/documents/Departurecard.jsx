import { Card, CardBody, CardHeader } from "../../components/Card";
import TimeInput from "../../components/TimeInput";
import DateInput from "../../components/DateInput";
import SelectInput from "../../components/SelectInput";
import React from "react";

const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function DepartureCard() {
  const id = "reporter";
  const label = "Zgłaszający";
  const placeholder = "Wpisz nazwisko…";
  const [value, setValue] = React.useState("");
  const options = ["Kowalski", "Nowak", "Wiśniewski"];
  const [timeDeparture, setTimeDeparture] = React.useState("18:30");
  const [timeArrival, setTimeArrival] = React.useState("18:30");
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);
  const [date, setDate] = React.useState(toISODate(today));
  const [team, setTeam] = React.useState("");

  const teams = [
    { value: "spojnia", label: "Barlinek" },
    { value: "astoria", label: "Rychnów" },
    { value: "polonia", label: "Mostkowo", disabled: true }, // przykład disabled
  ];

  return (
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
              {options.map((opt) => (
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
          <SelectInput
            value={team}
            onChange={setTeam}
            options={teams}
            label="Miejscowość: "
            placeholder="— wybierz miejscowość —"
            required
          />
          <SelectInput
            className="mt-5"
            value={team}
            onChange={setTeam}
            options={teams}
            label="Ulica: "
            placeholder="— wybierz ulice —"
            required
          />
          <SelectInput
            className="mt-5"
            value={team}
            onChange={setTeam}
            options={teams}
            label="Liczba kilometrów: "
            placeholder="— wybierz liczbe kilometrów —"
            required
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody className="p-4">
          <SelectInput
            value={team}
            onChange={setTeam}
            options={teams}
            label="Kategoria: "
            placeholder="— wybierz kategorie —"
            required
          />
          <SelectInput
            className="mt-5"
            value={team}
            onChange={setTeam}
            options={teams}
            label="Powód: "
            placeholder="— wybierz powód —"
            required
          />
        </CardBody>
      </Card>
      <Card className="lg:col-span-3 lg:row-start-2">
        <CardBody className="p-4">
          <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardBody className="p-4">
                <CardHeader title={"499z01"}></CardHeader>
                <SelectInput
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Kierowca: "
                  placeholder="— wybierz kierowce —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Dowódca: "
                  placeholder="— wybierz powód —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <CardHeader title={"499z01"}></CardHeader>
                <SelectInput
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Kierowca: "
                  placeholder="— wybierz kierowce —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Dowódca: "
                  placeholder="— wybierz powód —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <CardHeader title={"499z01"}></CardHeader>
                <SelectInput
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Kierowca: "
                  placeholder="— wybierz kierowce —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Dowódca: "
                  placeholder="— wybierz powód —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <CardHeader title={"499z01"}></CardHeader>
                <SelectInput
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Kierowca: "
                  placeholder="— wybierz kierowce —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Dowódca: "
                  placeholder="— wybierz powód —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <CardHeader title={"499z01"}></CardHeader>
                <SelectInput
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Kierowca: "
                  placeholder="— wybierz kierowce —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Dowódca: "
                  placeholder="— wybierz powód —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <CardHeader title={"499z01"}></CardHeader>
                <SelectInput
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Kierowca: "
                  placeholder="— wybierz kierowce —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Dowódca: "
                  placeholder="— wybierz powód —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4">
                <CardHeader title={"499z01"}></CardHeader>
                <SelectInput
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Kierowca: "
                  placeholder="— wybierz kierowce —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Dowódca: "
                  placeholder="— wybierz powód —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
                <SelectInput
                  className="mt-5"
                  value={team}
                  onChange={setTeam}
                  options={teams}
                  label="Strażak: "
                  placeholder="— wybierz strażaka —"
                  required
                />
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
