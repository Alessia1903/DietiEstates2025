import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardImmobile from "../components/CardImmobile";
import "./HomeNoLogin.css";

const HomeNoLogin = () => {
  const navigate = useNavigate();
  const [citta, setCitta] = useState("");
  const [contratto, setContratto] = useState("");
  const [classeEnergetica, setClasseEnergetica] = useState("");
  const [numLocali, setNumLocali] = useState("");
  const [prezzoMin, setPrezzoMin] = useState("");
  const [prezzoMax, setPrezzoMax] = useState("");
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [risultati, setRisultati] = useState([]);

  // Sincronizzazione prezzi
  const sincronizzaMax = (min, max) => {
    if (parseInt(max) <= parseInt(min)) {
      return (parseInt(min) + 10000).toString();
    }
    return max;
  };

  const sincronizzaMin = (min, max) => {
    if (parseInt(max) <= parseInt(min)) {
      return (parseInt(max) - 10000 > 0 ? parseInt(max) - 10000 : 0).toString();
    }
    return min;
  };

  // Gestione click su logo/titolo
  const handleLogoClick = () => {
    navigate("/");
  };

  // Gestione ricerca
  const cerca = async () => {
    if (!citta.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);

    setLoading(true);
    setShowResults(false);

    const startTime = Date.now();

    try {
      const searchParams = {
        city: citta.trim(),
        contractType: contratto || null,
        energyClass: classeEnergetica || null,
        rooms: numLocali ? parseInt(numLocali) : null,
        minPrice: prezzoMin ? parseFloat(prezzoMin) : null,
        maxPrice: prezzoMax ? parseFloat(prezzoMax) : null
      };

      const response = await axios.post(
        "http://localhost:8080/api/buyers/search",
        searchParams,
        {
          params: {
            page: 0,
            size: 5
          }
        }
      );

      setRisultati(response.data.content);
      
      // Calcola il tempo trascorso
      const elapsedTime = Date.now() - startTime;
      // Se è passato meno di 1.5 secondi, aspetta la differenza
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, Math.max(0, 1500 - elapsedTime));
    } catch (error) {
      console.error("Errore nella ricerca:", error);
      setRisultati([]);
      // Mantieni lo stesso comportamento del timer anche in caso di errore
      const elapsedTime = Date.now() - startTime;
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, Math.max(0, 1500 - elapsedTime));
    }
  };

  // Gestione input numerici
  const handleNumLocali = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setNumLocali(value.toString());
  };

  const handlePrezzoMin = (e) => {
    let value = Math.max(0, Number(e.target.value));
    setPrezzoMin(value.toString());
    setPrezzoMax(sincronizzaMax(value, prezzoMax));
  };

  const handlePrezzoMax = (e) => {
    let value = Math.max(0, Number(e.target.value));
    setPrezzoMax(value.toString());
    setPrezzoMin(sincronizzaMin(prezzoMin, value));
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="header-container">
        {/* Logo e Titolo */}
        <div className="logo-title cursor-pointer" id="logo-title" onClick={handleLogoClick}>
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

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button className="auth-btn" onClick={() => navigate("/login")}>
            <svg width="24" height="24" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_auth_user)">
                <path
                  d="M80 80C94.7333 80 106.667 68.0667 106.667 53.3334C106.667 38.6 94.7333 26.6667 80 26.6667C65.2667 26.6667 53.3333 38.6 53.3333 53.3334C53.3333 68.0667 65.2667 80 80 80ZM80 93.3334C62.2 93.3334 26.6667 102.267 26.6667 120V126.667C26.6667 130.333 29.6667 133.333 33.3333 133.333H126.667C130.333 133.333 133.333 130.333 133.333 126.667V120C133.333 102.267 97.8 93.3334 80 93.3334Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_auth_user">
                  <rect width="160" height="160" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>Area Privata</span>
          </button>
          <button className="auth-btn" onClick={() => navigate("/area-agenzia")}>
            <svg width="24" height="24" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_auth_agency)">
                <path
                  d="M75 43.75V31.25C75 24.375 69.375 18.75 62.5 18.75H25C18.125 18.75 12.5 24.375 12.5 31.25V118.75C12.5 125.625 18.125 131.25 25 131.25H125C131.875 131.25 137.5 125.625 137.5 118.75V56.25C137.5 49.375 131.875 43.75 125 43.75H75ZM37.5 118.75H25V106.25H37.5V118.75ZM37.5 93.75H25V81.25H37.5V93.75ZM37.5 68.75H25V56.25H37.5V68.75ZM37.5 43.75H25V31.25H37.5V43.75ZM62.5 118.75H50V106.25H62.5V118.75ZM62.5 93.75H50V81.25H62.5V93.75ZM62.5 68.75H50V56.25H62.5V68.75ZM62.5 43.75H50V31.25H62.5V43.75ZM118.75 118.75H75V106.25H87.5V93.75H75V81.25H87.5V68.75H75V56.25H118.75C122.188 56.25 125 59.0625 125 62.5V112.5C125 115.938 122.188 118.75 118.75 118.75ZM112.5 68.75H100V81.25H112.5V68.75ZM112.5 93.75H100V106.25H112.5V93.75Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_auth_agency">
                  <rect width="150" height="150" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>Area Agenzia</span>
          </button>
        </div>
      </div>

      {/* Barra di Ricerca */}
      <div className="search-bar w-full sm:w-auto mt-6">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="relative w-full md:w-3/4">
            <input
              type="text"
              id="citta"
              placeholder={inputError ? "Inserire un comune o una città" : "Cerca un Comune o una Città"}
              className={`w-full${inputError ? " input-error" : ""}`}
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              onFocus={() => setInputError(false)}
            />
            <span id="error-msg" className={`error-message${inputError ? "" : " hidden"}`}>
              Inserire un comune o una città
            </span>
          </div>
          <button type="button" onClick={cerca}>
            CERCA
          </button>
        </div>

        <p className="text-white text-lg mt-6 mb-0 text-center">Filtri avanzati:</p>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-center justify-between w-full">
            <select id="contratto" value={contratto} onChange={(e) => setContratto(e.target.value)}>
            <option value="">Contratto</option>
            <option value="VENDITA">Vendita</option>
            <option value="AFFITTO">Affitto</option>
          </select>
          <select id="classeEnergetica" value={classeEnergetica} onChange={(e) => setClasseEnergetica(e.target.value)}>
            <option value="">Classe Energetica</option>
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="A2">A2</option>
            <option value="A1">A1</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
          <input
            type="number"
            id="numLocali"
            placeholder="Numero di Locali"
            className="w-full sm:w-auto"
            min={0}
            value={numLocali}
            onChange={handleNumLocali}
          />
          <input
            type="number"
            id="prezzoMin"
            placeholder="€ Min"
            className="w-full sm:w-auto"
            min={0}
            step={10000}
            value={prezzoMin}
            onChange={handlePrezzoMin}
          />
          <input
            type="number"
            id="prezzoMax"
            placeholder="€ Max"
            className="w-full sm:w-auto"
            min={0}
            step={10000}
            value={prezzoMax}
            onChange={handlePrezzoMax}
          />
        </div>
      </div>

      {/* Loader video */}
      {loading && (
        <div id="loadingAnimation" className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-50">
          <video autoPlay loop muted className="w-[1000px] h-[1000px]">
            <source src="https://raw.githubusercontent.com/Alessia1903/DietiEstates2025/master/Photos/LenteAnimation.mp4" type="video/mp4" />
            Il tuo browser non supporta il tag video.
          </video>
        </div>
      )}

      {/* Risultati ricerca */}
      {showResults && (
        <div className="container mt-6 w-full max-w-4xl">
          <div id="risultati" className="flex flex-wrap justify-center gap-4">
            {risultati.length === 0 ? (
              <div className="text-gray-500 text-lg">Nessun risultato trovato</div>
            ) : (
              risultati.map((immobile) => (
                <CardImmobile 
                  key={immobile.id}
                  immobile={{
                    idAnnuncio: immobile.id,
                    immagine: immobile.imageUrl,
                    prezzo: immobile.price,
                    stanze: immobile.rooms,
                    superficie: immobile.commercialArea,
                    contratto: immobile.contractType,
                    indirizzo: `${immobile.address} ${immobile.streetNumber}`,
                    citta: immobile.city,
                    comune: immobile.district,
                    descrizione: immobile.description,
                    foto: immobile.images || [immobile.imageUrl],
                    piano: immobile.floor,
                    totalePiani: immobile.totalBuildingFloors,
                    numeroStanze: immobile.rooms,
                    classeEnergetica: immobile.energyClass,
                    arredamento: immobile.furnishing,
                    riscaldamento: immobile.heating,
                    stato: immobile.propertyStatus,
                    ascensore: immobile.elevator
                  }}
                  onClick={() => navigate("/dettagli-immobile")}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeNoLogin;
