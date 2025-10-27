import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./PrenotaVisitaMeteo.css";
import TimeSelect from "../TimeSelect";

const PrenotaVisitaMeteo = ({
  show,
  onClose,
  onConfirm,
  realEstateId,
  city
}) => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!show || !city) return;
      
      setLoading(true);
      
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(
          "http://localhost:8080/api/buyers/weather",
          { city },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        setWeatherData(response.data);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        toast.error(`Errore nel caricamento dei dati meteo: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [show, city]);
  
  const weatherDesc = {
    1: { icon: "☀️", text: "Soleggiato" },
    2: { icon: "🌤️", text: "Parzialmente nuvoloso" },
    3: { icon: "⛅", text: "Nuvoloso" },
    61: { icon: "🌧️", text: "Pioggia" },
    95: { icon: "⛈️", text: "Temporale" }
  };

  if (!show) return null;

  const handleConfirm = async () => {
    if (!selectedDateIdx || !selectedTime || !weatherData?.time?.[selectedDateIdx]) {
      toast.error("Seleziona una data e un orario validi");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const selectedDate = weatherData.time[selectedDateIdx];
      const numericId = Number(realEstateId);

      if (!realEstateId || isNaN(numericId) || numericId <= 0) {
        toast.error("ID immobile non valido o mancante");
        return;
      }

      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

      await axios.post(
        "http://localhost:8080/api/buyers/book-visit",
        {
          realEstateId: numericId,
          date: formattedDate,
          time: selectedTime
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      onConfirm();
      setSelectedDateIdx(null);
      setSelectedTime("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Errore nella prenotazione della visita: ${errorMsg}`);
    }
  };

  return (
    <div className="pvm-modal-outer">
      <div className="pvm-modal-inner">
        <h2 className="pvm-title">Prenota una visita</h2>
        <p className="pvm-desc">Scegli una data tra i prossimi 7 giorni e consulta il meteo previsto:</p>
        <div className="pvm-meteo-content">
          {loading && (
            <div className="text-center py-4">Caricamento dati meteo...</div>
          )}
          {weatherData && weatherData.time && (
            <div className="pvm-meteo-row">
            {weatherData.time.map((date, idx) => {
              const weatherCode = weatherData.weathercode[idx];
              const weatherInfo = weatherDesc[weatherCode] || { icon: "❓", text: "Non disponibile" };
              
              return (
                <div
                  key={date}
                  className={`pvm-meteo-day${selectedDateIdx === idx ? " pvm-selected" : ""}`}
                  onClick={() => setSelectedDateIdx(idx)}
                >
                  <div className="pvm-meteo-icon">{weatherInfo.icon}</div>
                  <div className="pvm-meteo-date">{new Date(date).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}</div>
                  <div className="pvm-meteo-text">{weatherInfo.text}</div>
                  <div className="pvm-meteo-temp">
                    <span className="pvm-max">{weatherData.temperature_2m_max[idx]}°</span> /
                    <span className="pvm-min">{weatherData.temperature_2m_min[idx]}°</span>
                  </div>
                  <div className="pvm-meteo-rain">
                    Pioggia: {weatherData.precipitation_sum[idx]} mm
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
        <div className="pvm-time-row">
          <TimeSelect value={selectedTime} onChange={setSelectedTime} />
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
