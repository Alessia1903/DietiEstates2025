import React, { useState, useEffect } from "react";
import CardNotifica from "../components/CardNotifica/CardNotifica";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import "../components/Navbar/Navbar.css";
import "./NotificheUtente.css";

const CATEGORIE = [
  { key: "promozionali", label: "Promozionali" },
  { key: "nuove-proprieta", label: "Nuove proprietà" },
  { key: "visite", label: "Visite" },
];

// Funzione di mapping tipo backend -> categoria frontend
function categoriaNotifica(type) {
  if (!type) return "promozionali";
  if (type === "NUOVA_PROPRIETA") return "nuove-proprieta";
  if (type === "VISITA") return "visite";
  return "promozionali";
}

const NotificheUtente = () => {
  const [notifiche, setNotifiche] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attive, setAttive] = useState({
    promozionali: true,
    "nuove-proprieta": true,
    visite: true,
  });

  const NOTIFICHE_PER_PAGINA = 5;
  const [pagina, setPagina] = useState(1);
  const [totalePagine, setTotalePagine] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchNotifiche = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        const axios = (await import("axios")).default;
        const response = await axios.get(
          `http://localhost:8080/api/buyers/notifications?page=${pagina - 1}&size=${NOTIFICHE_PER_PAGINA}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        // Mappa notifiche backend -> frontend
        const mapped = response.data.content.map((n) => ({
          id: n.id,
          categoria: categoriaNotifica(n.type),
          titolo: n.title,
          testo: n.message,
          data: n.createdAt ? n.createdAt.replace("T", " ").substring(0, 16) : "",
        }));
        setNotifiche(mapped);
        setTotalePagine(
          response.data.pageSize && response.data.totalElements
            ? Math.ceil(response.data.totalElements / response.data.pageSize)
            : 1
        );
        setHasNext(response.data.hasNext || false);
      } catch (error) {
        setNotifiche([]);
        toast.error("Errore nel caricamento delle notifiche.");
      }
      setLoading(false);
    };
    fetchNotifiche();
  }, [pagina]);

  // Filtra notifiche in base ai toggle attivi
  const notificheFiltrate = notifiche.filter((n) => attive[n.categoria]);

  const notificheDaMostrare = notificheFiltrate;

  const handleToggle = (cat) => {
    setAttive((prev) => ({ ...prev, [cat]: !prev[cat] }));
    setPagina(1); // resetta a pagina 1 se cambi filtro
  };

  return (
    <div className="notifiche-utente-root flex flex-col items-center p-8" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Navbar role="user" />

      {/* Toggles categorie */}
      <div className="categorie-toggle-container flex flex-wrap gap-6 mt-8 mb-8">
        {CATEGORIE.map((cat) => (
          <label key={cat.key} className="toggle-label flex items-center gap-2">
            <input
              type="checkbox"
              checked={attive[cat.key]}
              onChange={() => handleToggle(cat.key)}
              className="toggle-checkbox"
            />
            <span>{cat.label}</span>
          </label>
        ))}
      </div>

      {/* Lista notifiche */}
      <div className="notifiche-list w-full flex flex-col gap-6">
        {loading ? (
          <div className="text-gray-500 text-lg text-center">Caricamento notifiche...</div>
        ) : notificheFiltrate.length === 0 ? (
          <div className="text-gray-500 text-lg text-center">Non ci sono notifiche da leggere.</div>
        ) : (
          notificheDaMostrare.map((notifica) => (
            <CardNotifica
              key={notifica.id}
              {...notifica}
            />
          ))
        )}
      </div>

      {/* Paginazione */}
      <div className="pagination-container items-center justify-center flex flex-wrap">
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
  );
};

export default NotificheUtente;
