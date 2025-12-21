import React, { useState } from "react";
import App from "../../App";

function Register({ handleSwitchToLogin }) {
  const [imie, setImie] = useState("");
  const [nazwisko, setNazwisko] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [imieError, setImieError] = useState(false);
  const [nazwiskoError, setNazwiskoError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony przy submit

    setImieError(false); // Resetuj błąd imienia przy każdym submit
    setNazwiskoError(false); // Resetuj błąd nazwiska przy każdym submit
    setEmailError(false); // Resetuj błąd emaila przy każdym submit
    setPasswordError(false); // Resetuj błąd hasła przy każdym submit

    if (!imie) {
      setImieError(true);
    }
    if (!nazwisko) {
      setNazwiskoError(true);
    }
    if (!email) {
      setEmailError(true);
    }
    if (!password || !confirmPassword) {
      setPasswordError(true);
    }

    if (!imie || !nazwisko || !email || !password || !confirmPassword) {
      setError("Wszystkie pola są wymagane");
      return;
    } else {
      if (password !== confirmPassword) {
        setError("Hasła nie są zgodne");
        return;
      } else {
        setRegistered(true);
        localStorage.setItem("registered", "true");
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <img
          className="mx-auto mb-4 h-32 w-32 rounded-md"
          src="/Ignis.png"
          alt="Logo"
        />
        <h2 className="text-center text-4xl font-bold">Rejestracja</h2>
        <form onSubmit={handleSubmit}>
          <div className="">
            <input
              // Jeśli imieError jest true ? to daj czerwone : w przeciwnym razie szare
              className={`border w-full p-2 rounded-md mt-4 ${
                imieError
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-300"
              }`}
              type="text"
              placeholder="Imie"
              value={imie}
              onChange={(e) => {
                setImie(e.target.value);
                // Opcjonalnie: usuń czerwony kolor, gdy użytkownik zacznie pisać
                if (imieError) setImieError(false);
                if (error) setError(false);
              }}
            />
          </div>
          <div>
            <input
              className={`border  w-full p-2 rounded-md mt-4 ${
                nazwiskoError
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-300"
              }`}
              type="text"
              placeholder="Nazwisko"
              value={nazwisko}
              onChange={(e) => {
                setNazwisko(e.target.value);
                if (nazwiskoError) setNazwiskoError(false);
                if (error) setError(false);
              }}
            />
          </div>
          <div>
            <input
              className={`border  w-full p-2 rounded-md mt-4 ${
                emailError
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-300"
              }`}
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(false);
                if (error) setError(false);
              }}
            />
          </div>
          <div>
            <input
              className={`border  w-full p-2 rounded-md mt-4 ${
                passwordError
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-300"
              }`}
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(false);
                if (error) setError(false);
              }}
            />
          </div>
          <div>
            <input
              className={`border  w-full p-2 rounded-md mt-4 ${
                passwordError
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-300"
              }`}
              type="password"
              placeholder="Potwierdź hasło"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) setPasswordError(false);
                if (error) setError(false);
              }}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="hover:bg-blue-600 bg-blue-500 text-white w-full p-4 mt-4 rounded-md"
            type="submit"
          >
            Zarejestruj się
          </button>
        </form>
        <button
          className="hover:bg-blue-600 bg-blue-500 text-white w-full p-4 mt-4 rounded-md"
          type="button"
          onClick={() => {
            handleSwitchToLogin();
          }}
        >
          Mam już konto
        </button>
      </div>
    </div>
  );
}

export default Register;
