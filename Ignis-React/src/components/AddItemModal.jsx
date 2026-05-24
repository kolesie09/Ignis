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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl border border-slate-700">
        <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            {" "}
            {label}
          </label>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus
            className={`w-full rounded-xl border px-4 py-2 outline-none transition
            ${
              error
                ? "border-red-500 bg-slate-800 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30"
            }
            ${disabled ? "cursor-not-allowed opacity-70" : ""}
          `}
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-600 px-4 py-2 text-slate-200 hover:bg-slate-800"
            >
              {cancelLabel}
            </button>

            <button
              type="submit"
              disabled={disabled}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
