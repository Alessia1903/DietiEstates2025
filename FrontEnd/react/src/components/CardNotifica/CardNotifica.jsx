import React from "react";
import "./CardNotifica.css";

const CATEGORIE = {
  promozionali: {
    label: "Promozionali",
    color: "#06D6A0",
    textColor: "#073B4C"
  },
  "nuove-proprieta": {
    label: "Nuove proprietà",
    color: "#118AB2",
    textColor: "#FFFFFF"
  },
  visite: {
    label: "Visite",
    color: "#FFD166",
    textColor: "#073B4C"
  }
};

const CardNotifica = ({ categoria, titolo, testo, data }) => {
  return (
    <div 
      className="notifica-card"
      style={{ borderLeftColor: CATEGORIE[categoria].color }}
    >
      <span
        className="categoria-pill"
        style={{
          backgroundColor: CATEGORIE[categoria].color,
          color: CATEGORIE[categoria].textColor
        }}
      >
        {CATEGORIE[categoria].label}
      </span>

      <div className="notifica-header">
        <span className="notifica-data">{data}</span>
      </div>

      <h3 className="notifica-titolo">{titolo}</h3>
      <p className="notifica-testo">{testo}</p>
    </div>
  );
};

export default CardNotifica;
