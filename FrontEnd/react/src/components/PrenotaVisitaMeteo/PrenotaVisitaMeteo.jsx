import React, { useState } from "react";
import "./PrenotaVisitaMeteo.css";

const PrenotaVisitaMeteo = ({
  show,
  onClose,
  onConfirm
}) => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Mock meteo come backend
  const today = new Date();
  const daily = {
    time: Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().slice(0, 10);
    }),
    temperature_2m_max: [30, 31, 29, 28, 32, 33, 30],
    temperature_2m_min: [20, 21, 19, 18, 22, 23, 20],
    precipitation_sum: [0, 0.2, 0, 1.5, 0, 0, 0.8],
    weathercode: [1, 2, 3, 61, 1, 2, 95]
  };
  const weatherDesc = {
    1: { icon: "☀️", text: "Soleggiato" },
    2: { icon: "🌤️", text: "Parzialmente nuvoloso" },
    3: { icon: "⛅", text: "Nuvoloso" },
    61: { icon: "🌧️", text: "Pioggia" },
    95: { icon: "⛈️", text: "Temporale" }
  };

  if (!show) return null;

  const handleConfirm = () => {
    onConfirm();
    setSelectedDateIdx(null);
    setSelectedTime("");
  };

  return (
    <div className="pvm-modal-outer">
      <div className="pvm-modal-inner">
        <h2 className="pvm-title">Prenota una visita</h2>
        <p className="pvm-desc">Scegli una data tra i prossimi 7 giorni e consulta il meteo previsto:</p>
        <div className="pvm-meteo-row">
          {daily.time.map((date, idx) => (
            <div
              key={date}
              className={`pvm-meteo-day${selectedDateIdx === idx ? " pvm-selected" : ""}`}
              onClick={() => setSelectedDateIdx(idx)}
            >
              <div className="pvm-meteo-icon">{weatherDesc[daily.weathercode[idx]].icon}</div>
              <div className="pvm-meteo-date">{new Date(date).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}</div>
              <div className="pvm-meteo-text">{weatherDesc[daily.weathercode[idx]].text}</div>
              <div className="pvm-meteo-temp">
                <span className="pvm-max">{daily.temperature_2m_max[idx]}°</span> /
                <span className="pvm-min">{daily.temperature_2m_min[idx]}°</span>
              </div>
              <div className="pvm-meteo-rain">
                Pioggia: {daily.precipitation_sum[idx]} mm
              </div>
            </div>
          ))}
        </div>
        <div className="pvm-time-row">
          <label htmlFor="visit-time" className="pvm-label">Orario:</label>
          <input
            id="visit-time"
            type="time"
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            className="pvm-time-input"
          />
        </div>
        <div className="pvm-buttons">
          <button
            className="pvm-confirm"
            disabled={selectedDateIdx === null || !selectedTime}
            onClick={handleConfirm}
          >
            Conferma prenotazione
          </button>
          <button
            className="pvm-cancel"
            onClick={onClose}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrenotaVisitaMeteo;
