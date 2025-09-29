import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import "../components/Navbar/Navbar.css";
import "./ProfiloAdmin.css";

const ProfiloAdmin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          "http://localhost:8080/api/admins/profile",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        const backendAdmin = response.data;
        setAdmin({
          nome: backendAdmin.firstName,
          cognome: backendAdmin.lastName,
          email: backendAdmin.email,
          partitaIVA: backendAdmin.vatNumber
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Sessione scaduta. Effettua di nuovo il login.");
          setTimeout(() => {
            navigate("/home-admin");
          }, 2000);
        } else {
          toast.error("Errore nel caricamento del profilo.");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 max-w-4xl w-full" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar role="admin" />

      {/* Profilo */}
      <div className="container-profilo">
        <div className="profilePicture">
          <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_20_523)">
              <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
            </g>
          </svg>
        </div>
        {loading ? (
          <div className="field">Caricamento profilo admin...</div>
        ) : admin ? (
          <>
            <div className="field"><strong>Nome:</strong> <span>{admin.nome}</span></div>
            <div className="field"><strong>Cognome:</strong> <span>{admin.cognome}</span></div>
            <div className="field"><strong>Email:</strong> <span>{admin.email}</span></div>
            <div className="field"><strong>Partita IVA:</strong> <span>{admin.partitaIVA}</span></div>
          </>
        ) : null}
        <div style={{ marginTop: "24px", textAlign: "right" }}>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("userEmail");
              localStorage.removeItem("role");
              window.location.href = "/home";
            }}
          >
            Esci
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfiloAdmin;
