import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardImmobile from "../components/CardImmobile";
import "./HomeAgente.css";

const annunciPerPagina = 5;

const HomeAgente = () => {
  const navigate = useNavigate();
  const [paginaCorrente, setPaginaCorrente] = useState(1);
  const [annunci, setAnnunci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalePagine, setTotalePagine] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    // Fetch immobili dell'agente dal backend
    const fetchImmobili = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `http://localhost:8080/api/estate-agents/my-properties?page=${paginaCorrente - 1}&size=${annunciPerPagina}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        // Mappa i dati backend -> frontend per CardImmobile
        const immobili = response.data.content.map((immobile) => ({
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
          // Campi aggiuntivi per DettagliImmobile
          foto: immobile.images || (immobile.imageUrl ? [immobile.imageUrl] : []),
          piano: immobile.floor,
          totalePiani: immobile.totalBuildingFloors,
          numeroStanze: immobile.rooms,
          classeEnergetica: immobile.energyClass,
          arredamento: immobile.furnishing,
          riscaldamento: immobile.heating,
          stato: immobile.propertyStatus,
          ascensore: immobile.elevator,
        }));
        setAnnunci(immobili);
        setTotalePagine(
          response.data.pageSize && response.data.totalElements
            ? Math.ceil(response.data.totalElements / response.data.pageSize)
            : 1
        );
        setHasNext(response.data.hasNext || false);
      } catch (error) {
        setAnnunci([]);
      }
      setLoading(false);
    };
    fetchImmobili();
  }, [paginaCorrente]);

  // Non serve più slice, i dati sono già paginati dal backend
  const annunciDaMostrare = annunci;

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleNotificheClick = () => {
    navigate("/notifiche-agente");
  };

  const handleProfiloClick = () => {
    navigate("/profilo-agente");
  };

  const handleAggiungiAnnuncio = () => {
    navigate("/aggiungi-immobile");
  };

  return (
    <div className="flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Barra superiore */}
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
        {/* Sezioni Icone */}
        <div className="top-right-icons">
          {/* Notifiche */}
          <div className="icon-text hide-on-small" onClick={handleNotificheClick}>
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <path d="M41.6667 8.33325H8.33335C6.04169 8.33325 4.16669 10.2083 4.16669 12.4999V37.4999C4.16669 39.7916 6.04169 41.6666 8.33335 41.6666H41.6667C43.9584 41.6666 45.8334 39.7916 45.8334 37.4999V12.4999C45.8334 10.2083 43.9584 8.33325 41.6667 8.33325ZM40.8334 17.1874L27.2084 25.7083C25.8542 26.5624 24.1459 26.5624 22.7917 25.7083L9.16669 17.1874C8.64585 16.8541 8.33335 16.2916 8.33335 15.6874C8.33335 14.2916 9.85419 13.4583 11.0417 14.1874L25 22.9166L38.9584 14.1874C40.1459 13.4583 41.6667 14.2916 41.6667 15.6874C41.6667 16.2916 41.3542 16.8541 40.8334 17.1874Z" fill="#073B4C"/>
            </svg>
            <span>Notifiche</span>
          </div>
          {/* Profilo */}
          <div className="icon-text" onClick={handleProfiloClick}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <g clipPath="url(#clip0_20_523)">
                <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 12.5C34.15 12.5 37.5 15.85 37.5 20C37.5 24.15 34.15 27.5 30 27.5C25.85 27.5 22.5 24.15 22.5 20C22.5 15.85 25.85 12.5 30 12.5ZM30 48C23.75 48 18.225 44.8 15 39.95C15.075 34.975 25 32.25 30 32.25C34.975 32.25 44.925 34.975 45 39.95C41.775 44.8 36.25 48 30 48Z" fill="#073B4C"/>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottone Nuovo Annuncio */}
      <div className="register-box cursor-pointer" onClick={handleAggiungiAnnuncio}>
        <div className="agency-icon-container">
          {/* Icona edificio */}
          <svg className="building-icon" xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 300 300" fill="none">
            <g clipPath="url(#clip0_11_444)">
              <path d="M150 87.5V62.5C150 48.75 138.75 37.5 125 37.5H50C36.25 37.5 25 48.75 25 62.5V237.5C25 251.25 36.25 262.5 50 262.5H250C263.75 262.5 275 251.25 275 237.5V112.5C275 98.75 263.75 87.5 250 87.5H150ZM75 237.5H50V212.5H75V237.5ZM75 187.5H50V162.5H75V187.5ZM75 137.5H50V112.5H75V137.5ZM75 87.5H50V62.5H75V87.5ZM125 237.5H100V212.5H125V237.5ZM125 187.5H100V162.5H125V187.5ZM125 137.5H100V112.5H125V137.5ZM125 87.5H100V62.5H125V87.5ZM237.5 237.5H150V212.5H175V187.5H150V162.5H175V137.5H150V112.5H237.5C244.375 112.5 250 118.125 250 125V225C250 231.875 244.375 237.5 237.5 237.5ZM225 137.5H200V162.5H225V137.5ZM225 187.5H200V212.5H225V187.5Z" fill="#073B4C"/>
            </g>
            <defs>
              <clipPath id="clip0_11_444">
                <rect width="300" height="300" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          {/* Cerchio bianco */}
          <div className="circle"></div>
          {/* Icona "+" */}
          <div className="plus-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="small-plus-icon">
              <g clipPath="url(#clip0_11_448)">
                <path d="M50 8.33337C27 8.33337 8.33337 27 8.33337 50C8.33337 73 27 91.6667 50 91.6667C73 91.6667 91.6667 73 91.6667 50C91.6667 27 73 8.33337 50 8.33337ZM66.6667 54.1667H54.1667V66.6667C54.1667 68.9584 52.2917 70.8334 50 70.8334C47.7084 70.8334 45.8334 68.9584 45.8334 66.6667V54.1667H33.3334C31.0417 54.1667 29.1667 52.2917 29.1667 50C29.1667 47.7084 31.0417 45.8334 33.3334 45.8334H45.8334V33.3334C45.8334 31.0417 47.7084 29.1667 50 29.1667C52.2917 29.1667 54.1667 31.0417 54.1667 33.3334V45.8334H66.6667C68.9584 45.8334 70.8334 47.7084 70.8334 50C70.8334 52.2917 68.9584 54.1667 66.6667 54.1667Z" fill="#06D6A0"/>
              </g>
              <defs>
                <clipPath id="clip0_11_448">
                  <rect width="100" height="100" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <p className="text-center text-2xl font-semibold mt-4">INSERISCI UN ANNUNCIO</p>
      </div>

      {/* Risultati annunci */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="container mt-6 w-full max-w-4xl flex">
          <div id="risultati" className="flex flex-wrap justify-center gap-4 w-full">
            {loading ? (
              <div className="text-gray-500 text-lg">Caricamento immobili...</div>
            ) : annunci.length === 0 ? (
              <div className="text-gray-500 text-lg">Non hai creato alcun annuncio.</div>
            ) : (
              annunciDaMostrare.map((immobile) => (
                <CardImmobile
                  key={immobile.idAnnuncio}
                  immobile={immobile}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Navigazione Risultati */}
      <div className="pagination-container items-center justify-center flex flex-wrap mt-8">
        <button
          className="pagination-button"
          onClick={() => setPaginaCorrente((p) => Math.max(1, p - 1))}
          disabled={paginaCorrente === 1}
        >
          <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39.5833 22.9166H16.3125L26.4792 12.75C27.2917 11.9375 27.2917 10.6041 26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163L9.8125 23.5208C9 24.3333 9 25.6458 9.8125 26.4583L23.5417 40.1875C24.3542 41 25.6667 41 26.4792 40.1875C27.2917 39.375 27.2917 38.0625 26.4792 37.25L16.3125 27.0833H39.5833C40.7292 27.0833 41.6667 26.1458 41.6667 25C41.6667 23.8541 40.7292 22.9166 39.5833 22.9166Z" fill="white"/>
          </svg>
        </button>
        <button
          className="pagination-button"
          onClick={() => setPaginaCorrente((p) => p + 1)}
          disabled={!hasNext}
        >
          <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4166 27.0833H33.6874L23.5208 37.25C22.7083 38.0625 22.7083 39.3958 23.5208 40.2083C24.3333 41.0208 25.6458 41.0208 26.4583 40.2083L40.1874 26.4791C40.9999 25.6666 40.9999 24.3541 40.1874 23.5416L26.4791 9.79163C25.6666 8.97913 24.3541 8.97913 23.5416 9.79163C22.7291 10.6041 22.7291 11.9166 23.5416 12.7291L33.6874 22.9166H10.4166C9.27075 22.9166 8.33325 23.8541 8.33325 25C8.33325 26.1458 9.27075 27.0833 10.4166 27.0833Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HomeAgente;
