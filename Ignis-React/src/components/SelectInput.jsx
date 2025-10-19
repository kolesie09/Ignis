// SelectInput.jsx
import React, { useId } from "react";

export default function SelectInput({
  value,
  onChange,
  options = [], // [{ value, label, disabled? }]
  label = "Opcja",
  id,
  placeholder = "— wybierz —",
  required,
  disabled,
  error,
  className = "",
}) {
  const autoId = useId();
  const inputId = id ?? `select-${autoId}`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      <label
        htmlFor={inputId}
        className="shrink-0 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>

      <div className="relative flex-1 min-w-0">
        <select
          id={inputId}
          className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2 pr-9 text-sm shadow-sm
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:cursor-not-allowed disabled:bg-gray-100
                     dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* strzałka */}
        <svg
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" />
        </svg>
      </div>

      {error && (
        <span id={errorId} className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
