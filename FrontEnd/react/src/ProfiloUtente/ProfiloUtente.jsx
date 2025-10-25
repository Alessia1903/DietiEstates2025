import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import "../components/Navbar/Navbar.css";
import "./ProfiloUtente.css";

const ProfiloUtente = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          "http://localhost:8080/api/buyers/profile",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        // Mappa i dati del backend ai campi frontend
        const backendUser = response.data;
        setUser({
          nome: backendUser.firstName,
          cognome: backendUser.lastName,
          datanascita: backendUser.birthdate,
          email: backendUser.email
        });
        setFormData({
          nome: backendUser.firstName,
          cognome: backendUser.lastName,
          datanascita: backendUser.birthdate,
          email: backendUser.email
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Sessione scaduta. Effettua di nuovo il login.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error("Errore nel caricamento del profilo.");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      const payload = {
        firstName: formData.nome,
        lastName: formData.cognome,
        birthdate: formData.datanascita,
        email: formData.email
      };
      await axios.patch(
        "http://localhost:8080/api/buyers/profile",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setUser(formData);
      setIsEditing(false);
      toast.success("Profilo aggiornato con successo! Devi effettuare nuovamente il login.");
      // Logout e redirect al login
      localStorage.removeItem("jwtToken");
      navigate("/login");

    } catch (error) {
      toast.error("Errore nell'aggiornamento del profilo.");
      console.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar role="user" />    

      {/* Profilo */}
      <div className="container-profilo-utente">
        <div className="profilePicture">
          <svg width="120" height="120" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_20_523)">
              <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
            </g>
          </svg>
        </div>
        {loading ? (
          <div className="field">Caricamento profilo utente...</div>
        ) : user ? (
          <>
            <div className="field">
              <strong>Nome:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <span>{user.nome}</span>
              )}
            </div>
            <div className="field">
              <strong>Cognome:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.cognome}
                  onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <span>{user.cognome}</span>
              )}
            </div>
            <div className="field">
              <strong>Data di nascita:</strong>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.datanascita || ""}
                  onChange={(e) => setFormData({ ...formData, datanascita: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <span>{user.datanascita}</span>
              )}
            </div>
            <div className="field">
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            <div className="edit-action">
              <button 
                className={`edit-btn ${isEditing ? 'save' : ''}`} 
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? 'Salva' : 'Modifica dati'}
              </button>
              {!isEditing && (
                <button
                  className="logout-btn"
                  style={{ marginLeft: "12px" }}
                  onClick={() => {
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("role");
                    window.location.href = "/home";
                  }}
                >
                  Esci
                </button>
              )}
              {isEditing && (
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setFormData(user);
                    setIsEditing(false);
                  }}
                >
                  Annulla
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProfiloUtente;
