import { useState } from "react";
import { Input, Select } from "../../components/Inputs.jsx";
import { Button } from "../../components/Button.jsx";
import { Avatar } from "../../components/Avatar.jsx";

export default function MyAccount() {
  const [form, setForm] = useState({
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
    phone: "+48 600 000 000",
    address: "ul. Przykładowa 1, 00-001 Miasto",
    birthDate: "1990-01-01",
    role: "Strażak",
    displayName: "Jan Kowalski",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    const err = {};
    if (!form.firstName?.trim()) err.firstName = "Imię jest wymagane";
    if (!form.email?.trim()) err.email = "Email jest wymagany";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Nieprawidłowy format email";
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      console.log("Submitting MyAccount:", form);
      alert("Dane zapisane (zobacz konsolę)");
    }
  }

  function handleReset() {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      birthDate: "",
      role: "",
      displayName: "",
    });
    setErrors({});
  }

  return (
    <div className="p-6 bg-white dark:bg-zinc-950 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Moje konto — przykładowy formularz
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={form.displayName || "Użytkownik"} />
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-300">
              Nazwa wyświetlana
            </label>
            <Input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              placeholder="Twoja nazwa"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-zinc-600 dark:text-zinc-300">
              Imię
            </label>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Np. Jan"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm text-zinc-600 dark:text-zinc-300">
              Nazwisko
            </label>
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Np. Kowalski"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-zinc-600 dark:text-zinc-300">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="np@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm text-zinc-600 dark:text-zinc-300">
              Telefon
            </label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+48 600 000 000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm text-zinc-600 dark:text-zinc-300">
              Adres
            </label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="ul. Przykładowa 1, Miasto"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-zinc-600 dark:text-zinc-300">
              Data urodzenia
            </label>
            <Input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-zinc-600 dark:text-zinc-300">
              Rola
            </label>
            <Select name="role" value={form.role} onChange={handleChange}>
              <option value="">Wybierz rolę</option>
              <option value="Strażak">Strażak</option>
              <option value="Dowódca">Dowódca</option>
              <option value="Technik">Technik</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary">
            Zapisz
          </Button>
          <Button type="button" variant="ghost" onClick={handleReset}>
            Wyczyść
          </Button>
        </div>
      </form>
    </div>
  );
}
