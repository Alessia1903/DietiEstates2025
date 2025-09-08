import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DettagliImmobile.css";
import PrenotaVisitaMeteo from "../components/PrenotaVisitaMeteo/PrenotaVisitaMeteo";


const DettagliImmobile = () => {
  const [annuncio, setAnnuncio] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVisitMenu, setShowVisitMenu] = useState(false);
  const [showMappa, setShowMappa] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se l'utente è un buyer basandosi sul path e il token
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const currentPath = location.pathname;
    const referrer = document.referrer;
    
    // Percorsi tipici del buyer
    const buyerPaths = ["/home", "/cronologia", "/preferiti", "/notifiche-utente", "/profilo-utente"];
    
    // Controlla se il percorso corrente o il referrer sono di un buyer
    const isBuyerPath = buyerPaths.some(path => 
      referrer.includes(path) || currentPath === path
    );

    setIsBuyer(!!token && isBuyerPath);
  }, [location]);

  useEffect(() => {
    // Recupera i dati dell'immobile da sessionStorage
    const rawData = sessionStorage.getItem("dettagliImmobile");
    
    if (!rawData) {
      navigate(-1);
      return;
    }

    try {
      const parsedData = JSON.parse(rawData);
      setAnnuncio(parsedData);
    } catch (error) {
      navigate(-1);
    }
  }, [navigate]);

  if (!annuncio) return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="header-container">
        <div className="logo-title cursor-pointer" id="logo-title" onClick={() => navigate("/")}>
          <img
            src="https://github.com/Alessia1903/DietiEstates2025/blob/master/Photos/LenteObl-removebg-preview.png?raw=true"
            alt="Logo DietiEstates"
            className="logo"
          />
        </div>
      </div>
      <div className="text-gray-500 text-lg mt-8">Nessun dettaglio immobile disponibile.</div>
    </div>
  );

  const images = annuncio.foto && annuncio.foto.length > 0
    ? annuncio.foto
    : ["https://github.com/Alessia1903/DietiEstates2025/blob/master/Photos/LenteObl-removebg-preview.png?raw=true"];

  const prevImg = () => setImgIndex((i) => Math.max(i - 1, 0));
  const nextImg = () => setImgIndex((i) => Math.min(i + 1, images.length - 1));

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Solo Logo */}
      <div className="header-container">
        <div className="logo-title cursor-pointer" id="logo-title" onClick={() => navigate("/")}>
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
      </div>

      {/* Back link */}
      <div className="flex justify-start w-full mb-4 pl-8 mt-8">
        <a
          href="#"
          className="back-link"
          onClick={e => { e.preventDefault(); navigate(-1); }}
        >
          <span className="green-symbol">
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: "inline" }} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L6 9L12 3" stroke="#06D6A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Torna Indietro
        </a>
      </div>

      {/* Slider immagini */}
      <div className="image-slider" style={{ position: "relative", maxWidth: "600px", margin: "0 auto 24px auto" }}>
        <button
          className="prev-btn"
          onClick={prevImg}
          disabled={imgIndex === 0}
        >
          {/* Prev SVG */}
          <svg width="30" height="30" viewBox="0 0 50 50" fill="none">
            <g>
              <path d="M39.5833 22.9166H16.3125L26.4792 12.75C27.2917 11.9375 27.2917 10.6041 26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163L9.8125 23.5208C9 24.3333 9 25.6458 9.8125 26.4583L23.5417 40.1875C24.3542 41 25.6667 41 26.4792 40.1875C27.2917 39.375 27.2917 38.0625 26.4792 37.25L16.3125 27.0833H39.5833C40.7292 27.0833 41.6667 26.1458 41.6667 25C41.6667 23.8541 40.7292 22.9166 39.5833 22.9166Z" fill="white"/>
            </g>
          </svg>
        </button>
        <img
          id="annuncio-img"
          src={images[imgIndex]}
          alt="Immagine annuncio"
          className="max-w-full h-auto"
          style={{ maxHeight: "400px", borderRadius: "10px", display: "block", margin: "0 auto" }}
        />
        <button
          className="next-btn"
          onClick={nextImg}
          disabled={imgIndex === images.length - 1}
        >
          {/* Next SVG */}
          <svg width="30" height="30" viewBox="0 0 50 50" fill="none">
            <g>
              <path d="M10.4166 27.0833H33.6874L23.5208 37.25C22.7083 38.0625 22.7083 39.3958 23.5208 40.2083C24.3333 41.0208 25.6458 41.0208 26.4583 40.2083L40.1874 26.4791C40.9999 25.6666 40.9999 24.3541 40.1874 23.5416L26.4791 9.79163C25.6666 8.97913 24.3541 8.97913 23.5416 9.79163C22.7291 10.6041 22.7291 11.9166 23.5416 12.7291L33.6874 22.9166H10.4166C9.27075 22.9166 8.33325 23.8541 8.33325 25C8.33325 26.1458 9.27075 27.0833 10.4166 27.0833Z" fill="white"/>
            </g>
          </svg>
        </button>
      </div>

      {/* Dettagli annuncio */}
      <div className="container w-[90%] sm:w-[90%] md:w-[90%] lg:w-[60%] mt-2">
        <div className="flex w-full justify-between items-center">
          <h2 id="annuncio-prezzo" className="custom-text">
            € {annuncio.prezzo?.toLocaleString?.() || annuncio.prezzo}
          </h2>
          <div id="mappaContainer">
            <a
              href="#"
              onClick={e => { e.preventDefault(); setShowMappa(true); }}
              style={{
                color: "#006D90",
                fontFamily: "Lexend",
                fontWeight: 500,
                textDecoration: "underline"
              }}
            >
              Visualizza la mappa
            </a>
          </div>
        </div>
        <p id="annuncio-titolo">
          In {annuncio.contratto} in {annuncio.indirizzo}, {annuncio.citta}, {annuncio.comune}
        </p>
        <p id="annuncio-descrizione">{annuncio.descrizione}</p>
        <div className="info-box">
          <ul>
            <li><strong>Piano:</strong> <span>{annuncio.piano}</span></li>
            <li><strong>Totale Piani Edificio:</strong> <span>{annuncio.totalePiani}</span></li>
            <li><strong>Superficie:</strong> <span>{annuncio.superficie} m²</span></li>
            <li><strong>Numero di Stanze:</strong> <span>{annuncio.numeroStanze}</span></li>
            <li><strong>Classe Energetica:</strong> <span>{annuncio.classeEnergetica}</span></li>
            <li><strong>Arredamento:</strong> <span>{annuncio.arredamento}</span></li>
            <li><strong>Riscaldamento:</strong> <span>{annuncio.riscaldamento}</span></li>
            <li><strong>Stato dell'Immobile:</strong> <span>{annuncio.stato}</span></li>
            <li><strong>Ascensore:</strong> <span>{annuncio.ascensore ? "Sì" : "No"}</span></li>
          </ul>
        </div>
      </div>

      {/* Bottone visita solo per BUYER */}
      {isBuyer && (
        <>
          <button className="visit-button mx-auto" onClick={() => setShowVisitMenu(true)}>
            RICHIEDI UNA VISITA
          </button>

          {/* Modale richiesta visita */}
          <PrenotaVisitaMeteo
            show={showVisitMenu}
            onClose={() => setShowVisitMenu(false)}
            onConfirm={() => {
              setShowVisitMenu(false);
              setShowSuccess(true);
            }}
          />

          {/* Modale successo */}
          {showSuccess && (
            <div id="successModal" style={{ display: "flex" }}>
              <div className="modal-outer-success">
                <div className="modal-inner-success">
                  <div data-svg-wrapper>
                    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M55 9.16675C29.7 9.16675 9.16663 29.7001 9.16663 55.0001C9.16663 80.3001 29.7 100.833 55 100.833C80.3 100.833 100.833 80.3001 100.833 55.0001C100.833 29.7001 80.3 9.16675 55 9.16675ZM42.5791 74.6626L26.125 58.2084C24.3375 56.4209 24.3375 53.5334 26.125 51.7459C27.9125 49.9584 30.8 49.9584 32.5875 51.7459L45.8333 64.9459L77.3666 33.4126C79.1541 31.6251 82.0416 31.6251 83.8291 33.4126C85.6166 35.2001 85.6166 38.0876 83.8291 39.8751L49.0416 74.6626C47.3 76.4501 44.3666 76.4501 42.5791 74.6626Z" fill="#4DC538"/>
                    </svg>
                  </div>
                  <h2>Complimenti!</h2>
                  <p>La richiesta è stata inviata con successo.</p>
                  <div className="modal-spacer"></div>
                  <button id="confirmSuccessButton" onClick={() => setShowSuccess(false)}>
                    PROSEGUI
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Modale mappa */}
      {showMappa && (
        <div id="mappaModal" className="mappa-modal" style={{ display: "flex" }}>
          <div className="modal-contenuto">
            <button onClick={() => setShowMappa(false)}>Chiudi Mappa</button>
            <div id="mappa" className="mappa-grande"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DettagliImmobile;
