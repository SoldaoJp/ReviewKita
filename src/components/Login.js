// src/components/Login.js
import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/logo.svg"; // ✅ import SVG file directly
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`(Demo) Submitted\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="rk-root">
      <header className="rk-header">
        <div className="rk-brand">
          <img src={logo} alt="logo" className="rk-logo" />
          <span className="rk-title">ReviewKita</span>
        </div>

        <div className="rk-actions">
          <button
            className="btn-outline"
            onClick={() => alert("Sign up (demo)")}
          >
            Sign up
          </button>
          <button
            className="btn-solid"
            onClick={() => alert("Already on login (demo)")}
          >
            Log in
          </button>
        </div>
      </header>

      <div className="rk-content">
        <div className="rk-card" role="region" aria-label="Login form">
          <h1>Welcome Back to ReviewKita</h1>
          <p className="lead">
            Log in to continue your learning journey. Access your personalized
            quizzes, flashcards, and progress — all powered by AI to help you
            study smarter every day.
          </p>

          <form className="rk-form" onSubmit={handleSubmit}>
            <label htmlFor="rk-email" className="sr-only">
              Email
            </label>
            <input
              id="rk-email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="rk-password" className="sr-only">
              Password
            </label>
            <div className="password-wrapper">
              <input
                id="rk-password"
                name="password"
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                className="eye-btn"
                onClick={() => setShow((s) => !s)}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="form-row">
              <button className="btn-login" type="submit">
                Log in
              </button>
              <a
                className="forgot"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Forgot password (demo)");
                }}
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>

        <div className="rk-art" aria-hidden="true"></div>
      </div>
    </div>
  );
}
