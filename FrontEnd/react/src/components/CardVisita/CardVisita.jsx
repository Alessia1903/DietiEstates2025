import React from "react";
import "./CardVisita.css";

const CardVisita = ({ richiedente, dataRichiesta, stato, address, onAccetta, onRifiuta }) => {
  return (
    <div className="visit-card">
      <div className="visit-info">
        <div className="visit-row">
          <span className="visit-label">Richiedente</span>
          <span className="visit-value">
            {richiedente.nome}
          </span>
        </div>

        <div className="visit-row">
          <span className="visit-label">Indirizzo immobile</span>
          <span className="visit-value">{address}</span>
        </div>
        
        <div className="visit-row">
          <span className="visit-label">Data richiesta</span>
          <span className="visit-value">{dataRichiesta}</span>
        </div>

        <div className="visit-row">
          <span className="visit-label">Stato</span>
          <span className={`status-badge status-${stato}`}>
            {stato === "in-attesa" ? "In attesa" : 
             stato === "accettata" ? "Accettata" : "Rifiutata"}
          </span>
        </div>
      </div>

      {stato === "in-attesa" && (
        <div className="visit-actions">
          <button 
            className="btn-reject" 
            onClick={onRifiuta}
          >
            <i className="fas fa-times"></i>
            Rifiuta
          </button>
          <button 
            className="btn-accept" 
            onClick={onAccetta}
          >
            <i className="fas fa-check"></i>
            Accetta
          </button>
        </div>
      )}
    </div>
  );
};

export default CardVisita;
