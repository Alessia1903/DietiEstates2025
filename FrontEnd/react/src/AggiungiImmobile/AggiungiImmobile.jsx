import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AggiungiImmobile.css";

const initialForm = {
  city: "",
  town: "",
  address: "",
  civicNumber: "",
  floor: "",
  totalFloors: "",
  surface: "",
  elevator: false,
  rooms: "",
  energyClass: "",
  arredamento: "",
  riscaldamento: "",
  stato: "",
  contratto: "",
  description: "",
  price: "",
  file: null,
};

const AggiungiImmobile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [fileName, setFileName] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Gestione input generico
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestione radio
  const handleRadio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gestione file upload
  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      file,
    }));
    setFileName(file ? file.name : "");
  };

  // Validazione base
  const validate = () => {
    const requiredFields = [
      "city", "town", "address", "civicNumber", "floor", "totalFloors", "surface",
      "rooms", "energyClass", "arredamento", "riscaldamento", "stato", "contratto", "description", "price"
    ];
    
    for (const key of requiredFields) {
      if (!form[key]) {
        setError("⚠ Tutti i campi sono obbligatori!");
        return false;
      }
    }
    return true;
  };

  // Gestione submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) {
      return;
    }
    setShowWarning(true);
  };

  // Conferma modale warning
  const handleConfirmWarning = async () => {
    setShowWarning(false);
    setError("");
    // Mappa i campi frontend -> backend
    const formData = new FormData();
    formData.append("city", form.city);
    formData.append("district", form.town);
    formData.append("address", form.address);
    formData.append("streetNumber", form.civicNumber);
    formData.append("floor", form.floor);
    formData.append("totalBuildingFloors", form.totalFloors);
    formData.append("commercialArea", form.surface);
    formData.append("elevator", form.elevator);
    formData.append("rooms", form.rooms);
    formData.append("energyClass", form.energyClass);
    formData.append("furnishing", form.arredamento);
    formData.append("heating", form.riscaldamento);
    formData.append("propertyStatus", form.stato);
    formData.append("contractType", form.contratto);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.file) {
      formData.append("image", form.file);
    }

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8080/api/estate-agents/load-real-estate",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setShowSuccess(true);
    } catch (err) {
      setError("❌ Errore nell'invio dell'annuncio. Riprova.");
    }
  };

  // Conferma modale successo
  const handleConfirmSuccess = () => {
    setShowSuccess(false);
    navigate("/home-agente");
  };

  // Back link
  const handleBack = (e) => {
    e.preventDefault();
    navigate("/home-agente");
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="header-container">
        <div className="logo-title cursor-pointer" id="logo-title" onClick={handleBack}>
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
          <div className="icon-text hide-on-small" onClick={() => navigate("/notifiche-agenzia")}>
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <path d="M41.6667 8.33325H8.33335C6.04169 8.33325 4.16669 10.2083 4.16669 12.4999V37.4999C4.16669 39.7916 6.04169 41.6666 8.33335 41.6666H41.6667C43.9584 41.6666 45.8334 39.7916 45.8334 37.4999V12.4999C45.8334 10.2083 43.9584 8.33325 41.6667 8.33325ZM40.8334 17.1874L27.2084 25.7083C25.8542 26.5624 24.1459 26.5624 22.7917 25.7083L9.16669 17.1874C8.64585 16.8541 8.33335 16.2916 8.33335 15.6874C8.33335 14.2916 9.85419 13.4583 11.0417 14.1874L25 22.9166L38.9584 14.1874C40.1459 13.4583 41.6667 14.2916 41.6667 15.6874C41.6667 16.2916 41.3542 16.8541 40.8334 17.1874Z" fill="#073B4C"/>
            </svg>
            <span>Notifiche</span>
          </div>
          {/* Profilo */}
          <div className="icon-text" onClick={() => navigate("/profilo-agente")}>
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

      <div className="aggiungiimmobile-container-info">
        <form className="aggiungiimmobile-real-estate-form" onSubmit={handleSubmit}>
          <div className="aggiungiimmobile-upload-box" onClick={() => document.getElementById("aggiungiimmobile-file-upload").click()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
            <g clipPath="url(#clip0_20_281)">
              <path d="M131.375 31.25H118.75V18.625C118.75 15.25 116 12.5 112.625 12.5H112.438C109 12.5 106.25 15.25 106.25 18.625V31.25H93.6875C90.3125 31.25 87.5625 34 87.5 37.375V37.5625C87.5 41 90.25 43.75 93.6875 43.75H106.25V56.3125C106.25 59.6875 109 62.5 112.438 62.4375H112.625C116 62.4375 118.75 59.6875 118.75 56.3125V43.75H131.375C134.75 43.75 137.5 41 137.5 37.625V37.375C137.5 34 134.75 31.25 131.375 31.25ZM100 56.3125V50H93.6875C90.375 50 87.25 48.6875 84.875 46.375C82.5625 44 81.25 40.875 81.25 37.375C81.25 35.125 81.875 33.0625 82.9375 31.25H31.25C24.375 31.25 18.75 36.875 18.75 43.75V118.75C18.75 125.625 24.375 131.25 31.25 131.25H106.25C113.125 131.25 118.75 125.625 118.75 118.75V67C116.875 68.0625 114.75 68.75 112.375 68.75C105.562 68.6875 100 63.125 100 56.3125ZM99.75 118.75H37.5C34.9375 118.75 33.4375 115.813 35 113.75L47.375 97.3125C48.6875 95.5625 51.25 95.6875 52.5 97.4375L62.5 112.5L78.8125 90.75C80.0625 89.125 82.5 89.0625 83.75 90.6875L102.188 113.688C103.812 115.75 102.375 118.75 99.75 118.75Z" fill="#073B4C"/>
            </g>
            <defs>
              <clipPath id="clip0_20_281">
                <rect width="150" height="150" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <label htmlFor="aggiungiimmobile-file-upload" className="aggiungiimmobile-upload-label">Carica delle Foto</label>
          <input type="file" id="aggiungiimmobile-file-upload" hidden onChange={handleFile} />
        </div>
          <p className="aggiungiimmobile-file-name-display text-center mt-4 text-gray-600">{fileName}</p>
          <fieldset className="aggiungiimmobile-fieldset">
            <legend className="aggiungiimmobile-legend">Dati Immobile</legend>
            <label className="aggiungiimmobile-label">Città: <input type="text" name="city" value={form.city} onChange={handleChange} required /></label>
            <label className="aggiungiimmobile-label">Comune: <input type="text" name="town" value={form.town} onChange={handleChange} required /></label>
            <label className="aggiungiimmobile-label">Indirizzo: <input type="text" name="address" value={form.address} onChange={handleChange} required /></label>
            <label className="aggiungiimmobile-label">Numero Civico: <input type="number" name="civicNumber" value={form.civicNumber} onChange={handleChange} required /></label>
          </fieldset>

          <fieldset className="aggiungiimmobile-fieldset">
            <legend className="aggiungiimmobile-legend">Caratteristiche</legend>
            <label className="aggiungiimmobile-label">Piano: <input type="text" name="floor" value={form.floor} onChange={handleChange} required /></label>
            <label className="aggiungiimmobile-label">Totale Piani Edificio: <input type="number" name="totalFloors" value={form.totalFloors} onChange={handleChange} required /></label>
            <label className="aggiungiimmobile-label">Superficie Commerciale (m²): <input type="number" name="surface" value={form.surface} onChange={handleChange} required /></label>
            <div className="aggiungiimmobile-ascensore">
              <label className="aggiungiimmobile-label">Ascensore:</label>
              <label className="aggiungiimmobile-switch">
                <input type="checkbox" name="elevator" checked={form.elevator} onChange={handleChange} />
                <span className="aggiungiimmobile-slider"></span>
              </label>
            </div>
            <label className="aggiungiimmobile-label">Numero di Stanze: <input type="number" name="rooms" value={form.rooms} onChange={handleChange} required /></label>
            <label className="aggiungiimmobile-label">Classe Energetica:
              <select name="energyClass" value={form.energyClass} onChange={handleChange} required>
                <option value="">Seleziona</option>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="A2">A2</option>
                <option value="A1">A1</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="aggiungiimmobile-fieldset">
            <legend className="aggiungiimmobile-legend">Opzioni</legend>
            <div className="aggiungiimmobile-options-grid">
              <div className="aggiungiimmobile-column">
                <p><strong>Arredamento:</strong></p>
                <label className="aggiungiimmobile-label"><input type="radio" name="arredamento" value="Arredato" checked={form.arredamento === "Arredato"} onChange={handleRadio} required /> Arredato</label>
                <label className="aggiungiimmobile-label"><input type="radio" name="arredamento" value="Non Arredato" checked={form.arredamento === "Non Arredato"} onChange={handleRadio} required /> Non Arredato</label>
                <label className="aggiungiimmobile-label"><input type="radio" name="arredamento" value="Parzialmente Arredato" checked={form.arredamento === "Parzialmente Arredato"} onChange={handleRadio} required /> Parzialmente Arredato</label>
              </div>
              <div className="aggiungiimmobile-column">
                <p><strong>Riscaldamento:</strong></p>
                <label className="aggiungiimmobile-label"><input type="radio" name="riscaldamento" value="Autonomo" checked={form.riscaldamento === "Autonomo"} onChange={handleRadio} required /> Autonomo</label>
                <label className="aggiungiimmobile-label"><input type="radio" name="riscaldamento" value="Centralizzato" checked={form.riscaldamento === "Centralizzato"} onChange={handleRadio} required /> Centralizzato</label>
                <label className="aggiungiimmobile-label"><input type="radio" name="riscaldamento" value="Assente" checked={form.riscaldamento === "Assente"} onChange={handleRadio} required /> Assente</label>
              </div>
              <div className="aggiungiimmobile-column">
                <p><strong>Stato dell'Immobile:</strong></p>
                <label className="aggiungiimmobile-label"><input type="radio" name="stato" value="In Costruzione" checked={form.stato === "In Costruzione"} onChange={handleRadio} required /> In Costruzione</label>
                <label className="aggiungiimmobile-label"><input type="radio" name="stato" value="Ristrutturato" checked={form.stato === "Ristrutturato"} onChange={handleRadio} required /> Ristrutturato</label>
                <label className="aggiungiimmobile-label"><input type="radio" name="stato" value="Da Ristrutturare" checked={form.stato === "Da Ristrutturare"} onChange={handleRadio} required /> Da Ristrutturare</label>
              </div>
              <div className="aggiungiimmobile-column">
                <p><strong>Tipo di Contratto:</strong></p>
                <label className="aggiungiimmobile-label"><input type="radio" name="contratto" value="Vendita" checked={form.contratto === "Vendita"} onChange={handleRadio} required /> Vendita</label>
                <label className="aggiungiimmobile-label"><input type="radio" name="contratto" value="Affitto" checked={form.contratto === "Affitto"} onChange={handleRadio} required /> Affitto</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="aggiungiimmobile-fieldset">
            <legend className="aggiungiimmobile-legend">Descrizione</legend>
            <textarea className="aggiungiimmobile-textarea" name="description" placeholder="Inserisci una descrizione" value={form.description} onChange={handleChange} required />
          </fieldset>

          <fieldset className="aggiungiimmobile-fieldset">
            <legend className="aggiungiimmobile-legend">Prezzo</legend>
            <label className="aggiungiimmobile-label">Prezzo: <input type="number" name="price" value={form.price} onChange={handleChange} required /></label>
          </fieldset>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="aggiungiimmobile-accesso px-6 py-2 mt-6 rounded-md">PROSEGUI</button>
        </form>
      </div>

      {/* Modale di Avviso */}
      {showWarning && (
        <div className="aggiungiimmobile-warningModal">
          <div className="aggiungiimmobile-modal-outer">
            <div className="aggiungiimmobile-modal-inner">
              <div data-svg-wrapper>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.35 105H97.65C105.35 105 110.15 96.6499 106.3 89.9999L68.65 24.9499C64.8 18.2999 55.2 18.2999 51.35 24.9499L13.7 89.9999C9.85 96.6499 14.65 105 22.35 105ZM60 69.9999C57.25 69.9999 55 67.7499 55 64.9999V54.9999C55 52.2499 57.25 49.9999 60 49.9999C62.75 49.9999 65 52.2499 65 54.9999V64.9999C65 67.7499 62.75 69.9999 60 69.9999ZM65 89.9999H55V79.9999H65V89.9999Z" fill="#FFD943"/>
                </svg>
              </div>
              <p className="aggiungiimmobile-modal-text">Una volta inserito l'annuncio, la posizione NON potrà essere modificata.</p>
              <div className="aggiungiimmobile-modal-spacer"></div>
              <div className="aggiungiimmobile-modal-buttons">
                <button className="aggiungiimmobile-cancelButton" onClick={() => setShowWarning(false)}>INDIETRO</button>
                <button className="aggiungiimmobile-confirmWarningButton" onClick={handleConfirmWarning}>PROSEGUI</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale di Conferma */}
      {showSuccess && (
        <div className="aggiungiimmobile-successModal">
          <div className="aggiungiimmobile-modal-outer-success">
            <div className="aggiungiimmobile-modal-inner-success">
              <div data-svg-wrapper>
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M55 9.16675C29.7 9.16675 9.16663 29.7001 9.16663 55.0001C9.16663 80.3001 29.7 100.833 55 100.833C80.3 100.833 100.833 80.3001 100.833 55.0001C100.833 29.7001 80.3 9.16675 55 9.16675ZM42.5791 74.6626L26.125 58.2084C24.3375 56.4209 24.3375 53.5334 26.125 51.7459C27.9125 49.9584 30.8 49.9584 32.5875 51.7459L45.8333 64.9459L77.3666 33.4126C79.1541 31.6251 82.0416 31.6251 83.8291 33.4126C85.6166 35.2001 85.6166 38.0876 83.8291 39.8751L49.0416 74.6626C47.3 76.4501 44.3666 76.4501 42.5791 74.6626Z" fill="#4DC538"/>
                </svg>
              </div>
              <h2>Complimenti!</h2>
              <p>Il tuo annuncio è stato inserito con successo</p>
              <div className="aggiungiimmobile-modal-spacer"></div>
              <button className="aggiungiimmobile-confirmSuccessButton" onClick={handleConfirmSuccess}>PROSEGUI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AggiungiImmobile;
