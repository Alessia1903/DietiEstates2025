// Navbar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeLogin = location.pathname === "/" || location.pathname === "/home";

  const menu = {
    admin: [
      { label: "Home", icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" stroke="#073B4C" strokeWidth="2"/></svg>
      ), onClick: () => navigate("/home-admin") },
      { label: "Profilo", icon: (
        <svg width="32" height="32" viewBox="0 0 60 60" fill="none"><g><path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/></g></svg>
      ), onClick: () => navigate("/profilo-admin") },
      
    ],
    agent: [
      { label: "Home", icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" stroke="#073B4C" strokeWidth="2"/></svg>
      ), onClick: () => navigate("/home-agente") },
      { label: "Notifiche", icon: (
        <svg width="32" height="32" viewBox="0 0 50 50" fill="none"><path d="M41.6667 8.33325H8.33335C6.04169 8.33325 4.16669 10.2083 4.16669 12.4999V37.4999C4.16669 39.7916 6.04169 41.6666 8.33335 41.6666H41.6667C43.9584 41.6666 45.8334 39.7916 45.8334 37.4999V12.4999C45.8334 10.2083 43.9584 8.33325 41.6667 8.33325ZM40.8334 17.1874L27.2084 25.7083C25.8542 26.5624 24.1459 26.5624 22.7917 25.7083L9.16669 17.1874C8.64585 16.8541 8.33335 16.2916 8.33335 15.6874C8.33335 14.2916 9.85419 13.4583 11.0417 14.1874L25 22.9166L38.9584 14.1874C40.1459 13.4583 41.6667 14.2916 41.6667 15.6874C41.6667 16.2916 41.3542 16.8541 40.8334 17.1874Z" fill="#073B4C"/></svg>
      ), onClick: () => navigate("/notifiche-agente") },
      { label: "Profilo", icon: (
        <svg width="32" height="32" viewBox="0 0 60 60" fill="none"><g><path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/></g></svg>
      ), onClick: () => navigate("/profilo-agente") }
    ],
    user: [
      { label: "Home", icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" stroke="#073B4C" strokeWidth="2"/></svg>
      ), onClick: () => navigate("/home") },
      { label: "Notifiche", icon: (
        <svg width="32" height="32" viewBox="0 0 50 50" fill="none"><path d="M41.6665 8.33337H8.33317C6.0415 8.33337 4.1665 10.2084 4.1665 12.5V37.5C4.1665 39.7917 6.0415 41.6667 8.33317 41.6667H41.6665C43.9582 41.6667 45.8332 39.7917 45.8332 37.5V12.5C45.8332 10.2084 43.9582 8.33337 41.6665 8.33337ZM40.8332 17.1875L27.2082 25.7084C25.854 26.5625 24.1457 26.5625 22.7915 25.7084L9.1665 17.1875C8.64567 16.8542 8.33317 16.2917 8.33317 15.6875C8.33317 14.2917 9.854 13.4584 11.0415 14.1875L24.9998 22.9167L38.9582 14.1875C40.1457 13.4584 41.6665 14.2917 41.6665 15.6875C41.6665 16.2917 41.354 16.8542 40.8332 17.1875Z" fill="#073B4C"/></svg>
      ), onClick: () => navigate("/notifiche-utente") },
      { label: "Cronologia", icon: (
        <svg width="32" height="32" viewBox="0 0 50 50" fill="none"><path d="M27.6248 6.24995C17.0206 5.95828 8.33311 14.4791 8.33311 24.9999H4.60395C3.66645 24.9999 3.20811 26.1249 3.87478 26.7708L9.68728 32.6041C10.1039 33.0208 10.7498 33.0208 11.1664 32.6041L16.9789 26.7708C17.6248 26.1249 17.1664 24.9999 16.2289 24.9999H12.4998C12.4998 16.8749 19.1248 10.3124 27.2914 10.4166C35.0414 10.5208 41.5623 17.0416 41.6664 24.7916C41.7706 32.9374 35.2081 39.5833 27.0831 39.5833C23.7289 39.5833 20.6248 38.4374 18.1664 36.4999C17.3331 35.8541 16.1664 35.9166 15.4164 36.6666C14.5414 37.5416 14.6039 39.0208 15.5831 39.7708C18.7498 42.2708 22.7289 43.7499 27.0831 43.7499C37.6039 43.7499 46.1248 35.0624 45.8331 24.4583C45.5623 14.6874 37.3956 6.52078 27.6248 6.24995ZM26.5623 16.6666C25.7081 16.6666 24.9998 17.3749 24.9998 18.2291V25.8958C24.9998 26.6249 25.3956 27.3124 26.0206 27.6874L32.5206 31.5416C33.2706 31.9791 34.2289 31.7291 34.6664 30.9999C35.1039 30.2499 34.8539 29.2916 34.1248 28.8541L28.1248 25.2916V18.2083C28.1248 17.3749 27.4164 16.6666 26.5623 16.6666Z" fill="#073B4C"/></svg>
      ), onClick: () => navigate("/cronologia") },
      { label: "Preferiti", icon: (
        <svg width="32" height="32" viewBox="0 0 50 50" fill="none"><path d="M25 45.8333C23.9583 45.8333 22.9167 45.4167 22.0833 44.6875L7.29167 31.25C4.16667 28.5417 2.08333 24.8958 2.08333 20.8333C2.08333 13.2292 8.22917 7.08333 15.8333 7.08333C19.6875 7.08333 23.2292 8.95833 25 12.0833C26.7708 8.95833 30.3125 7.08333 34.1667 7.08333C41.7708 7.08333 47.9167 13.2292 47.9167 20.8333C47.9167 24.8958 45.8333 28.5417 42.7083 31.25L27.9167 44.6875C27.0833 45.4167 26.0417 45.8333 25 45.8333Z" fill="#073B4C"/></svg>
      ), onClick: () => navigate("/preferiti") },
      { label: "Profilo", icon: (
        <svg width="32" height="32" viewBox="0 0 60 60" fill="none"><g><path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/></g></svg>
      ), onClick: () => navigate("/profilo-utente") }
    ]
  };

  // Controllo token valido (non scaduto)
  const token = localStorage.getItem("jwtToken");
  let isTokenValid = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() / 1000 < payload.exp) {
        isTokenValid = true;
      }
    } catch (e) {
      isTokenValid = false;
    }
  }

  return (
    <div className="header-container">
      <div className="logo-title" onClick={() => navigate("/")}>
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
        {isHomeLogin && (!isTokenValid || !role) ? (  //l'utente non è autenticato
          <div className="auth-buttons">
            <button className="auth-btn" onClick={() => navigate("/login")}>
              <svg width="24" height="24" viewBox="0 0 160 160" fill="none"><g><path d="M80 80C94.7333 80 106.667 68.0667 106.667 53.3334C106.667 38.6 94.7333 26.6667 80 26.6667C65.2667 26.6667 53.3333 38.6 53.3333 53.3334C53.3333 68.0667 65.2667 80 80 80ZM80 93.3334C62.2 93.3334 26.6667 102.267 26.6667 120V126.667C26.6667 130.333 29.6667 133.333 33.3333 133.333H126.667C130.333 133.333 133.333 130.333 133.333 126.667V120C133.333 102.267 97.8 93.3334 80 93.3334Z" fill="currentColor"/></g></svg>
              <span>Area Privata</span>
            </button>
            <button className="auth-btn" onClick={() => navigate("/area-agenzia")} style={{ border: "4px solid #06D6A0" }}>
              <svg width="24" height="24" viewBox="0 0 160 160" fill="none"><g><path d="M75 43.75V31.25C75 24.375 69.375 18.75 62.5 18.75H25C18.125 18.75 12.5 24.375 12.5 31.25V118.75C12.5 125.625 18.125 131.25 25 131.25H125C131.875 131.25 137.5 125.625 137.5 118.75V56.25C137.5 49.375 131.875 43.75 125 43.75H75ZM37.5 118.75H25V106.25H37.5V118.75ZM37.5 93.75H25V81.25H37.5V93.75ZM37.5 68.75H25V56.25H37.5V68.75ZM37.5 43.75H25V31.25H37.5V43.75ZM62.5 118.75H50V106.25H62.5V118.75ZM62.5 93.75H50V81.25H62.5V93.75ZM62.5 68.75H50V56.25H62.5V68.75ZM62.5 43.75H50V31.25H62.5V43.75ZM118.75 118.75H75V106.25H87.5V93.75H75V81.25H87.5V68.75H75V56.25H118.75C122.188 56.25 125 59.0625 125 62.5V112.5C125 115.938 122.188 118.75 118.75 118.75ZM112.5 68.75H100V81.25H112.5V68.75ZM112.5 93.75H100V106.25H112.5V93.75Z" fill="currentColor"/></g></svg>
              <span>Area Agenzia</span>
            </button>
          </div>
        ) : (   //l'utente è autenticato
          menu[role]?.map((item, idx) => (
            <div className="icon-text" key={idx} onClick={item.onClick}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Navbar;
