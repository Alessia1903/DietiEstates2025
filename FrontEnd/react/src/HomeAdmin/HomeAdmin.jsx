import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeAdmin.css";

const HomeAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="header-container">
        <div className="logo-title" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
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
        <div className="admin-profile-icon" style={{ cursor: "pointer" }} onClick={() => navigate("/profilo-admin")}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_20_523)">
              <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
            </g>
          </svg>
        </div>
      </div>

      <div className="homeadmin-main-row flex flex-col md:flex-row gap-10 w-full max-w-4xl">
        {/* Info Box */}
        <div className="admin-info-box border-2 p-6 rounded-lg flex-1">
          <h3 className="text-lg font-bold mb-8">Cosa puoi fare come amministratore:</h3>
          <ul className="list-none p-0 space-y-8">
            <li className="flex items-center">
              {/* Icona team */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 50 26" fill="none" className="w-7 h-7 mr-2">
                <path d="M25 14.5625C28.3958 14.5625 31.3958 15.375 33.8333 16.4375C36.0833 17.4375 37.5 19.6875 37.5 22.125V23.4167C37.5 24.5625 36.5625 25.5 35.4167 25.5H14.5833C13.4375 25.5 12.5 24.5625 12.5 23.4167V22.1458C12.5 19.6875 13.9167 17.4375 16.1667 16.4583C18.6042 15.375 21.6042 14.5625 25 14.5625ZM8.33333 15.0833C10.625 15.0833 12.5 13.2083 12.5 10.9167C12.5 8.625 10.625 6.75 8.33333 6.75C6.04167 6.75 4.16667 8.625 4.16667 10.9167C4.16667 13.2083 6.04167 15.0833 8.33333 15.0833ZM10.6875 17.375C9.91667 17.25 9.14583 17.1667 8.33333 17.1667C6.27083 17.1667 4.3125 17.6042 2.54167 18.375C1 19.0417 0 20.5417 0 22.2292V23.4167C0 24.5625 0.9375 25.5 2.08333 25.5H9.375V22.1458C9.375 20.4167 9.85417 18.7917 10.6875 17.375ZM41.6667 15.0833C43.9583 15.0833 45.8333 13.2083 45.8333 10.9167C45.8333 8.625 43.9583 6.75 41.6667 6.75C39.375 6.75 37.5 8.625 37.5 10.9167C37.5 13.2083 39.375 15.0833 41.6667 15.0833ZM50 22.2292C50 20.5417 49 19.0417 47.4583 18.375C45.6875 17.6042 43.7292 17.1667 41.6667 17.1667C40.8542 17.1667 40.0833 17.25 39.3125 17.375C40.1458 18.7917 40.625 20.4167 40.625 22.1458V25.5H47.9167C49.0625 25.5 50 24.5625 50 23.4167V22.2292ZM25 0.5C28.4583 0.5 31.25 3.29167 31.25 6.75C31.25 10.2083 28.4583 13 25 13C21.5417 13 18.75 10.2083 18.75 6.75C18.75 3.29167 21.5417 0.5 25 0.5Z" fill="#073B4C"/>
              </svg>
              Gestire agenti e altri amministratori
            </li>
            <li className="flex items-center">
              {/* Icona chiave */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64" fill="none" className="w-7 h-7 mr-2">
                <circle cx="32" cy="32" r="32" fill="#FFD943"/>
                <path d="M44 28a8 8 0 1 0-15.9 2.1l-7.2 7.2a2 2 0 0 0 0 2.8l2.8 2.8a2 2 0 0 0 2.8 0l2.2-2.2 2.2 2.2a2 2 0 0 0 2.8 0l2.8-2.8a2 2 0 0 0 0-2.8l-1.2-1.2A8 8 0 0 0 44 28Zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" fill="#073B4C"/>
              </svg>
              Cambiare la password di amministrazione
            </li>
            <li className="flex items-center">
              {/* Icona shield */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" className="w-7 h-7 mr-2">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="#06D6A0"/>
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12V2z" fill="#073B4C"/>
              </svg>
              Garantire la sicurezza degli accessi
            </li>
            <li className="flex items-center">
              {/* Icona info */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" className="w-7 h-7 mr-2">
                <circle cx="12" cy="12" r="12" fill="#FFD943"/>
                <rect x="11" y="10" width="2" height="7" rx="1" fill="#073B4C"/>
                <rect x="11" y="7" width="2" height="2" rx="1" fill="#073B4C"/>
              </svg>
              Visualizzare informazioni e statistiche sull'agenzia
            </li>
          </ul>
          <div className="admin-info-note mt-8">
            <strong>Nota:</strong> la password di amministrazione dovrà essere cambiata ogni volta che si effettua l'accesso.
          </div>
        </div>

        {/* Card Azioni */}
        <div className="admin-actions-cards flex-1">
          {/* Crea Account Agente */}
          <div className="admin-register-box" onClick={() => navigate("/aggiungi-agente")} style={{ cursor: "pointer" }}>
            <div className="admin-agency-icon-container">
              {/* Icona edificio */}
              <svg className="admin-building-icon" xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 300 300" fill="none">
                <g clipPath="url(#clip0_11_444)">
                  <path d="M150 87.5V62.5C150 48.75 138.75 37.5 125 37.5H50C36.25 37.5 25 48.75 25 62.5V237.5C25 251.25 36.25 262.5 50 262.5H250C263.75 262.5 275 251.25 275 237.5V112.5C275 98.75 263.75 87.5 250 87.5H150ZM75 237.5H50V212.5H75V237.5ZM75 187.5H50V162.5H75V187.5ZM75 137.5H50V112.5H75V137.5ZM75 87.5H50V62.5H75V87.5ZM125 237.5H100V212.5H125V237.5ZM125 187.5H100V162.5H125V187.5ZM125 137.5H100V112.5H125V137.5ZM125 87.5H100V62.5H125V87.5ZM237.5 237.5H150V212.5H175V187.5H150V162.5H175V137.5H150V112.5H237.5C244.375 112.5 250 118.125 250 125V225C250 231.875 244.375 237.5 237.5 237.5ZM225 137.5H200V162.5H225V137.5ZM225 187.5H200V212.5H225V187.5Z" fill="#073B4C"/>
                </g>
                <defs>
                  <clipPath id="clip0_11_444">
                    <rect width="300" height="300" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              {/* Cerchio bianco */}
              <div className="admin-circle"></div>
              {/* Icona "+" */}
              <div className="admin-plus-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="admin-small-plus-icon">
                  <g clipPath="url(#clip0_11_448)">
                    <path d="M50 8.33337C27 8.33337 8.33337 27 8.33337 50C8.33337 73 27 91.6667 50 91.6667C73 91.6667 91.6667 73 91.6667 50C91.6667 27 73 8.33337 50 8.33337ZM66.6667 54.1667H54.1667V66.6667C54.1667 68.9584 52.2917 70.8334 50 70.8334C47.7084 70.8334 45.8334 68.9584 45.8334 66.6667V54.1667H33.3334C31.0417 54.1667 29.1667 52.2917 29.1667 50C29.1667 47.7084 31.0417 45.8334 33.3334 45.8334H45.8334V33.3334C45.8334 31.0417 47.7084 29.1667 50 29.1667C52.2917 29.1667 54.1667 31.0417 54.1667 33.3334V45.8334H66.6667C68.9584 45.8334 70.8334 47.7084 70.8334 50C70.8334 52.2917 68.9584 54.1667 66.6667 54.1667Z" fill="#06D6A0"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_11_448">
                      <rect width="100" height="100" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-center text-2xl font-semibold mt-4">CREA ACCOUNT AGENTE</p>
          </div>

          {/* Crea Account Admin */}
          <div className="admin-register-box" onClick={() => navigate("/aggiungi-collaboratore")} style={{ cursor: "pointer" }}>
            <div className="admin-agency-icon-container">
              {/* Icona edificio */}
              <svg className="admin-building-icon" xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 300 300" fill="none">
                <g clipPath="url(#clip0_11_444)">
                  <path d="M150 87.5V62.5C150 48.75 138.75 37.5 125 37.5H50C36.25 37.5 25 48.75 25 62.5V237.5C25 251.25 36.25 262.5 50 262.5H250C263.75 262.5 275 251.25 275 237.5V112.5C275 98.75 263.75 87.5 250 87.5H150ZM75 237.5H50V212.5H75V237.5ZM75 187.5H50V162.5H75V187.5ZM75 137.5H50V112.5H75V137.5ZM75 87.5H50V62.5H75V87.5ZM125 237.5H100V212.5H125V237.5ZM125 187.5H100V162.5H125V187.5ZM125 137.5H100V112.5H125V137.5ZM125 87.5H100V62.5H125V87.5ZM237.5 237.5H150V212.5H175V187.5H150V162.5H175V137.5H150V112.5H237.5C244.375 112.5 250 118.125 250 125V225C250 231.875 244.375 237.5 237.5 237.5ZM225 137.5H200V162.5H225V137.5ZM225 187.5H200V212.5H225V187.5Z" fill="#073B4C"/>
                </g>
                <defs>
                  <clipPath id="clip0_11_444">
                    <rect width="300" height="300" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              {/* Cerchio bianco */}
              <div className="admin-circle"></div>
              {/* Icona "+" */}
              <div className="admin-plus-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="admin-small-plus-icon">
                  <g clipPath="url(#clip0_11_448)">
                    <path d="M50 8.33337C27 8.33337 8.33337 27 8.33337 50C8.33337 73 27 91.6667 50 91.6667C73 91.6667 91.6667 73 91.6667 50C91.6667 27 73 8.33337 50 8.33337ZM66.6667 54.1667H54.1667V66.6667C54.1667 68.9584 52.2917 70.8334 50 70.8334C47.7084 70.8334 45.8334 68.9584 45.8334 66.6667V54.1667H33.3334C31.0417 54.1667 29.1667 52.2917 29.1667 50C29.1667 47.7084 31.0417 45.8334 33.3334 45.8334H45.8334V33.3334C45.8334 31.0417 47.7084 29.1667 50 29.1667C52.2917 29.1667 54.1667 31.0417 54.1667 33.3334V45.8334H66.6667C68.9584 45.8334 70.8334 47.7084 70.8334 50C70.8334 52.2917 68.9584 54.1667 66.6667 54.1667Z" fill="#06D6A0"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_11_448">
                      <rect width="100" height="100" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-center text-2xl font-semibold mt-4">CREA ACCOUNT COLLABORATORE</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
