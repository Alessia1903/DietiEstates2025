import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AggiungiCollaboratore.css";

const AggiungiCollaboratore = () => {
  const navigate = useNavigate();

  // Stati per form e modali
  const [nomeCo, setNomeCo] = useState("");
  const [cognomeCo, setCognomeCo] = useState("");
  const [emailCo, setEmailCo] = useState("");
  const [erroreMessaggio, setErroreMessaggio] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState("");

  // Gestione click su logo/titolo
  const handleLogoClick = () => {
    navigate("/home-admin");
  };

  // Gestione submit form
  const [pendingData, setPendingData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroreMessaggio("");

    if (!nomeCo || !cognomeCo || !emailCo) {
      setErroreMessaggio("⚠ Tutti i campi sono obbligatori!");
      return;
    }

    // Salva i dati in pendingData e mostra il modale di conferma
    setPendingData({
      email: emailCo,
      firstName: nomeCo,
      lastName: cognomeCo
    });
    setShowWarningModal(true);
  };

  // Chiamata backend solo dopo conferma
  const handleConfirmWarning = async () => {
    setShowWarningModal(false);
    if (!pendingData) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://localhost:8080/api/admins/create-admin",
        pendingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = response.data;

      if (result.base64QRCode) {
        setQrCodeBase64(result.base64QRCode);
        setShowSuccessModal(true);
      } else {
        setErroreMessaggio("❌ Errore imprevisto. Riprova più tardi.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErroreMessaggio("⚠ Email già esistente");
      } else {
        setErroreMessaggio("❌ Errore di connessione. Controlla la tua rete.");
      }
    }
    setPendingData(null);
  };

  const handleCancelWarning = () => {
    setShowWarningModal(false);
    setPendingData(null);
  };

  const handleConfirmSuccess = () => {
    navigate("/home-admin");
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Barra superiore */}
      <div className="header-container">
        {/* Logo e Titolo */}
        <div className="logo-title" id="logo-title" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
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

        {/* Sezioni Icone */}
        <div className="top-right-icons">
          <div style={{ width: "120px", display: "inline-block" }}></div>
          <div
            className="icon-text"
            onClick={() => navigate("/profilo-admin")}
          >
            {/* SVG Utente */}
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <g clipPath="url(#clip0_20_523)">
                <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-start w-full mb-4 pl-8 mt-8">
        <a href="/home-admin" className="back-link" onClick={e => {e.preventDefault(); navigate("/home-admin");}}>
          <span className="green-symbol" style={{display: "inline-flex", verticalAlign: "middle", marginRight: "6px"}}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{display: "inline"}} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L6 9L12 3" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Torna alla home admin
        </a>
      </div>

      <div className="container-role">
        <div className="role-left">
          <div className="new-agent-icon">
            <div className="icon-wrapper" style={{ position: "relative" }}>
              {/* SVG principale */}
              <svg className="main-icon" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <g clipPath="url(#clip0_23_327)">
                  <path d="M59.901 59.9008C70.9328 59.9008 79.868 50.9656 79.868 39.9338C79.868 28.902 70.9328 19.9668 59.901 19.9668C48.8693 19.9668 39.934 28.902 39.934 39.9338C39.934 50.9656 48.8693 59.9008 59.901 59.9008ZM59.901 69.8843C46.5731 69.8843 19.967 76.5732 19.967 89.8513V94.843C19.967 97.5885 22.2133 99.8348 24.9588 99.8348H94.8433C97.5887 99.8348 99.835 97.5885 99.835 94.843V89.8513C99.835 76.5732 73.229 69.8843 59.901 69.8843Z" fill="#073B4C"/>
                </g>
                <defs>
                  <clipPath id="clip0_23_327">
                    <rect width="119.802" height="119.802" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

              {/* SVG overlay */}
              <svg className="overlay-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path d="M41.6666 12.5002H25L22.0625 9.56266C21.2708 8.771 20.2083 8.3335 19.1041 8.3335H8.33329C6.04163 8.3335 4.18746 10.2085 4.18746 12.5002L4.16663 37.5002C4.16663 39.7918 6.04163 41.6668 8.33329 41.6668H41.6666C43.9583 41.6668 45.8333 39.7918 45.8333 37.5002V16.6668C45.8333 14.3752 43.9583 12.5002 41.6666 12.5002ZM29.1666 33.3335H12.5V29.1668H29.1666V33.3335ZM37.5 25.0002H12.5V20.8335H37.5V25.0002Z" fill="#06D6A0"/>
              </svg>
            </div>
          </div>
          <div className="agent-imm">
            COLLABORATORE
          </div>
        </div>
        <div className="def-role">
          Un Collaboratore può svolgere qualsiasi mansione operativa di un amministratore, potendo quindi anche creare altri account per nuovi agenti immobiliari.
        </div>
      </div>

      {/* Sezione Aggiunta Collaboratore */}
      <div className="aggiungiCollaboratore w-full max-w-lg mt-10 bg-white p-6 rounded-lg shadow-lg">
        <form className="aggiungiCollaboratoreForm flex-col" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nomeCo">Nome</label>
            <input
              type="text"
              id="nomeCo"
              required
              value={nomeCo}
              onChange={e => setNomeCo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cognomeCo">Cognome</label>
            <input
              type="text"
              id="cognomeCo"
              required
              value={cognomeCo}
              onChange={e => setCognomeCo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailCo">Indirizzo Email</label>
            <input
              type="email"
              id="emailCo"
              required
              value={emailCo}
              onChange={e => setEmailCo(e.target.value)}
            />
          </div>
          {erroreMessaggio && (
            <div className="error-message" style={{ display: "block" }}>
              {erroreMessaggio}
            </div>
          )}
        </form>
      </div>

      <button
        type="button"
        className="accesso px-6 py-2 mt-6 rounded-md"
        onClick={handleSubmit}
      >
        PROSEGUI
      </button>

      {/* Modale di Avviso */}
      {showWarningModal && (
        <div id="warningModal" style={{
          display: "flex",
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="modal-outer">
            <div className="modal-inner">
              <div data-svg-wrapper>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <path d="M22.35 105H97.65C105.35 105 110.15 96.6499 106.3 89.9999L68.65 24.9499C64.8 18.2999 55.2 18.2999 51.35 24.9499L13.7 89.9999C9.85 96.6499 14.65 105 22.35 105ZM60 69.9999C57.25 69.9999 55 67.7499 55 64.9999V54.9999C55 52.2499 57.25 49.9999 60 49.9999C62.75 49.9999 65 52.2499 65 54.9999V64.9999C65 67.7499 62.75 69.9999 60 69.9999ZM65 89.9999H55V79.9999H65V89.9999Z" fill="#FFD943"/>
                </svg>
              </div>
              <p className="modal-text">Una volta registrato il nuovo dipendente i dati NON potranno essere modificati.</p>
              <div className="modal-spacer"></div>
              <div className="modal-buttons">
                <button id="cancelButton" onClick={handleCancelWarning}>INDIETRO</button>
                <button id="confirmWarningButton" onClick={handleConfirmWarning}>PROSEGUI</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale di Conferma */}
      {showSuccessModal && (
        <div id="successModal" style={{
          display: "flex",
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="modal-outer-success">
            <div className="modal-inner-success">
              <div data-svg-wrapper>
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                  <path d="M55 9.16675C29.7 9.16675 9.16663 29.7001 9.16663 55.0001C9.16663 80.3001 29.7 100.833 55 100.833C80.3 100.833 100.833 80.3001 100.833 55.0001C100.833 29.7001 80.3 9.16675 55 9.16675ZM42.5791 74.6626L26.125 58.2084C24.3375 56.4209 24.3375 53.5334 26.125 51.7459C27.9125 49.9584 30.8 49.9584 32.5875 51.7459L45.8333 64.9459L77.3666 33.4126C79.1541 31.6251 82.0416 31.6251 83.8291 33.4126C85.6166 35.2001 85.6166 38.0876 83.8291 39.8751L49.0416 74.6626C47.3 76.4501 44.3666 76.4501 42.5791 74.6626Z" fill="#4DC538"/>
                </svg>
              </div>
              <h2>Complimenti!</h2>
              <p>Il nuovo collaboratore è stato registrato con successo.</p>
              <strong>Scansiona il QR code qui sotto</strong> per visualizzare le credenziali collaboratore.<br/>
              {qrCodeBase64 && (
              <div style={{ margin: "20px 0" }}>
                <img
                  src={`data:image/png;base64,${qrCodeBase64}`}
                  alt="QR Code"
                  style={{ width: "128px", height: "128px" }}
                />
              </div>
              )}
              <div className="modal-spacer"></div>
              <button id="confirmSuccessButton" onClick={handleConfirmSuccess}>PROSEGUI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AggiungiCollaboratore;
