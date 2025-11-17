import { useId } from "react";

export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 ${className}`}
    {...props}
  />
);

export const Select = ({ className = "", children, ...props }) => (
  <select
    className={`w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 ${className}`}
    {...props}
  >
    {children}
  </select>
);

export function TimeInput({
  value,
  onChange,
  label = "Godzina",
  id,
  minuteStep = 1,
  min,
  max,
  required,
  disabled,
  error,
  className = "",
}) {
  const autoId = useId();
  const inputId = id ?? `time-${autoId}`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>

      <input
        id={inputId}
        type="time"
        lang="pl"
        className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:cursor-not-allowed disabled:bg-gray-100
                   dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={minuteStep * 60} // 1 min = 60 s
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />

      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
