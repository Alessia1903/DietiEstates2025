import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CardImmobile from "../components/CardImmobile";
import Navbar from "../components/Navbar/Navbar";
import "../components/Navbar/Navbar.css";
import "./HomeLogin.css";

const HomeLogin = () => {
  const navigate = useNavigate();

  // Stati per la ricerca
  const [citta, setCitta] = useState("");
  const [contratto, setContratto] = useState("");
  const [classeEnergetica, setClasseEnergetica] = useState("");
  const [numLocali, setNumLocali] = useState("");
  const [prezzoMin, setPrezzoMin] = useState("");
  const [prezzoMax, setPrezzoMax] = useState("");

  // Stato per mostrare risultati e loader
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [risultati, setRisultati] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalePagine, setTotalePagine] = useState(1);
  const [hasNext, setHasNext] = useState(false);

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
  const cerca = useCallback(() => {
    if (!citta.trim()) {
      toast.error("Inserire un comune o una città");
      return;
    }

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

    // Salva i parametri di ricerca nella sessionStorage
    sessionStorage.setItem("citta", citta.trim());
    sessionStorage.setItem("contratto", contratto);
    sessionStorage.setItem("classeEnergetica", classeEnergetica);
    sessionStorage.setItem("numLocali", numLocali);
    sessionStorage.setItem("prezzoMin", prezzoMin);
    sessionStorage.setItem("prezzoMax", prezzoMax);
    
    // Imposta il flag per avviare la ricerca
    sessionStorage.setItem("avviaRicerca", "true");
    
    // Ricarica la pagina per avviare la ricerca
    window.location.reload();
  }, [citta, contratto, classeEnergetica, numLocali, prezzoMin, prezzoMax]);

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

  // Avvio automatico ricerca se arrivo da Cronologia o se flag avviaRicerca è presente
  useEffect(() => {
    // Se il ruolo non è user, forzare logout e redirect a HomeLogin
    const ruolo = localStorage.getItem("role");
    if (ruolo && ruolo !== "user") {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("role");
      window.location.href = "/home";
      return;
    }

    const sessionCitta = sessionStorage.getItem("citta");
    const avviaRicerca = sessionStorage.getItem("avviaRicerca");

    if (sessionCitta && avviaRicerca === "true") {
      // Imposta i parametri di ricerca dagli stati
      setCitta(sessionCitta);
      setContratto(sessionStorage.getItem("contratto") || "");
      setClasseEnergetica(sessionStorage.getItem("classeEnergetica") || "");
      setNumLocali(sessionStorage.getItem("numLocali") || "");
      setPrezzoMin(sessionStorage.getItem("prezzoMin") || "");
      setPrezzoMax(sessionStorage.getItem("prezzoMax") || "");

      // Rimuovi il flag prima di eseguire la ricerca
      sessionStorage.removeItem("avviaRicerca");

      // Avvia la ricerca API
      setLoading(true);
      setShowResults(false);

      const searchParams = {
        city: sessionCitta.trim(),
        contractType: sessionStorage.getItem("contratto") || null,
        energyClass: sessionStorage.getItem("classeEnergetica") || null,
        rooms: sessionStorage.getItem("numLocali") ? parseInt(sessionStorage.getItem("numLocali")) : null,
        minPrice: sessionStorage.getItem("prezzoMin") ? parseFloat(sessionStorage.getItem("prezzoMin")) : null,
        maxPrice: sessionStorage.getItem("prezzoMax") ? parseFloat(sessionStorage.getItem("prezzoMax")) : null
      };

      // Esegui la ricerca con un minimo di tempo di caricamento
      const executeSearch = async () => {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/buyers/search",
            searchParams,
            {
              params: {
                page: pagina - 1,
                size: 5
              }
            }
          );

          setRisultati(response.data.content);
          setTotalePagine(
            response.data.pageSize && response.data.totalElements
              ? Math.ceil(response.data.totalElements / response.data.pageSize)
              : 1
          );
          setHasNext(response.data.hasNext || false);
        } catch (error) {
          console.error("Errore nella ricerca:", error);
          setRisultati([]);
        }
      };
      
      const startTime = Date.now();
      executeSearch().then(() => {
        const elapsedTime = Date.now() - startTime;
        // Se il tempo trascorso è minore di 1.5 secondi, aspetta la differenza
        setTimeout(() => {
          setLoading(false);
          setShowResults(true);
        }, Math.max(0, 1500 - elapsedTime));
      });
    }
  }, [pagina]); // Esegui al mount e quando cambia pagina

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar role={localStorage.getItem("role") === "user" ? "user" : undefined} />
      {/* Barra di Ricerca */}
      <div className="search-bar w-full sm:w-auto mt-6">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="relative w-full md:w-3/4">
            <input
              type="text"
              id="citta"
              placeholder="Cerca un Comune o una Città"
              className="w-full"
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
            />
          </div>
          <button type="button" onClick={cerca}>
            CERCA
          </button>
        </div>

        <p className="text-white text-lg mt-6 mb-0 text-center">Filtri avanzati:</p>
        <div className="flex flex-row flex-wrap gap-4 items-center justify-center w-full mb-2">
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
                  toast.success("Ricerca salvata nei preferiti!");
                } catch (error) {
                  if (error.response && error.response.status === 409) {
                    toast.error("Hai già salvato questa ricerca tra i preferiti.");
                  } else {
                    toast.error("Errore nel salvataggio della ricerca preferita.");
                  }
                  console.error(error);
                }
              }}
            >
              Salva ricerca
            </button>
          </div>
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
                    foto: immobile.imageUrls || [immobile.imageUrl],
                    piano: immobile.floor,
                    totalePiani: immobile.totalBuildingFloors,
                    numeroStanze: immobile.rooms,
                    classeEnergetica: immobile.energyClass,
                    arredamento: immobile.furnishing,
                    riscaldamento: immobile.heating,
                    stato: immobile.propertyStatus,
                    ascensore: immobile.elevator
                  }}
                  onClick={handleCardClick}
                />
              ))
            )}
          </div>
          {/* Paginazione */}
          <div className="pagination-container items-center justify-center flex flex-wrap mt-8">
            <button
              className="pagination-button"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
            >
              <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5833 22.9166H16.3125L26.4792 12.75C27.2917 11.9375 27.2917 10.6041 26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163L9.8125 23.5208C9 24.3333 9 25.6458 9.8125 26.4583L23.5417 40.1875C24.3542 41 25.6667 41 26.4792 40.1875C27.2917 39.375 27.2917 38.0625 26.4792 37.25L16.3125 27.0833H39.5833C40.7292 27.0833 41.6667 26.1458 41.6667 25C41.6667 23.8541 40.7292 22.9166 39.5833 22.9166Z" fill="white"/>
              </svg>
            </button>
            <button
              className="pagination-button"
              onClick={() => setPagina((p) => p + 1)}
              disabled={!hasNext}
            >
              <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4166 27.0833H33.6874L23.5208 37.25C22.7083 38.0625 22.7083 39.3958 23.5208 40.2083C24.3333 41.0208 25.6458 41.0208 26.4583 40.2083L40.1874 26.4791C40.9999 25.6666 40.9999 24.3541 40.1874 23.5416L26.4791 9.79163C25.6666 8.97913 24.3541 8.97913 23.5416 9.79163C22.7291 10.6041 22.7291 11.9166 23.5416 12.7291L33.6874 22.9166H10.4166C9.27075 22.9166 8.33325 23.8541 8.33325 25C8.33325 26.1458 9.27075 27.0833 10.4166 27.0833Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLogin;
