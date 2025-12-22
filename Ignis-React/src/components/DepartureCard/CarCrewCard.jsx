import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Card, CardBody, CardHeader } from "../Card";
import SelectInput from "../../components/SelectInput";
import { Button } from "../../components/Button.jsx";

export default function CrewCar({
  title = "499z01",
  teams = [],
  value,
  onChange,
  className = "",
  firefightersCount = 4,

  // 🔽 NOWE: globalne wykluczenia (np. osoby użyte w innych pojazdach)
  exclude = [], // Array<string>
  // 🔽 NOWE: przycisk do automatycznej obsady
  enableAutoAssign = false,
}) {
  const [driver, setDriver] = useState(value?.driver ?? "");
  const [commander, setCommander] = useState(value?.commander ?? "");
  const [firefighters, setFirefighters] = useState(() => {
    const base = value?.firefighters ?? [];
    return Array.from({ length: firefightersCount }, (_, i) => base[i] ?? "");
  });

  const prevValueRef = useRef();

  // ——— Normalizacja opcji i zbiory pomocnicze ———
  const asOption = (o) => (typeof o === "string" ? { label: o, value: o } : o);
  const normTeams = useMemo(() => teams.map(asOption), [teams]);
  const excludeSet = useMemo(() => new Set(exclude.filter(Boolean)), [exclude]);

  const selectedSet = useMemo(
    () => new Set([driver, commander, ...firefighters].filter(Boolean)),
    [driver, commander, firefighters]
  );

  const valueOf = (o) => (typeof o === "string" ? o : o?.value ?? "");

  // ——— Filtrowanie opcji: bez duplikatów w tej karcie + globalne exclude ———
  const filteredOptionsFor = (currentValue) =>
    normTeams.filter((o) => {
      const v = valueOf(o);
      if (v === currentValue) return true; // zachowaj aktualną wartość pola
      if (selectedSet.has(v)) return false; // unikaj duplikatów wewnątrz karty
      if (excludeSet.has(v)) return false; // globalne wykluczenia
      return true;
    });

  // Synchronizacja przy zewnętrznej zmianie value (tryb kontrolowany)
  useEffect(() => {
    if (!value) return;
    setDriver(value.driver ?? "");
    setCommander(value.commander ?? "");
    setFirefighters(
      Array.from(
        { length: firefightersCount },
        (_, i) => value.firefighters?.[i] ?? ""
      )
    );
  }, [value]); // Użyj value jako zależności

  // 🔧 NOWE: gdy NIE używasz `value` (tryb niekontrolowany), zmiana firefightersCount przeskaluje tablicę
  useEffect(() => {
    if (value) return; // W trybie kontrolowanym robi to efekt powyżej
    setFirefighters((prev) => {
      if (prev.length === firefightersCount) return prev; // Unikaj aktualizacji, jeśli długość jest taka sama
      const next = prev.slice(0, firefightersCount);
      while (next.length < firefightersCount) next.push("");
      return next;
    });
  }, [firefightersCount]); // Usuń value z zależności

  // Propagacja do rodzica
  useEffect(() => {
    const current = { driver, commander, firefighters };
    if (JSON.stringify(current) !== JSON.stringify(prevValueRef.current)) {
      prevValueRef.current = current;
      if (onChange) {
        onChange(current);
      }
    }
  }, [driver, commander, firefighters]); // Usuń onChange z zależności

  const updateFirefighter = (idx, v) => {
    setFirefighters((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
  };

  // 🔽 NOWE: auto-obsada (z poszanowaniem exclude i bieżących wyborów)
  const autoAssign = () => {
    const candidates = normTeams.map(valueOf);
    const taken = new Set([...excludeSet]); // nie używaj globalnie zajętych

    // zablokuj już unikalnie wybrane w tej karcie
    [driver, commander, ...firefighters]
      .filter(Boolean)
      .forEach((x) => taken.add(x));

    const takeNext = (preferred) => {
      if (preferred && !taken.has(preferred)) {
        taken.add(preferred);
        return preferred;
      }
      const found = candidates.find((c) => !taken.has(c));
      if (found) {
        taken.add(found);
        return found;
      }
      return ""; // zabrakło osób
    };

    setDriver((d) => takeNext(d));
    setCommander((c) => takeNext(c));
    setFirefighters((arr) => {
      const sized = arr.slice(0, firefightersCount);
      while (sized.length < firefightersCount) sized.push("");
      return sized.map((f) => takeNext(f));
    });
  };

  const handleChange = useCallback((newValue) => {
    // logika obsługi zmiany
  }, []);

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

        {Array.from({ length: firefightersCount }).map((_, i) => (
          <SelectInput
            key={i}
            className="mt-5"
            value={firefighters[i]}
            onChange={(v) => updateFirefighter(i, v)}
            options={filteredOptionsFor(firefighters[i])}
            label="Strażak: "
            placeholder="— wybierz strażaka —"
            required
          />
        ))}
      </CardBody>
    </Card>
  );
}
