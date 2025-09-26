import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./RegistrazioneAgenzia.css";

function validaPartitaIVA(piva) {
  piva = piva.trim();
  if (!/^\d{11}$/.test(piva)) return false;
  let somma = 0;
  for (let i = 0; i < 11; i++) {
    let cifra = parseInt(piva[i]);
    if (i % 2 === 0) {
      somma += cifra;
    } else {
      let doppio = cifra * 2;
      somma += doppio > 9 ? doppio - 9 : doppio;
    }
  }
  return somma % 10 === 0;
}

const RegistrazioneAgenzia = () => {
  const navigate = useNavigate();

  // Form state
  const [nomeAgenzia, setNomeAgenzia] = useState("");
  const [partitaIVA, setPartitaIVA] = useState("");
  const [nomeAdmin, setNomeAdmin] = useState("");
  const [cognomeAdmin, setCognomeAdmin] = useState("");
  const [emailAdmin, setEmailAdmin] = useState("");

  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState("");

  // Handlers
  const handleLogoClick = () => {
    navigate("/");
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate("/area-agenzia");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !nomeAgenzia.trim() ||
      !partitaIVA.trim() ||
      !nomeAdmin.trim() ||
      !cognomeAdmin.trim() ||
      !emailAdmin.trim()
    ) {
      toast.error("⚠ Tutti i campi sono obbligatori!");
      return;
    }

    if (!validaPartitaIVA(partitaIVA)) {
      toast.error("⚠ La partita IVA inserita non è valida");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/admins/create-agency",
        {
          agencyName: nomeAgenzia,
          vatNumber: partitaIVA,
          adminFirstName: nomeAdmin,
          adminLastName: cognomeAdmin,
          adminEmail: emailAdmin
        }
      );
      setQrCodeBase64(response.data.base64QRCode || "");
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Errore nella registrazione: " + (error.response?.data?.message || "Controlla i dati inseriti."));
    }
  };

  const handleSuccessProceed = () => {
    setShowSuccessModal(false);
    navigate("/area-agenzia");
  };

  return (
    <div className="reg-agenzia-root" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="header-container justify-center">
        <div className="logo-title mx-auto" id="logo-title" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
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

      {/* Back link */}
      <div className="flex justify-center w-full mb-4 mt-8">
        <button className="back-link" onClick={handleBackClick}>
          <span className="green-symbol" style={{display: "inline-flex", verticalAlign: "middle", marginRight: "6px"}}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{display: "inline"}} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L6 9L12 3" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Torna all'Area Agenzia
        </button>
      </div>

      {/* Card centrale */}
      <div className="reg-agenzia-card wide">
        {/* Info-box sopra il form */}
        <div className="reg-agenzia-infobox">
          <div className="reg-agenzia-infobox-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#FFD943"/>
              <rect x="11" y="10" width="2" height="7" rx="1" fill="#073B4C"/>
              <rect x="11" y="7" width="2" height="2" rx="1" fill="#073B4C"/>
            </svg>
          </div>
          <div className="reg-agenzia-infobox-text">
            <strong>Registrare la tua agenzia ti permette di:</strong>
            <ul>
              <li>Proteggere i dati e la privacy dei tuoi clienti</li>
              <li>Gestire il tuo team in modo semplice e sicuro</li>
              <li>Accedere a funzionalità avanzate</li>
              <li>Ricevere assistenza dedicata</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form className="reg-agenzia-form" onSubmit={handleSubmit}>
          <div className="reg-agenzia-form-group">
            <label htmlFor="nomeAgenzia">Nome dell’Agenzia</label>
            <input
              type="text"
              id="nomeAgenzia"
              value={nomeAgenzia}
              onChange={(e) => setNomeAgenzia(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="reg-agenzia-form-group">
            <label htmlFor="partitaIVA">Partita IVA</label>
            <input
              type="text"
              id="partitaIVA"
              value={partitaIVA}
              onChange={(e) => setPartitaIVA(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="reg-agenzia-form-group">
            <label htmlFor="nomeAdmin">Nome dell’Amministratore</label>
            <input
              type="text"
              id="nomeAdmin"
              value={nomeAdmin}
              onChange={(e) => setNomeAdmin(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="reg-agenzia-form-group">
            <label htmlFor="cognomeAdmin">Cognome dell’Amministratore</label>
            <input
              type="text"
              id="cognomeAdmin"
              value={cognomeAdmin}
              onChange={(e) => setCognomeAdmin(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="reg-agenzia-form-group">
            <label htmlFor="emailAdmin">Email dell’Amministratore</label>
            <input
              type="email"
              id="emailAdmin"
              value={emailAdmin}
              onChange={(e) => setEmailAdmin(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <button type="submit" className="reg-agenzia-button">
            REGISTRA
          </button>
        </form>
      </div>

      {/* Modale di Conferma */}
      {showSuccessModal && (
        <div className="reg-agenzia-modal-bg">
          <div className="reg-agenzia-modal-card">
            <div className="reg-agenzia-modal-icon">
              <svg width="80" height="80" viewBox="0 0 110 110" fill="none">
                <circle cx="55" cy="55" r="50" fill="#4DC538"/>
                <path d="M42.5791 74.6626L26.125 58.2084C24.3375 56.4209 24.3375 53.5334 26.125 51.7459C27.9125 49.9584 30.8 49.9584 32.5875 51.7459L45.8333 64.9459L77.3666 33.4126C79.1541 31.6251 82.0416 31.6251 83.8291 33.4126C85.6166 35.2001 85.6166 38.0876 83.8291 39.8751L49.0416 74.6626C47.3 76.4501 44.3666 76.4501 42.5791 74.6626Z" fill="#fff"/>
              </svg>
            </div>
            <h2>Registrazione completata!</h2>
            <p>
              L'agenzia è stata registrata con successo.<br/>
              <strong>Scansiona il QR code qui sotto</strong> per accedere rapidamente all'area agenzia.<br/>
              Conserva il codice per futuri accessi.
            </p>
            {qrCodeBase64 && (
              <div style={{ margin: "20px 0" }}>
                <img
                  src={`data:image/png;base64,${qrCodeBase64}`}
                  alt="QR Code"
                  style={{ width: "128px", height: "128px" }}
                />
              </div>
            )}
            <button className="reg-agenzia-modal-button" onClick={handleSuccessProceed}>PROSEGUI</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrazioneAgenzia;
