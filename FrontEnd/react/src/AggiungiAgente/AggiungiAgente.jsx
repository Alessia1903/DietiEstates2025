import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AggiungiAgente.css";

// SVG e immagini sono inclusi direttamente come nel file originale

const AggiungiAgente = () => {
  const navigate = useNavigate();

  // Stati per form e modali
  const [nomeAg, setNomeAg] = useState("");
  const [cognomeAg, setCognomeAg] = useState("");
  const [emailAg, setEmailAg] = useState("");
  const [telefonoAg, setTelefonoAg] = useState("");
  const [erroreMessaggio, setErroreMessaggio] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState("");

  // Gestione click su logo/titolo
  const handleLogoClick = () => {
    navigate("/home-admin");
  };

  // Gestione submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroreMessaggio("");

    if (!nomeAg || !cognomeAg || !emailAg || !telefonoAg) {
      setErroreMessaggio("⚠ Tutti i campi sono obbligatori!");
      return;
    }

    const dati = { nomeAg, cognomeAg, emailAg, telefonoAg };

    try {
      const response = await fetch(
        "https://cd5480b0-66c3-4d3f-8864-98af937fa5de.mock.pstmn.io/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dati),
        }
      );
      const result = await response.json();

      if (response.ok) {
        // Simula chiamata al backend per ottenere il QR code
        // Sostituisci questa parte con la vera chiamata API
        const fakeQrCodeBase64 = "iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAIAAAADJ/2KAAABPUlEQVR42uWYyw6DMAwEm6r//8v0wCWStdbYubAml1YUcDNZP9d1XZ9nr+/n8et3f6y14AM39ft+8l09y235UNz/tVr77vc7I5udZU6I2HKjqHSpdhy5Rn6KPbflSZEsRSv35elx8YRlfoX7+CyKJ7ohfl215UaRZ89qviY6Nqa4esrLGcTo+I64qHST54zci3vso10fLZ5kVV51K1r5aTh7NNlfT2fVfDOLIq8UidqILp1zdOzueHUYz4RwUm9266MVv1xJvfqFK9vZo0m24B0x19/EPppQyT067wbVm521SGrBXp3S64fe1LtUa+w8ekzpXapaqWq0N9+ZPuvOKxSeP3LVzp11k/jH+5W5ObpX86kMzuNA/HX6rJv3xaQmMp5GHM26q5FSaS4/h7mz7qieXpZX1j3ni09eBhT/mqhonaWq8LwAAAAASUVORK5CYII"; // esempio, da sostituire
        setQrCodeBase64(fakeQrCodeBase64);
        setShowWarningModal(true);
      } else if (response.status === 409) {
        setErroreMessaggio("⚠ " + result.message);
      } else {
        setErroreMessaggio("❌ Errore imprevisto. Riprova più tardi.");
      }
    } catch (error) {
      setErroreMessaggio("❌ Errore di connessione. Controlla la tua rete.");
    }
  };

  // Gestione modali
  const handleConfirmWarning = () => {
    setShowWarningModal(false);
    setShowSuccessModal(true);
  };

  const handleCancelWarning = () => {
    setShowWarningModal(false);
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
            <div className="icon-wrapper">
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
                <g clipPath="url(#clip0_23_465)">
                  <path d="M25 14.5833V10.4167C25 8.125 23.125 6.25 20.8333 6.25H8.33329C6.04163 6.25 4.16663 8.125 4.16663 10.4167V39.5833C4.16663 41.875 6.04163 43.75 8.33329 43.75H41.6666C43.9583 43.75 45.8333 41.875 45.8333 39.5833V18.75C45.8333 16.4583 43.9583 14.5833 41.6666 14.5833H25ZM12.5 39.5833H8.33329V35.4167H12.5V39.5833ZM12.5 31.25H8.33329V27.0833H12.5V31.25ZM12.5 22.9167H8.33329V18.75H12.5V22.9167ZM12.5 14.5833H8.33329V10.4167H12.5V14.5833ZM20.8333 39.5833H16.6666V35.4167H20.8333V39.5833ZM20.8333 31.25H16.6666V27.0833H20.8333V31.25ZM20.8333 22.9167H16.6666V18.75H20.8333V22.9167ZM20.8333 14.5833H16.6666V10.4167H20.8333V14.5833ZM39.5833 39.5833H25V35.4167H29.1666V31.25H25V27.0833H29.1666V22.9167H25V18.75H39.5833C40.7291 18.75 41.6666 19.6875 41.6666 20.8333V37.5C41.6666 38.6458 40.7291 39.5833 39.5833 39.5833ZM37.5 22.9167H33.3333V27.0833H37.5V22.9167ZM37.5 31.25H33.3333V35.4167H37.5V31.25Z" fill="#06D6A0"/>
                </g>
                <defs>
                  <clipPath id="clip0_23_465">
                    <rect width="50" height="50" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="agent-imm">
            AGENTE IMMOBILIARE
          </div>
        </div>
        <div className="def-role">
          Un Agente Immobiliare può svolgere qualsiasi mansione operativa, come caricare annunci di nuovi immobili, ma non può creare altri account.
        </div>
      </div>

      {/* Sezione Aggiunta Agente */}
      <div className="aggiungiAgente w-full max-w-lg mt-10 bg-white p-6 rounded-lg shadow-lg">
        <form className="aggiungiAgenteForm flex-col" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nomeAg">Nome</label>
            <input
              type="text"
              id="nomeAg"
              required
              value={nomeAg}
              onChange={e => setNomeAg(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cognomeAg">Cognome</label>
            <input
              type="text"
              id="cognomeAg"
              required
              value={cognomeAg}
              onChange={e => setCognomeAg(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailAg">Indirizzo Email</label>
            <input
              type="email"
              id="emailAg"
              required
              value={emailAg}
              onChange={e => setEmailAg(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefonoAg">Numero di telefono</label>
            <input
              type="tel"
              id="telefonoAg"
              required
              value={telefonoAg}
              onChange={e => setTelefonoAg(e.target.value)}
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
              <p>Il nuovo agente è stato registrato con successo.</p>
              <strong>Scansiona il QR code qui sotto</strong> per visualizzare le credenziali agente.<br/>
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

export default AggiungiAgente;
