import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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

  // Navigazione SPA
  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
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
        <div className="top-right-icons">
          {/* Notifiche */}
          <div className="icon-text hide-on-small" onClick={() => navigate("/notifiche-utente")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" fill="none" className="custom-text-color">
              <g clipPath="url(#clip0_26_983)">
                <path d="M41.6665 8.33337H8.33317C6.0415 8.33337 4.1665 10.2084 4.1665 12.5V37.5C4.1665 39.7917 6.0415 41.6667 8.33317 41.6667H41.6665C43.9582 41.6667 45.8332 39.7917 45.8332 37.5V12.5C45.8332 10.2084 43.9582 8.33337 41.6665 8.33337ZM40.8332 17.1875L27.2082 25.7084C25.854 26.5625 24.1457 26.5625 22.7915 25.7084L9.1665 17.1875C8.64567 16.8542 8.33317 16.2917 8.33317 15.6875C8.33317 14.2917 9.854 13.4584 11.0415 14.1875L24.9998 22.9167L38.9582 14.1875C40.1457 13.4584 41.6665 14.2917 41.6665 15.6875C41.6665 16.2917 41.354 16.8542 40.8332 17.1875Z" fill="#073B4C"/>
              </g>
              <defs>
                <clipPath id="clip0_26_983">
                  <rect width="50" height="50" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Notifiche</span>
          </div>
          {/* Cronologia */}
          <div className="icon-text hide-on-small" onClick={() => navigate("/cronologia")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" fill="none" className="custom-text-color">
              <g clipPath="url(#clip0_26_980)">
                <path d="M27.6248 6.24995C17.0206 5.95828 8.33311 14.4791 8.33311 24.9999H4.60395C3.66645 24.9999 3.20811 26.1249 3.87478 26.7708L9.68728 32.6041C10.1039 33.0208 10.7498 33.0208 11.1664 32.6041L16.9789 26.7708C17.6248 26.1249 17.1664 24.9999 16.2289 24.9999H12.4998C12.4998 16.8749 19.1248 10.3124 27.2914 10.4166C35.0414 10.5208 41.5623 17.0416 41.6664 24.7916C41.7706 32.9374 35.2081 39.5833 27.0831 39.5833C23.7289 39.5833 20.6248 38.4374 18.1664 36.4999C17.3331 35.8541 16.1664 35.9166 15.4164 36.6666C14.5414 37.5416 14.6039 39.0208 15.5831 39.7708C18.7498 42.2708 22.7289 43.7499 27.0831 43.7499C37.6039 43.7499 46.1248 35.0624 45.8331 24.4583C45.5623 14.6874 37.3956 6.52078 27.6248 6.24995ZM26.5623 16.6666C25.7081 16.6666 24.9998 17.3749 24.9998 18.2291V25.8958C24.9998 26.6249 25.3956 27.3124 26.0206 27.6874L32.5206 31.5416C33.2706 31.9791 34.2289 31.7291 34.6664 30.9999C35.1039 30.2499 34.8539 29.2916 34.1248 28.8541L28.1248 25.2916V18.2083C28.1248 17.3749 27.4164 16.6666 26.5623 16.6666Z" fill="#073B4C"/>
              </g>
              <defs>
                <clipPath id="clip0_26_980">
                  <rect width="50" height="50" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Cronologia</span>
          </div>
          {/* Preferiti */}
          <div className="icon-text hide-on-small" onClick={() => navigate("/preferiti")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" fill="none">
              <path d="M25 45.8333C23.9583 45.8333 22.9167 45.4167 22.0833 44.6875L7.29167 31.25C4.16667 28.5417 2.08333 24.8958 2.08333 20.8333C2.08333 13.2292 8.22917 7.08333 15.8333 7.08333C19.6875 7.08333 23.2292 8.95833 25 12.0833C26.7708 8.95833 30.3125 7.08333 34.1667 7.08333C41.7708 7.08333 47.9167 13.2292 47.9167 20.8333C47.9167 24.8958 45.8333 28.5417 42.7083 31.25L27.9167 44.6875C27.0833 45.4167 26.0417 45.8333 25 45.8333Z" fill="#06D6A0"/>
            </svg>
            <span>Preferiti</span>
          </div>
          {/* Profilo */}
          <div className="icon-text" onClick={() => navigate("/profilo-utente")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 60 60" fill="none" className="top-right custom-text-color">
              <g clipPath="url(#clip0_26_978)">
                <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
              </g>
              <defs>
                <clipPath id="clip0_26_978">
                  <rect width="60" height="60" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="flex justify-start w-full mb-4 pl-8 mt-8">
        <a href="/home" className="back-link" onClick={handleBack}>
          <span className="green-symbol" style={{display: "inline-flex", verticalAlign: "middle", marginRight: "6px"}}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{display: "inline"}} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L6 9L12 3" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Torna alla home
        </a>
      </div>

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
