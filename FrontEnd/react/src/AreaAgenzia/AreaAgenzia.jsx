import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import "../components/Navbar/Navbar.css";
import "./AreaAgenzia.css";

const AreaAgenzia = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Inserisci email e password.");
      return;
    }

    try {
      // Prova login admin
      const adminResp = await axios.post(
        "http://localhost:8080/api/admins/login",
        { email, password }
      );
      // Se va a buon fine, salva token e vai a home admin
      localStorage.setItem("jwtToken", adminResp.data);
      localStorage.setItem("role", "admin");
      navigate("/cambio-credenziali");
      return;
    } catch (errAdmin) {
      // Se errore, prova login estate agent
      try {
        const agentResp = await axios.post(
          "http://localhost:8080/api/estate-agents/login",
          { email, password }
        );
        localStorage.setItem("jwtToken", agentResp.data);
        localStorage.setItem("role", "agent");
        navigate("/home-agente");
        return;
      } catch (errAgent) {
        toast.error("Credenziali non valide.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar />

      <div className="flex flex-col md:flex-row gap-24 items-center justify-center w-full sm:w-auto mt-6">
        {/* Registra Agenzia */}
        <a className="register-box" onClick={() => navigate("/registrazione-agenzia")}>
          <div className="agency-icon-container">
            {/* Icona edificio */}
            <svg className="building-icon" xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none">
              <g clipPath="url(#clip0_11_444)">
                <path d="M150 87.5V62.5C150 48.75 138.75 37.5 125 37.5H50C36.25 37.5 25 48.75 25 62.5V237.5C25 251.25 36.25 262.5 50 262.5H250C263.75 262.5 275 251.25 275 237.5V112.5C275 98.75 263.75 87.5 250 87.5H150ZM75 237.5H50V212.5H75V237.5ZM75 187.5H50V162.5H75V187.5ZM75 137.5H50V112.5H75V137.5ZM75 87.5H50V62.5H75V87.5ZM125 237.5H100V212.5H125V237.5ZM125 187.5H100V162.5H125V187.5ZM125 137.5H100V112.5H125V137.5ZM125 87.5H100V62.5H125V87.5ZM237.5 237.5H150V212.5H175V187.5H150V162.5H175V137.5H150V112.5H237.5C244.375 112.5 250 118.125 250 125V225C250 231.875 244.375 237.5 237.5 237.5ZM225 137.5H200V162.5H225V137.5ZM225 187.5H200V212.5H225V187.5Z" fill="#073B4C"/>
              </g>
              <defs>
                <clipPath id="clip0_11_444">
                  <rect width="300" height="300" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            {/* Cerchio bianco */}
            <div className="circle"></div>
            {/* Icona "+" */}
            <div className="plus-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="small-plus-icon">
                <g clipPath="url(#clip0_11_448)">
                  <path d="M50 8.33337C27 8.33337 8.33337 27 8.33337 50C8.33337 73 27 91.6667 50 91.6667C73 91.6667 91.6667 73 91.6667 50C91.6667 27 73 8.33337 50 8.33337ZM66.6667 54.1667H54.1667V66.6667C54.1667 68.9584 52.2917 70.8334 50 70.8334C47.7084 70.8334 45.8334 68.9584 45.8334 66.6667V54.1667H33.3334C31.0417 54.1667 29.1667 52.2917 29.1667 50C29.1667 47.7084 31.0417 45.8334 33.3334 45.8334H45.8334V33.3334C45.8334 31.0417 47.7084 29.1667 50 29.1667C52.2917 29.1667 54.1667 31.0417 54.1667 33.3334V45.8334H66.6667C68.9584 45.8334 70.8334 47.7084 70.8334 50C70.8334 52.2917 68.9584 54.1667 66.6667 54.1667Z" fill="#06D6A0"/>
                </g>
                <defs>
                  <clipPath id="clip0_11_448">
                    <rect width="100" height="100" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <p className="text-center text-2xl font-semibold mt-4">REGISTRA LA TUA AGENZIA</p>
        </a>

        {/* Form di Accesso */}
        <div className="login-box-agenzia">
          <form id="loginForm" className="flex flex-col gap-0 justify-between h-full w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-0 w-full">
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                className="p-3 border border-gray-300 rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
                className="p-3 border border-gray-300 rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center mt-2">
              <button type="submit" className="btn-custom">
                ACCEDI
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AreaAgenzia;
