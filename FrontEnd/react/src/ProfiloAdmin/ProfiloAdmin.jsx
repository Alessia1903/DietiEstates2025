import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfiloAdmin.css";

const MOCK_ADMIN = {
  nome: "Mario",
  cognome: "Rossi",
  email: "admin.rossi@email.com",
  password: "passwordAdmin",
  partitaIVA: "IT12345678901"
};

const ProfiloAdmin = () => {
  const navigate = useNavigate();
  const [admin] = useState(MOCK_ADMIN);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogoClick = () => {
    navigate("/home-admin");
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/home-admin");
  };

  return (
    <div className="flex flex-col items-center p-8 max-w-4xl w-full" style={{ fontFamily: "'Lexend', sans-serif" }}>
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
          {/* Profilo identico a HomeAdmin */}
          <div className="admin-profile-icon" style={{ cursor: "pointer" }} onClick={() => navigate("/profilo-admin")}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_20_523)">
                <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="flex justify-start w-full mb-4 pl-8 mt-8">
        <a href="/home-admin" className="back-link" onClick={handleBack}>
          <span className="green-symbol" style={{display: "inline-flex", verticalAlign: "middle", marginRight: "6px"}}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{display: "inline"}} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L6 9L12 3" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Torna alla home admin
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
        <div className="field"><strong>Nome:</strong> <span>{admin.nome}</span></div>
        <div className="field"><strong>Cognome:</strong> <span>{admin.cognome}</span></div>
        <div className="field"><strong>Email:</strong> <span>{admin.email}</span></div>
        <div className="field">
          <strong>Password:</strong>
          <span>{showPassword ? admin.password : "********"}</span>
          <button className="toggle-btn" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? "X" : "MOSTRA"}
          </button>
        </div>
        <div className="field"><strong>Partita IVA:</strong> <span>{admin.partitaIVA}</span></div>
      </div>
    </div>
  );
};

export default ProfiloAdmin;
