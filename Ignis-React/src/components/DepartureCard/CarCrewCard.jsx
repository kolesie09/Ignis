import React, { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardBody, CardHeader } from "../Card";
import SelectInput from "../../components/SelectInput";
import { Button } from "../../components/Button.jsx";

export default function CrewCar({
  title = "499z01",
  teams = [],
  value,
  onChange,
  className = "",
  places = 6,
  exclude = [],
  enableAutoAssign = false,
}) {
  const firefightersCount = Math.max(Number(places) - 2, 0);

  const [driver, setDriver] = useState(value?.driver ?? "");
  const [commander, setCommander] = useState(value?.commander ?? "");
  const [firefighters, setFirefighters] = useState(() => {
    const base = value?.firefighters ?? [];

    return Array.from(
      { length: firefightersCount },
      (_, index) => base[index] ?? "",
    );
  });

  const prevValueRef = useRef();

  const asOption = (option) =>
    typeof option === "string" ? { label: option, value: option } : option;

  const normTeams = useMemo(() => teams.map(asOption), [teams]);
  const excludeSet = useMemo(() => new Set(exclude.filter(Boolean)), [exclude]);

  const selectedSet = useMemo(
    () => new Set([driver, commander, ...firefighters].filter(Boolean)),
    [driver, commander, firefighters],
  );

  const valueOf = (option) =>
    typeof option === "string" ? option : (option?.value ?? "");

  const filteredOptionsFor = (currentValue) =>
    normTeams.filter((option) => {
      const optionValue = valueOf(option);

      if (optionValue === currentValue) {
        return true;
      }

      if (selectedSet.has(optionValue)) {
        return false;
      }

      if (excludeSet.has(optionValue)) {
        return false;
      }

      return true;
    });

  useEffect(() => {
    if (!value) {
      return;
    }

    setDriver(value.driver ?? "");
    setCommander(value.commander ?? "");
    setFirefighters(
      Array.from(
        { length: firefightersCount },
        (_, index) => value.firefighters?.[index] ?? "",
      ),
    );
  }, [value, firefightersCount]);

  useEffect(() => {
    if (value) {
      return;
    }

    setFirefighters((prev) => {
      if (prev.length === firefightersCount) {
        return prev;
      }

      const next = prev.slice(0, firefightersCount);

      while (next.length < firefightersCount) {
        next.push("");
      }

      return next;
    });
  }, [value, firefightersCount]);

  useEffect(() => {
    const current = {
      driver,
      commander,
      firefighters,
    };

    if (JSON.stringify(current) !== JSON.stringify(prevValueRef.current)) {
      prevValueRef.current = current;

      if (onChange) {
        onChange(current);
      }
    }
  }, [driver, commander, firefighters, onChange]);

  const updateFirefighter = (index, newValue) => {
    setFirefighters((prev) => {
      const next = [...prev];
      next[index] = newValue;

      return next;
    });
  };

  const autoAssign = () => {
    const candidates = normTeams.map(valueOf);
    const taken = new Set([...excludeSet]);

    [driver, commander, ...firefighters]
      .filter(Boolean)
      .forEach((person) => taken.add(person));

    const takeNext = (preferred) => {
      if (preferred && !taken.has(preferred)) {
        taken.add(preferred);
        return preferred;
      }

      const found = candidates.find((candidate) => !taken.has(candidate));

      if (found) {
        taken.add(found);
        return found;
      }

      return "";
    };

    setDriver((currentDriver) => takeNext(currentDriver));
    setCommander((currentCommander) => takeNext(currentCommander));
    setFirefighters((currentFirefighters) => {
      const sized = currentFirefighters.slice(0, firefightersCount);

      while (sized.length < firefightersCount) {
        sized.push("");
      }

      return sized.map((firefighter) => takeNext(firefighter));
    });
  };

  return (
    <Card className={className}>
      <CardBody className="p-4">
        <CardHeader title={title} />

        {enableAutoAssign && (
          <div className="mb-3">
            <Button variant="ghost" onClick={autoAssign}>
              Auto-obsadź
            </Button>
          </div>
        )}

        <SelectInput
          value={driver}
          onChange={setDriver}
          options={filteredOptionsFor(driver)}
          label="Kierowca: "
          placeholder="— wybierz kierowcę —"
          required
        />

        <SelectInput
          className="mt-5"
          value={commander}
          onChange={setCommander}
          options={filteredOptionsFor(commander)}
          label="Dowódca: "
          placeholder="— wybierz dowódcę —"
          required
        />

        {Array.from({ length: firefightersCount }).map((_, index) => (
          <SelectInput
            key={index}
            className="mt-5"
            value={firefighters[index]}
            onChange={(newValue) => updateFirefighter(index, newValue)}
            options={filteredOptionsFor(firefighters[index])}
            label={`Strażak ${index + 1}: `}
            placeholder="— wybierz strażaka —"
            required
          />
        ))}
      </CardBody>
    </Card>
  );
}
