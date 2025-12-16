import React, { useState } from "react";
import App from "../../App";

const users = [{ login: "admin", password: "admin" }];

function Login({ setAuthenticated }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony przy submit

    const foundUser = users.find(
      (user) => user.login === login && user.password === password
    ); //Wklejone w handleSubmit ponieważ będzie się wtedy tylko raz wykonywać

    if (foundUser) {
      setAuthenticated(true);
    } else {
      setError("Błędny login lub hasło");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="text-center text-4xl font-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="">
            <input
              className="border border-gray-300 w-full p-2 rounded-md mt-4 "
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div>
            <input
              className="border border-gray-300 w-full p-2 rounded-md mt-4"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="hover:bg-blue-600 bg-blue-500 text-white w-full p-4 mt-4 rounded-md"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
