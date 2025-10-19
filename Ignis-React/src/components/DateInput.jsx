import React, { useId } from "react";

export default function DateInput({
  value, // "YYYY-MM-DD"
  onChange, // (val) => void
  label = "Data",
  id,
  dayStep = 1, // krok w dniach
  min, // "YYYY-MM-DD"
  max, // "YYYY-MM-DD"
  required,
  disabled,
  error,
  className = "",
}) {
  const autoId = useId();
  const inputId = id ?? `date-${autoId}`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="shrink-0 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>

        <div className="relative flex-1 min-w-0">
          <input
            id={inputId}
            type="date"
            lang="pl"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       disabled:cursor-not-allowed disabled:bg-gray-100
                       dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            step={dayStep}
            min={min}
            max={max}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
