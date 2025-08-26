import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardImmobile from "../components/CardImmobile";
import "./HomeLogin.css";

const MOCK_IMMOBILI = [
  {
    idAnnuncio: 1,
    immagine: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    prezzo: 220000,
    stanze: 3,
    superficie: 90,
    contratto: "Vendita",
    indirizzo: "Via Roma 12",
    citta: "Napoli",
    comune: "Napoli",
    descrizione: "Luminoso appartamento in zona centrale, vicino a tutti i servizi. Ampio salone, cucina abitabile, due camere da letto e bagno. Balcone panoramico."
  },
  {
    idAnnuncio: 2,
    immagine: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    prezzo: 1200,
    stanze: 2,
    superficie: 55,
    contratto: "Affitto",
    indirizzo: "Via Milano 8",
    citta: "Milano",
    comune: "Milano",
    descrizione: "Bilocale arredato in zona Isola, ideale per giovani coppie. Composto da soggiorno con angolo cottura, camera matrimoniale, bagno e balcone."
  },
  {
    idAnnuncio: 3,
    immagine: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
    prezzo: 540000,
    stanze: 5,
    superficie: 180,
    contratto: "Vendita",
    indirizzo: "Via Appia 100",
    citta: "Roma",
    comune: "Roma",
    descrizione: "Ampia villa indipendente con giardino privato e garage doppio. Salone, cucina, quattro camere, tre bagni, terrazzo e cantina."
  }
];

const HomeLogin = () => {
  const navigate = useNavigate();

  // Stati per la ricerca
  const [citta, setCitta] = useState("");
  const [contratto, setContratto] = useState("");
  const [classeEnergetica, setClasseEnergetica] = useState("");
  const [numLocali, setNumLocali] = useState("");
  const [prezzoMin, setPrezzoMin] = useState("");
  const [prezzoMax, setPrezzoMax] = useState("");
  const [inputError, setInputError] = useState(false);

  // Stato per mostrare risultati e loader
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

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
  const cerca = () => {
    if (!citta.trim()) {
      setInputError(true);
      return;
    }
    setInputError(false);

    // Salva la ricerca in localStorage (max 10) per utente
    const userEmail = localStorage.getItem("userEmail") || "anonimo";
    const key = `ricercheSalvate_${userEmail}`;
    const nuovaRicerca = {
      citta,
      contratto,
      classeEnergetica,
      numLocali,
      prezzoMin,
      prezzoMax,
      data: new Date().toLocaleString()
    };
    let history = JSON.parse(localStorage.getItem(key) || "[]");
    history.push(nuovaRicerca);
    if (history.length > 10) {
      history = history.slice(history.length - 10);
    }
    localStorage.setItem(key, JSON.stringify(history));

    // Simula caricamento
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);

    // Salva i parametri di ricerca nella sessionStorage
    sessionStorage.setItem("citta", citta.trim());
    sessionStorage.setItem("contratto", contratto);
    sessionStorage.setItem("classeEnergetica", classeEnergetica);
    sessionStorage.setItem("numLocali", numLocali);
    sessionStorage.setItem("prezzoMin", prezzoMin);
    sessionStorage.setItem("prezzoMax", prezzoMax);

    // (Non reindirizza, mostra risultati sotto)
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

  const handleCardClick = () => {
    navigate("/dettagli-immobile");
  }

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
        {/* Icone aggiuntive */}
        <div className="top-right-icons">
          {/* Notifiche */}
          <div className="icon-text hide-on-small" onClick={() => navigate("/notifiche-utente")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" fill="none" className="custom-text-color">
              <g clipPath="url(#clip0_26_983)">
                <path d="M41.6665 8.33337H8.33317C6.0415 8.33337 4.1665 10.2084 4.1665 12.5V37.5C4.1665 39.7917 6.0415 41.6667 8.33317 41.6667H41.6665C43.9582 41.6667 45.8332 39.7917 45.8332 37.5V12.5C45.8332 10.2084 43.9582 8.33337 41.6665 8.33337ZM40.8332 17.1875L27.2082 25.7084C25.854 26.5625 24.1457 26.5625 22.7915 25.7084L9.1665 17.1875C8.64567 16.8542 8.33317 16.2917 8.33317 15.6875C8.33317 14.2917 9.854 13.4584 11.0415 14.1875L24.9998 22.9167L38.9582 14.1875C40.1457 13.4584 41.6665 14.2917 41.6665 15.6875C41.6665 16.2917 41.354 16.8542 40.8332 17.1875Z" fill="#073B4C"/>
              </g>
              <defs>
                <clipPath id="clip0_26_983">
                  <rect width="50" height="50" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Notifiche</span>
          </div>
          {/* Cronologia */}
          <div className="icon-text hide-on-small" onClick={() => navigate("/cronologia")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" fill="none" className="custom-text-color">
              <g clipPath="url(#clip0_26_980)">
                <path d="M27.6248 6.24995C17.0206 5.95828 8.33311 14.4791 8.33311 24.9999H4.60395C3.66645 24.9999 3.20811 26.1249 3.87478 26.7708L9.68728 32.6041C10.1039 33.0208 10.7498 33.0208 11.1664 32.6041L16.9789 26.7708C17.6248 26.1249 17.1664 24.9999 16.2289 24.9999H12.4998C12.4998 16.8749 19.1248 10.3124 27.2914 10.4166C35.0414 10.5208 41.5623 17.0416 41.6664 24.7916C41.7706 32.9374 35.2081 39.5833 27.0831 39.5833C23.7289 39.5833 20.6248 38.4374 18.1664 36.4999C17.3331 35.8541 16.1664 35.9166 15.4164 36.6666C14.5414 37.5416 14.6039 39.0208 15.5831 39.7708C18.7498 42.2708 22.7289 43.7499 27.0831 43.7499C37.6039 43.7499 46.1248 35.0624 45.8331 24.4583C45.5623 14.6874 37.3956 6.52078 27.6248 6.24995ZM26.5623 16.6666C25.7081 16.6666 24.9998 17.3749 24.9998 18.2291V25.8958C24.9998 26.6249 25.3956 27.3124 26.0206 27.6874L32.5206 31.5416C33.2706 31.9791 34.2289 31.7291 34.6664 30.9999C35.1039 30.2499 34.8539 29.2916 34.1248 28.8541L28.1248 25.2916V18.2083C28.1248 17.3749 27.4164 16.6666 26.5623 16.6666Z" fill="#073B4C"/>
              </g>
              <defs>
                <clipPath id="clip0_26_980">
                  <rect width="50" height="50" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Cronologia</span>
          </div>
          {/* Preferiti */}
          <div className="icon-text hide-on-small" onClick={() => navigate("/preferiti")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 50 50" fill="none">
              <path d="M25 45.8333C23.9583 45.8333 22.9167 45.4167 22.0833 44.6875L7.29167 31.25C4.16667 28.5417 2.08333 24.8958 2.08333 20.8333C2.08333 13.2292 8.22917 7.08333 15.8333 7.08333C19.6875 7.08333 23.2292 8.95833 25 12.0833C26.7708 8.95833 30.3125 7.08333 34.1667 7.08333C41.7708 7.08333 47.9167 13.2292 47.9167 20.8333C47.9167 24.8958 45.8333 28.5417 42.7083 31.25L27.9167 44.6875C27.0833 45.4167 26.0417 45.8333 25 45.8333Z" fill="#06D6A0"/>
            </svg>
            <span>Preferiti</span>
          </div>
          {/* Profilo */}
          <div className="icon-text" onClick={() => navigate("/profilo-utente")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 60 60" fill="none" className="top-right custom-text-color">
              <g clipPath="url(#clip0_26_978)">
                <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
              </g>
              <defs>
                <clipPath id="clip0_26_978">
                  <rect width="60" height="60" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
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
        <div className="flex flex-row flex-wrap gap-4 items-center justify-center w-full mb-2">
          <select id="contratto" value={contratto} onChange={(e) => setContratto(e.target.value)}>
            <option value="">Contratto</option>
            <option value="vendita">Vendita</option>
            <option value="affitto">Affitto</option>
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
        </div>
        <div className="flex flex-row flex-wrap gap-4 items-center justify-center w-full">
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

      {/* Card risultati immobili */}
      {showResults && (
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-end mb-2">
            <button
              className="accesso"
              style={{ minWidth: "180px", fontWeight: "bold" }}
              onClick={async () => {
                // Chiamata backend per salvataggio ricerca preferita
                try {
                  const token = localStorage.getItem("jwtToken");
                  const payload = {
                    city: citta,
                    contractType: contratto,
                    energyClass: classeEnergetica,
                    rooms: numLocali,
                    minPrice: prezzoMin,
                    maxPrice: prezzoMax
                  };
                  await import("axios").then(({default: axios}) =>
                    axios.post(
                      "http://localhost:8080/api/buyers/favorites/add",
                      payload,
                      {
                        headers: {
                          "Authorization": `Bearer ${token}`,
                          "Content-Type": "application/json"
                        }
                      }
                    )
                  );
                  alert("Ricerca salvata nei preferiti!");
                } catch (error) {
                  alert("Errore nel salvataggio della ricerca preferita.");
                  console.error(error);
                }
              }}
            >
              Salva ricerca
            </button>
          </div>
          <div id="risultati">
            {MOCK_IMMOBILI.map((immobile) => (
              <CardImmobile key={immobile.id} immobile={immobile} onClick={handleCardClick}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLogin;
