import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CambioCredenziali.css";

const validatePassword = (password) => {
  // Minimo 8 caratteri, almeno una maiuscola, una minuscola, un numero
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const CambioCredenziali = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error("Inserisci la password attuale.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error(
        "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola e un numero."
      );
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        "http://localhost:8080/api/admins/change-amministration-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      if (response.ok) {
        setShowModal(true);
      } else {
        toast.error("Password attuale errata. Riprova.");
      }
    } catch (error) {
      toast.error("Errore di connessione. Riprova.");
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    // Recupero il ruolo dell'utente salvato in localStorage
    // Dopo il cambio password, porta sempre alla HomeAdmin
    navigate("/home-admin");
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
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
      </div>

      <div className="container-outside">
        <div className="container-inside">
          <h2>Complimenti, hai correttamente eseguito il tuo primo accesso!</h2>
          <p className="info-password">
            Per ragioni di sicurezza è fondamentale modificare la password prima di poter avere libero accesso al tuo account. La nuova password deve rispettare i seguenti requisiti:
          </p>
          <ul>
            <li>Minimo 8 caratteri</li>
            <li>Almeno una lettera maiuscola</li>
            <li>Almeno una lettera minuscola</li>
            <li>Almeno un numero</li>
          </ul>
        </div>
      </div>

      <div className="form-container">
        <form className="changePasswordForm flex-col" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Password Attuale:</label>
            <input
              type="password"
              id="currentPassword"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nuova Password:</label>
            <input
              type="password"
              id="newPassword"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Conferma Password:</label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="registrabutton mx-auto" type="submit">
            SALVA PASSWORD
          </button>
        </form>
      </div>

      {/* Modale di Conferma */}
      {showModal && (
        <div id="successModal" style={{ display: "flex" }}>
          <div className="modal-outer-success">
            <div className="modal-inner-success">
              <div data-svg-wrapper="">
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M55 9.16675C29.7 9.16675 9.16663 29.7001 9.16663 55.0001C9.16663 80.3001 29.7 100.833 55 100.833C80.3 100.833 100.833 80.3001 100.833 55.0001C100.833 29.7001 80.3 9.16675 55 9.16675ZM42.5791 74.6626L26.125 58.2084C24.3375 56.4209 24.3375 53.5334 26.125 51.7459C27.9125 49.9584 30.8 49.9584 32.5875 51.7459L45.8333 64.9459L77.3666 33.4126C79.1541 31.6251 82.0416 31.6251 83.8291 33.4126C85.6166 35.2001 85.6166 38.0876 83.8291 39.8751L49.0416 74.6626C47.3 76.4501 44.3666 76.4501 42.5791 74.6626Z" fill="#4DC538"/>
                </svg>
              </div>
              <h2>Complimenti!</h2>
              <p>Le credenziali sono state salvate con successo.</p>
              <div className="modal-spacer"></div>
              <button id="confirmSuccessButton" onClick={handleModalConfirm}>
                PROSEGUI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CambioCredenziali;
