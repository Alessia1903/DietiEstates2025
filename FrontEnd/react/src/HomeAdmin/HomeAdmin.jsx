import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "../components/Navbar/Navbar.css";
import "./HomeAdmin.css";

const HomeAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar role="admin" />

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
            <strong>Nota:</strong> la password di amministrazione può essere cambiata in qualsiasi momento nell'area profilo.
          </div>
        </div>

        {/* Card Azioni */}
        <div className="admin-actions-cards flex-1">
          {/* Crea Account Agente */}
          <div className="admin-register-box" onClick={() => navigate("/aggiungi-agente")} style={{ cursor: "pointer" }}>
            <div className="admin-agency-icon-container">
              {/* Icona edificio */}
              <svg
                className="admin-building-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="150"
                height="150"
                viewBox="0 0 18 18"
                fill="none"
              >
                <g clipPath="url(#clip0_18_18)">
                  <path
                    d="M17 0H9C8.45 0 8 0.45 8 1V2.61C8 2.61 8 2.61 8.01 2.62L13.01 7.12C13.64 7.68 14 8.5 14 9.35V10H16V12H14V14H16V16H14V18H17C17.55 18 18 17.55 18 17V1C18 0.45 17.55 0 17 0ZM12 4H10V2H12V4ZM16 8H14V6H16V8ZM16 4H14V2H16V4Z"
                    fill="#073B4C"
                  />
                  <path
                    d="M12 17V9.34998C12 9.06998 11.88 8.79998 11.67 8.60998L6.67 4.10998C6.48 3.92998 6.24 3.84998 6 3.84998C5.76 3.84998 5.52 3.93998 5.33 4.10998L0.33 8.60998C0.12 8.78998 0 9.05998 0 9.34998V17C0 17.55 0.45 18 1 18H3C3.55 18 4 17.55 4 17V13H8V17C8 17.55 8.45 18 9 18H11C11.55 18 12 17.55 12 17Z"
                    fill="#073B4C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_18_18">
                    <rect width="18" height="18" fill="white" />
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
            <p className="text-center text-2xl font-semibold mt-4">AGGIUNGI AGENTE IMMOBILIARE</p>
          </div>

          {/* Crea Account Admin */}
          <div className="admin-register-box" onClick={() => navigate("/aggiungi-collaboratore")} style={{ cursor: "pointer" }}>
            <div className="admin-agency-icon-container">
              {/* Icona edificio */}
              <svg
                className="admin-building-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="150"
                height="150"
                viewBox="0 0 22 16"
                fill="none"
              >
                <g clipPath="url(#clip0_22_16)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.6699 9.13C17.0399 10.06 17.9999 11.32 17.9999 13V16H20.9999C21.5499 16 21.9999 15.55 21.9999 15V13C21.9999 10.82 18.4299 9.53 15.6699 9.13Z"
                    fill="#073B4C"
                  />
                  <path
                    d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z"
                    fill="#073B4C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.9999 8C16.2099 8 17.9999 6.21 17.9999 4C17.9999 1.79 16.2099 0 13.9999 0C13.5299 0 13.0899 0.0999998 12.6699 0.24C13.4999 1.27 13.9999 2.58 13.9999 4C13.9999 5.42 13.4999 6.73 12.6699 7.76C13.0899 7.9 13.5299 8 13.9999 8Z"
                    fill="#073B4C"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 9C5.33 9 0 10.34 0 13V15C0 15.55 0.45 16 1 16H15C15.55 16 16 15.55 16 15V13C16 10.34 10.67 9 8 9Z"
                    fill="#073B4C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_22_16">
                    <rect width="22" height="16" fill="white" />
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
            <p className="text-center text-2xl font-semibold mt-4">AGGIUNGI COLLABORATORE</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
