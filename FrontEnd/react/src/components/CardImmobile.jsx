import React from "react";
import "./CardImmobile.css";
import { useNavigate } from "react-router-dom";

const CardImmobile = ({ immobile, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Salva i dati dell'immobile in sessionStorage
    sessionStorage.removeItem("dettagliImmobile"); 
    sessionStorage.setItem("dettagliImmobile", JSON.stringify(immobile));
    
    navigate("/dettagli-immobile");
  };

  return (
    <div className="annuncio" onClick={handleClick}>
      <img
        src={immobile.img || immobile.immagine || "https://via.placeholder.com/100"}
        alt={immobile.titolo || "Immobile"}
      />
      <div className="info">
        <div className="top-info">
          <p className="prezzo">€ {immobile.prezzo}</p>
          <p className="dettagli">
            <strong>{immobile.numLocali || immobile.stanze}</strong> locali
            {immobile.superficie && <> - <strong>{immobile.superficie} m²</strong></>}
          </p>
        </div>
        <h3>
          {immobile.titolo
            ? immobile.titolo
            : `In ${immobile.contratto} in ${immobile.indirizzo || ""}, ${immobile.citta || ""}, ${immobile.comune || ""}`}
        </h3>
        <p className="descrizione">
          {immobile.descrizione && immobile.descrizione.length > 200
            ? immobile.descrizione.substring(0, 200) + "..."
            : immobile.descrizione}
        </p>
      </div>
    </div>
  );
};

export default CardImmobile;
