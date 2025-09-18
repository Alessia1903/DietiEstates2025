import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginUtente.css";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const LoginUtente = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email) || password.length < 6) {
      setErrorMsg("Email o password non valide.");
      setShowError(true);
      return;
    }

    try {
      setShowError(false);
      // Chiamata al backend per login
      const response = await axios.post(
        "http://localhost:8080/api/buyers/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("jwtToken", response.data);
      localStorage.setItem("role", "user");
      localStorage.setItem("userEmail", email);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMsg("Credenziali non valide.");
      } else {
        setErrorMsg("Errore di connessione. Riprova.");
      }
      setShowError(true);
    }
  };

  const handleGoogleLogin = () => {
    alert("Funzionalità Google Sign-In da integrare.");
  };

  const handleGoToRegister = (e) => {
    e.preventDefault();
    navigate("/registrazione-utente");
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="header-container">
        <div className="logo-title cursor-pointer" id="logo-title" onClick={handleLogoClick}>
          <img
            src="https://github.com/Alessia1903/DietiEstates2025/blob/master/Photos/LenteObl-removebg-preview.png?raw=true"
            alt="Logo DietiEstates"
            className="logo"
          />
          <div>
            <h1 className="title custom-text-color">DîetîEstates25</h1>
            <p className="subtitle custom-text-color">La casa che vuoi, quando vuoi</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl">
        <div className="login-info-box">
          <h3 className="text-lg font-bold mb-12">Con il tuo account puoi:</h3>
          <ul className="list-none p-0 space-y-12">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 40 40" fill="none" className="w-7 h-7 mr-2">
                <path d="M20 3.33334C10.8 3.33334 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6667 20 36.6667C29.2 36.6667 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33334 20 3.33334ZM20 33.3333C12.65 33.3333 6.66671 27.35 6.66671 20C6.66671 12.65 12.65 6.66667 20 6.66667C27.35 6.66667 33.3334 12.65 33.3334 20C33.3334 27.35 27.35 33.3333 20 33.3333ZM20.8334 11.6667H18.3334V21.6667L27.0834 26.9167L28.3334 24.75L21.6667 20.4167V11.6667Z" fill="#073B4C"/>
              </svg>
              Accedere alla cronologia delle ricerche
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 40 40" fill="none" className="w-7 h-7 mr-2">
                <path d="M20 36.6667C22.7667 36.6667 25 34.4333 25 31.6667H15C15 34.4333 17.2333 36.6667 20 36.6667ZM30 25V16.6667C30 11.1833 27.0667 6.58333 21.9167 5.41667V4.25C21.9167 2.78333 20.7167 1.58333 19.25 1.58333C17.7833 1.58333 16.5833 2.78333 16.5833 4.25V5.41667C11.45 6.58333 8.5 11.1667 8.5 16.6667V25L5 28.6667V30.4167H35V28.6667L31.5 25H30ZM26.6667 26.6667H13.3333V16.6667C13.3333 12.25 15.5667 8.66667 20 8.66667C24.4333 8.66667 26.6667 12.25 26.6667 16.6667V26.6667Z" fill="#073B4C"/>
                <circle cx="28" cy="12" r="5" fill="#06D6A0"/>
              </svg>
              Ricevere notifiche sulle ricerche salvate
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 40 40" fill="none" className="w-7 h-7 mr-2">
                <path d="M31.6667 5H28.3334V3.33333C28.3334 2.41667 27.5834 1.66667 26.6667 1.66667C25.75 1.66667 25 2.41667 25 3.33333V5H15V3.33333C15 2.41667 14.25 1.66667 13.3334 1.66667C12.4167 1.66667 11.6667 2.41667 11.6667 3.33333V5H8.33337C6.50004 5 5.01671 6.5 5.01671 8.33333L5.00004 35C5.00004 36.8333 6.50004 38.3333 8.33337 38.3333H31.6667C33.5 38.3333 35 36.8333 35 35V8.33333C35 6.5 33.5 5 31.6667 5ZM31.6667 35H8.33337V15H31.6667V35Z" fill="#073B4C"/>
                <path d="M17.5 28.3333L23.3333 22.5L17.5 16.6667L15 19.1667L18.3333 22.5L15 25.8333L17.5 28.3333Z" fill="#06D6A0"/>
              </svg>
              Prenotare visite per vedere gli immobili
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 40 40" fill="none" className="w-7 h-7 mr-2">
                <path d="M33.3334 18.3333V8.33333C33.3334 6.5 31.8334 5 30 5H28.3334C26.5 5 25 6.5 25 8.33333V10L19.1667 4.16667C18.4167 3.5 17.0834 3.5 16.3334 4.16667L1.66671 18.3333C0.833374 19.1667 1.50004 20.8333 2.66671 20.8333H5.00004V35C5.00004 36.8333 6.50004 38.3333 8.33337 38.3333H31.6667C33.5 38.3333 35 36.8333 35 35V20.8333H37.3334C38.5 20.8333 39.1667 19.1667 38.3334 18.3333L33.3334 13.3333V18.3333ZM20 23.3333C17.2334 23.3333 15 21.1 15 18.3333C15 15.5667 17.2334 13.3333 20 13.3333C22.7667 13.3333 25 15.5667 25 18.3333C25 21.1 22.7667 23.3333 20 23.3333Z" fill="#073B4C"/>
                <circle cx="20" cy="18.3333" r="3.33333" fill="#06D6A0"/>
              </svg>
              Trovare la casa dei tuoi sogni!
            </li>
          </ul>
        </div>

        <div className="login-box p-8 rounded-lg text-white flex flex-col items-center flex-1">
          <p className="form-title">Bentornato!</p>
          <form id="loginForm" className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-2 my-2 border-none rounded-md text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-2 my-2 border-none rounded-md text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p id="error-message" className={`error-message${showError ? "" : " hidden"}`}>
              {errorMsg}
            </p>
            <button type="submit" className="accesso px-6 py-2 mt-6 rounded-md text-lg bg-blue-500 text-white">
              Accedi
            </button>
          </form>

          <div className="divider w-full text-center relative my-4">
            <div className="border-b border-gray-400 w-full absolute top-1/2"></div>
            <span className="divisore px-2 relative z-10 bg-white">oppure</span>
          </div>

          <div
            className="google-signin flex items-center bg-white text-black px-4 py-2 rounded-md cursor-pointer font-bold"
            id="google-login"
            onClick={handleGoogleLogin}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="20" className="mr-2" alt="Google logo" />
            Accedi con Google
          </div>

          <div className="mt-6">
            <a
              href="/registrazione-utente"
              onClick={handleGoToRegister}
              className="register-link text-blue-200 underline hover:text-blue-400"
            >
              Non hai un account? Registrati
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUtente;
