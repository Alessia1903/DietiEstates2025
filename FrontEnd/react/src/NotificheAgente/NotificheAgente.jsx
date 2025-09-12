import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardVisita from "../components/CardVisita/CardVisita";
import "./NotificheAgente.css";

const NotificheAgente = () => {
  const navigate = useNavigate();
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRichieste = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          "http://localhost:8080/api/estate-agents/all-booked-visits",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        const mapped = response.data.map((visit) => ({
          id: visit.id,
          richiedente: {
            nome: visit.buyerName || ""
          },
          dataRichiesta: visit.requestDate
            ? new Date(visit.requestDate).toLocaleString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })
            : "",
          stato: visit.status === "In attesa" ? "in-attesa" : (visit.status === "accettata" ? "accettata" : "rifiutata"),
          address: visit.realEstateAddress || ""
        }));
        setRichieste(mapped);
      } catch (error) {
        setRichieste([]);
      }
      setLoading(false);
    };
    fetchRichieste();
  }, []);

  // Gestione accettazione richiesta
  const handleAccetta = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8080/api/estate-agents/visits/accept",
        { visitId: id },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setRichieste(prevRichieste =>
        prevRichieste.map(richiesta =>
          richiesta.id === id
            ? { ...richiesta, stato: "accettata" }
            : richiesta
        )
      );
    } catch (error) {
      // Gestisci errore se necessario
    }
  };

  // Gestione rifiuto richiesta
  const handleRifiuta = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8080/api/estate-agents/visits/reject",
        { visitId: id },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setRichieste(prevRichieste =>
        prevRichieste.map(richiesta =>
          richiesta.id === id
            ? { ...richiesta, stato: "rifiutata" }
            : richiesta
        )
      );
    } catch (error) {
      // Gestisci errore se necessario
    }
  };

  return (
    <div className="p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="header-container">
        <div className="logo-title cursor-pointer" id="logo-title" onClick={() => navigate("/home-agente")}>
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
          {/* Notifiche */}
          <div className="icon-text hide-on-small" onClick={() => navigate("/notifiche-agente")}>
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <path d="M41.6667 8.33325H8.33335C6.04169 8.33325 4.16669 10.2083 4.16669 12.4999V37.4999C4.16669 39.7916 6.04169 41.6666 8.33335 41.6666H41.6667C43.9584 41.6666 45.8334 39.7916 45.8334 37.4999V12.4999C45.8334 10.2083 43.9584 8.33325 41.6667 8.33325ZM40.8334 17.1874L27.2084 25.7083C25.8542 26.5624 24.1459 26.5624 22.7917 25.7083L9.16669 17.1874C8.64585 16.8541 8.33335 16.2916 8.33335 15.6874C8.33335 14.2916 9.85419 13.4583 11.0417 14.1874L25 22.9166L38.9584 14.1874C40.1459 13.4583 41.6667 14.2916 41.6667 15.6874C41.6667 16.2916 41.3542 16.8541 40.8334 17.1874Z" fill="#073B4C"/>
            </svg>
            <span>Notifiche</span>
          </div>
          {/* Profilo */}
          <div className="icon-text" onClick={() => navigate("/profilo-agente")}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <g clipPath="url(#clip0_20_523)">
                <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="flex justify-start w-full mb-4 pl-8 mt-8">
        <a href="/home-agente" className="back-link" onClick={(e) => { e.preventDefault(); navigate("/home-agente"); }}>
          <span className="green-symbol" style={{display: "inline-flex", verticalAlign: "middle", marginRight: "6px"}}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{display: "inline"}} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L6 9L12 3" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Torna alla home
        </a>
      </div>

      {/* Lista richieste */}
      <h1 className="title-lg">Richieste Visite</h1>
      <div className="visits-list">
        {richieste.map((richiesta) => (
          <CardVisita
            key={richiesta.id}
            richiedente={richiesta.richiedente}
            dataRichiesta={richiesta.dataRichiesta}
            stato={richiesta.stato}
            address={richiesta.address}
            onAccetta={() => handleAccetta(richiesta.id)}
            onRifiuta={() => handleRifiuta(richiesta.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificheAgente;
