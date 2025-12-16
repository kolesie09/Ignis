import React, { useState } from "react";
import App from "../../App";

const users = [{ login: "admin", password: "admin" }];

function Login({ setAuthenticated }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony przy submit

    const foundUser = users.find(
      (user) => user.login === login && user.password === password
    ); //Wklejone w handleSubmit ponieważ będzie się wtedy tylko raz wykonywać

    if (foundUser) {
      alert("Login successful");
      setAuthenticated(true);
    } else {
      alert("Please enter login and password");
    }
  };

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
