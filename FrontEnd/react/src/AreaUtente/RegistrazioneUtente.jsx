import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import "../components/Navbar/Navbar.css";
import "./RegistrazioneUtente.css";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const RegistrazioneUtente = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nome.trim() ||
      !cognome.trim() ||
      !dataNascita ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Tutti i campi sono obbligatori.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Inserisci un'email valida.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Le password non coincidono.");
      return;
    }

    // Chiamata al backend per registrazione
    try {
      await axios.post(
        "http://localhost:8080/api/buyers/register",
        {
          firstName: nome,
          lastName: cognome,
          birthdate: dataNascita,
          email,
          password
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setShowModal(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email già registrata.");
      } else {
        toast.error("Errore di connessione. Riprova.");
      }
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/login");
  };

  // Google Sign-In placeholder
  const handleGoogleLogin = () => {
    const clientId = "1094630668431-m9m9jci7cih64htg0tt8cr6qod7iclvp.apps.googleusercontent.com";
    const redirectUri = "http://localhost:5173/auth/callback";
    const scope = "openid email profile";
    const state = "register";
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar />

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl">
        <div className="registration-info-box">
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

        {/* Form di Registrazione */}
        <div className="login-box p-8 rounded-lg text-white flex flex-col items-center flex-1">
          <form id="loginForm" className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <p className="form-title">Unisciti a noi!</p>
            <input
              type="text"
              id="nome"
              placeholder="Nome"
              className="w-full p-2 my-2 border border-gray-300 rounded-md text-black"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="text"
              id="cognome"
              placeholder="Cognome"
              className="w-full p-2 my-2 border border-gray-300 rounded-md text-black"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
            />
            <input
              type="date"
              id="dataNascita"
              placeholder="Data di nascita"
              className="w-full p-2 my-2 border border-gray-300 rounded-md text-black"
              value={dataNascita}
              onChange={(e) => setDataNascita(e.target.value)}
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-2 my-2 border border-gray-300 rounded-md text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-2 my-2 border border-gray-300 rounded-md text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Conferma password"
              className="w-full p-2 my-2 border border-gray-300 rounded-md text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="accesso px-6 py-2 mt-6 rounded-md text-lg bg-blue-500 text-white">
              REGISTRATI
            </button>
          </form>

          <div className="register-link" onClick={() => navigate("/login")}>
            Sei già nostro utente? <span style={{ textDecoration: "underline" }}>Accedi</span>
          </div>

          <div className="divider w-full text-center relative my-4">
            <div className="border-b border-gray-400 w-full absolute top-1/2"></div>
            <span className="divisore px-2 relative z-10 bg-white">oppure</span>
          </div>

          {/* Pulsante Google */}
          <div
            className="google-signin flex items-center bg-white text-black px-4 py-2 rounded-md cursor-pointer font-bold"
            id="google-login"
            onClick={handleGoogleLogin}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="20" className="mr-2" alt="Google logo" />
            Registrati con Google
          </div>
        </div>
      </div>

      {/* Modale di Conferma */}
      {showModal && (
        <div id="successModal" style={{ display: "flex" }}>
          <div className="modal-outer-success">
            <div className="modal-inner-success">
              <div data-svg-wrapper="">
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M55 9.16675C29.7 9.16675 9.16663 29.7001 9.16663 55.0001C9.16663 80.3001 29.7 100.833 55 100.833C80.3 100.833 100.833 80.3001 100.833 55.0001C100.833 29.7001 80.3 9.16675 55 9.16675ZM42.5791 74.6626L26.125 58.2084C24.3375 56.4209 24.3375 53.5334 26.125 51.7459C27.9125 49.9584 30.8 49.9584 32.5875 51.7459L45.8333 64.9459L77.3666 33.4126C79.1541 31.6251 82.0416 31.6251 83.8291 33.4126C85.6166 35.2001 85.6166 38.0876 83.8291 39.8751L49.0416 74.6626C47.3 76.4501 44.3666 76.4501 42.5791 74.6626Z" fill="#4DC538"/>
                </svg>
              </div>
              <h2>Registrazione completata!</h2>
              <p>
                La registrazione è avvenuta con successo.<br />
                Ora puoi effettuare il login con le tue credenziali.
              </p>
              <div className="modal-spacer"></div>
              <button id="confirmSuccessButton" onClick={handleModalConfirm}>
                PROSEGUI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrazioneUtente;
