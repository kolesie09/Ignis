import React from "react";

export default function AddItemModal({
  open,
  title = "Dodaj element",
  label = "Nazwa",
  placeholder = "Wpisz nazwę...",
  value,
  onChange,
  onClose,
  onSave,
  saveLabel = "Zapisz",
  cancelLabel = "Anuluj",
  disabled = false,
  error,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>

        <input
          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm
             focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
             dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={disabled || !value?.trim()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
