import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardPreferiti.css";

const formatPrice = (price) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const CardPreferiti = ({ ricerca, onDelete }) => {
  const navigate = useNavigate();

  const handleRepeatSearch = () => {
    sessionStorage.setItem("citta", ricerca.citta ? ricerca.citta : "");
    sessionStorage.setItem("contratto", ricerca.contratto ? ricerca.contratto : "");
    sessionStorage.setItem("classeEnergetica", ricerca.classeEnergetica ? ricerca.classeEnergetica : "");
    sessionStorage.setItem("numLocali", ricerca.numLocali ? ricerca.numLocali : "");
    sessionStorage.setItem("prezzoMin", ricerca.prezzoMin ? ricerca.prezzoMin : "");
    sessionStorage.setItem("prezzoMax", ricerca.prezzoMax ? ricerca.prezzoMax : "");
    sessionStorage.setItem("avviaRicerca", "true");
    navigate("/home");
  };

  return (
    <div className="search-card-container">
      <div className="search-card-header">
        <div className="search-card-location">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#073B4C"/>
          </svg>
          {ricerca.citta}
        </div>
        <span className={`search-card-type-badge ${(ricerca.contratto || "N/A").toLowerCase()}`}>
          {ricerca.contratto || "N/A"}
        </span>
      </div>

      <div className="search-card-details">
        <div className="search-card-detail-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM13.61 11.07L10 14.68L6.39 11.07C5.61 10.29 5.61 9.03 6.39 8.25C7.17 7.47 8.43 7.47 9.21 8.25L10 9.04L10.79 8.25C11.57 7.47 12.83 7.47 13.61 8.25C14.39 9.03 14.39 10.29 13.61 11.07Z" fill="#06D6A0"/>
          </svg>
          Classe {ricerca.classeEnergetica}
        </div>
        <div className="search-card-detail-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 0H2C0.9 0 0 0.9 0 2V8C0 9.1 0.9 10 2 10H8C9.1 10 10 9.1 10 8V2C10 0.9 9.1 0 8 0ZM8 8H2V2H8V8Z" fill="#073B4C"/>
            <path d="M8 12H2C0.9 12 0 12.9 0 14V18C0 19.1 0.9 20 2 20H8C9.1 20 10 19.1 10 18V14C10 12.9 9.1 12 8 12ZM8 18H2V14H8V18Z" fill="#073B4C"/>
            <path d="M18 0H12C10.9 0 10 0.9 10 2V8C0 9.1 10.9 10 12 10H18C19.1 10 20 9.1 20 8V2C20 0.9 19.1 0 18 0ZM18 8H12V2H18V8Z" fill="#073B4C"/>
            <path d="M18 12H12C10.9 12 10 12.9 10 14V18C0 19.1 10.9 20 12 20H18C19.1 20 20 19.1 20 18V14C20 12.9 19.1 12 18 12ZM18 18H12V14H18V18Z" fill="#073B4C"/>
          </svg>
          {ricerca.numLocali} locali
        </div>
        <div className="search-card-detail-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#073B4C"/>
          </svg>
          {formatPrice(ricerca.prezzoMin)} - {formatPrice(ricerca.prezzoMax)}
        </div>
      </div>

      <div className="search-card-footer">
        <div className="search-card-date">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 0C4.03 0 0 4.03 0 9C0 13.97 4.03 18 9 18C13.97 18 18 13.97 18 9C18 4.03 13.97 0 9 0ZM9 16C5.13 16 2 12.87 2 9C2 5.13 5.13 2 9 2C12.87 2 16 5.13 16 9C16 12.87 12.87 16 9 16Z" fill="#666666"/>
            <path d="M9.5 4.5H8V10L12.75 12.85L13.5 11.62L9.5 9.25V4.5Z" fill="#666666"/>
          </svg>
          Salvata il {formatDate(ricerca.data)}
        </div>
        <div className="flex items-center gap-4">
          <button className="search-card-repeat" onClick={handleRepeatSearch}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="#073B4C"/>
            </svg>
            RIPETI RICERCA
          </button>
          <button className="search-card-delete" onClick={onDelete}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15.8333 5.34166L14.6583 4.16666L10 8.82499L5.34167 4.16666L4.16667 5.34166L8.82501 9.99999L4.16667 14.6583L5.34167 15.8333L10 11.175L14.6583 15.8333L15.8333 14.6583L11.175 9.99999L15.8333 5.34166Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPreferiti;
