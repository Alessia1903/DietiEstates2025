import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfiloAgente.css";

// MOCK dati profilo agente
const MOCK_PROFILO = {
  nome: "Mario",
  cognome: "Rossi",
  email: "mario.rossi@agenzia.it",
  password: "password123",
  telefono: "3331234567",
  bio: "Agente immobiliare con esperienza pluriennale."
};

const ProfiloAgente = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(MOCK_PROFILO);
  const [user, setUser] = useState(MOCK_PROFILO);

  const handleSave = () => {
    // In futuro, qui verrà fatta la chiamata al backend
    setUser(formData);
    setIsEditing(false);
  };

  const handleLogoClick = () => {
    navigate("/home-agente");
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/home-agente");
  };

  const handleNotificheClick = () => {
    navigate("/notifiche-agente");
  };

  const handleProfiloClick = () => {
    navigate("/profilo-agente");
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
          {/* Spacer to keep header wide */}
          <div style={{ width: "120px", display: "inline-block" }}></div>
          {/* Notifiche */}
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
        <div className="field">
          <strong>Numero di telefono:</strong>
          {isEditing ? (
            <input
              type="tel"
              value={formData.telefono || ""}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="edit-input"
            />
          ) : (
            <span>{user.telefono || "-"}</span>
          )}
        </div>
        <div className="field">
          <strong>Biografia:</strong>
          {isEditing ? (
            <textarea
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="edit-input"
              rows={3}
            />
          ) : (
            <span>{user.bio || "-"}</span>
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
            <span>{showPassword ? user.password : "********"}</span>
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
                setFormData(user);
                setIsEditing(false);
              }}
            >
              Annulla
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfiloAgente;
