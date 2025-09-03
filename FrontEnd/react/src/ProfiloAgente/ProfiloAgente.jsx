import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfiloAgente.css";

const ProfiloAgente = () => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          "http://localhost:8080/api/estate-agents/profile",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        // Mappa i dati del backend ai campi frontend
        const backendAgent = response.data;
        setAgent({
          nome: backendAgent.firstName,
          cognome: backendAgent.lastName,
          email: backendAgent.email,
          telefono: backendAgent.telephoneNumber,
          qualifiche: backendAgent.qualifications,
          password: backendAgent.password
        });
        setFormData({
          nome: backendAgent.firstName,
          cognome: backendAgent.lastName,
          email: backendAgent.email,
          telefono: backendAgent.telephoneNumber,
          qualifiche: backendAgent.qualifications,
          password: backendAgent.password
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMsg("Sessione scaduta. Effettua di nuovo il login.");
          setTimeout(() => {
            navigate("/home-agente");
          }, 2000);
        } else {
          setErrorMsg("Errore nel caricamento del profilo.");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      // Prepara i dati da inviare, omettendo la password se non modificata
      const payload = {
        firstName: formData.nome,
        lastName: formData.cognome,
        email: formData.email,
        telephoneNumber: formData.telefono,
        qualifications: formData.qualifiche
      };
      // Invia la password solo se è stata modificata
      if (formData.password && formData.password !== agent.password) {
        payload.password = formData.password;
      }
      await axios.patch(
        "http://localhost:8080/api/estate-agents/profile",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setAgent(formData);
      setIsEditing(false);
      alert("Profilo aggiornato con successo! Devi effettuare nuovamente il login.");
      // Logout e redirect al login
      localStorage.removeItem("jwtToken");
      navigate("/area-agenzia");

    } catch (error) {
      alert("Errore nell'aggiornamento del profilo.");
      console.error(error);
    }
  };

  // Navigazione SPA
  const handleLogoClick = () => {
    navigate("/home-agente");
  };

  const handleNotificheClick = () => {
    navigate("/notifiche-agente");
  };

  const handleProfiloClick = () => {
    navigate("/profilo-agente");
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/home-agente");
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
          <div style={{ width: "120px", display: "inline-block" }}></div>
          <div className="icon-text hide-on-small" onClick={handleNotificheClick}>
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <path d="M41.6667 8.33325H8.33335C6.04169 8.33325 4.16669 10.2083 4.16669 12.4999V37.4999C4.16669 39.7916 6.04169 41.6666 8.33335 41.6666H41.6667C43.9584 41.6666 45.8334 39.7916 45.8334 37.4999V12.4999C45.8334 10.2083 43.9584 8.33325 41.6667 8.33325ZM40.8334 17.1874L27.2084 25.7083C25.8542 26.5624 24.1459 26.5624 22.7917 25.7083L9.16669 17.1874C8.64585 16.8541 8.33335 16.2916 8.33335 15.6874C8.33335 14.2916 9.85419 13.4583 11.0417 14.1874L25 22.9166L38.9584 14.1874C40.1459 13.4583 41.6667 14.2916 41.6667 15.6874C41.6667 16.2916 41.3542 16.8541 40.8334 17.1874Z" fill="#073B4C"/>
            </svg>
            <span>Notifiche</span>
          </div>
          {/* Profilo */}
          <div className="icon-text" onClick={handleProfiloClick}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <g clipPath="url(#clip0_20_523)">
                <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="flex justify-start w-full mb-4 pl-8 mt-8">
        <a href="/home-agente" className="back-link" onClick={handleBack}>
          <span className="green-symbol" style={{display: "inline-flex", verticalAlign: "middle", marginRight: "6px"}}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{display: "inline"}} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L6 9L12 3" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Torna alla home
        </a>
      </div>

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
          <div className="field">Caricamento profilo agente...</div>
        ) : errorMsg ? (
          <div className="field error">{errorMsg}</div>
        ) : agent ? (
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
                <span>{agent.nome}</span>
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
                <span>{agent.cognome}</span>
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
                <span>{agent.email}</span>
              )}
            </div>
            <div className="field">
              <strong>Telefono:</strong>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <span>{agent.telefono}</span>
              )}
            </div>
            <div className="field">
              <strong>Biografia:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.qualifiche}
                  onChange={(e) => setFormData({ ...formData, qualifiche: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <span>{agent.qualifiche}</span>
              )}
            </div>
            <div className="field">
              <strong>Password:</strong>
              {isEditing ? (
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <span>{showPassword ? agent.password : "********"}</span>
              )}
              <button className="toggle-btn" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "X" : "MOSTRA"}
              </button>
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
              {isEditing && (
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setFormData(agent);
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

export default ProfiloAgente;
