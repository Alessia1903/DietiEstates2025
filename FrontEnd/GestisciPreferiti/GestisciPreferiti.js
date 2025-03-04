let paginaCorrente = 1;
const preferitiPerPagina = 5;
let risultatiGlobali = []; // Salviamo tutti i preferiti
let filtri = []; // Dati per i filtri

document.addEventListener("DOMContentLoaded", async () => {
    const token = "Bearer abc123xyz456token789"; // Assegna un valore fittizio al token per il test
    //const token = localStorage.getItem("token"); // Recupera il token salvato

    if (!token) {
      alert("Accesso non autorizzato. Effettua il login.");
      window.location.href = "../AreaUtente/AreaUtente.html"; // Torna alla pagina di login
      return;
    }

    try {
        const response = await fetch("https://cd5480b0-66c3-4d3f-8864-98af937fa5de.mock.pstmn.io/cronologia", {
        method: "GET",
        headers: {
          "Authorization": token, // Invia il token per l'autenticazione
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Errore nel recupero dei preferiti");
      }

      risultatiGlobali = await response.json();

      // Se la risposta contiene i filtri, assegnali alla variabile "filtri"
      if (risultatiGlobali && risultatiGlobali.filtri) {
        filtri = risultatiGlobali.filtri;
      }

      if (risultatiGlobali.length === 0) {
        return;
      }

      aggiornaPaginazione(); // Mostra i primi risultati
      mostraPreferiti(); // Mostra i filtri ricevuti dal backend
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un problema nel caricamento dei preferiti.");
    }
});

function aggiornaPaginazione() {
    paginaCorrente = 1; // Resetta alla prima pagina quando carichiamo nuovi dati
    mostraPreferiti();
}

function mostraPreferiti() {
    const container = document.getElementById("search-container");
    container.innerHTML = ""; // Pulisce i vecchi risultati

    // Calcola l'inizio e la fine dell'array da visualizzare in base alla pagina corrente
    const inizio = (paginaCorrente - 1) * preferitiPerPagina;
    const fine = inizio + preferitiPerPagina;

    const preferitiDaMostrare = filtri.slice(inizio, fine);

    // Mostra i preferiti della pagina corrente
    preferitiDaMostrare.forEach(filtro => {
        // Crea un nuovo contenitore verde per ogni preferito
        const preferitoContainer = document.createElement("div");
        preferitoContainer.classList.add("bg-dark-green", "w-full", "h-auto", "px-4", "py-4", "rounded-lg", "mb-4", "relative");  // Aggiunto "relative" per il posizionamento del pulsante
        preferitoContainer.dataset.idFiltro = filtro.id;

        // All'interno di questo contenitore verde, aggiungi il contenuto specifico
        preferitoContainer.innerHTML = `
            <div class="filter-info mb-4">
                <div class="info-item bg-white p-2 rounded-lg">
                    <span class="text-sm text-dark-green">${filtro.citta}</span>
                </div>
            </div>
            <div class="filter-details flex flex-wrap gap-4 mt-4 w-full"> 
                <div class="info-item bg-white p-2 rounded-lg flex-1 min-w-[150px]">
                    <span class="text-sm text-dark-green">${filtro.contratto}</span>
                </div>
                <div class="info-item bg-white p-2 rounded-lg flex-1 min-w-[150px]">
                    <span class="text-sm text-dark-green">${filtro.classeEnergetica}</span>
                </div>
                <div class="info-item bg-white p-2 rounded-lg flex-1 min-w-[150px]">
                    <span class="text-sm text-dark-green">${filtro.numLocali}</span>
                </div>
                <div class="info-item bg-white p-2 rounded-lg flex-1 min-w-[150px]">
                    <span class="text-sm text-dark-green">${filtro.prezzoMin}</span>
                </div>
                <div class="info-item bg-white p-2 rounded-lg flex-1 min-w-[150px]">
                    <span class="text-sm text-dark-green">${filtro.prezzoMax}</span>
                </div>
            </div>
        `;

        // Crea un contenitore esterno per il pulsante, fuori dal contenitore principale
        const deleteButtonContainer = document.createElement("div");
        deleteButtonContainer.classList.add("absolute", "top-0", "right-0", "mr-4", "mt-4");  // Posizionato fuori a destra

        // Aggiungi il pulsante di eliminazione al nuovo contenitore esterno
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn", "bg-light-green", "text-white", "w-12", "h-12", "rounded-md");
        deleteButton.setAttribute("onclick", `eliminaFiltro(${filtro.id})`);
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                <g clip-path="url(#clip0_27_595)">
                    <path d="M15 47.5C15 50.25 17.25 52.5 20 52.5H40C42.75 52.5 45 50.25 45 47.5V22.5C45 19.75 42.75 17.5 40 17.5H20C17.25 17.5 15 19.75 15 22.5V47.5ZM45 10H38.75L36.975 8.225C36.525 7.775 35.875 7.5 35.225 7.5H24.775C24.125 7.5 23.475 7.775 23.025 8.225L21.25 10H15C13.625 10 12.5 11.125 12.5 12.5C12.5 13.875 13.625 15 15 15H45C46.375 15 47.5 13.875 47.5 12.5C47.5 11.125 46.375 10 45 10Z" fill="#073B4C"/>
                </g>
                <defs>
                    <clipPath id="clip0_27_595">
                        <rect width="60" height="60" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        `;

        // Aggiungi il pulsante al contenitore del pulsante
        deleteButtonContainer.appendChild(deleteButton);

        // Aggiungi il pulsante esterno al contenitore principale del preferito
        preferitoContainer.appendChild(deleteButtonContainer);

        // Aggiungi il preferito container al contenitore principale
        container.appendChild(preferitoContainer);
    });

    aggiornaBottoniNavigazione();
}





function eliminaFiltro(id) {
    // Invia una richiesta al backend per eliminare il preferito con il dato id
    fetch(`/api/elimina-preferito/${id}`, {
        method: 'DELETE', // Metodo per eliminare
        headers: {
            'Content-Type': 'application/json', // Tipo di contenuto JSON
        },
    })
    .then(response => {
        if (response.ok) {
            // Se la risposta è positiva, rimuovi il contenitore del preferito dalla pagina
            const preferitoContainer = document.querySelector(`[data-id-filtro="${id}"]`);
            if (preferitoContainer) {
                preferitoContainer.remove();
            }
            // Mostra un messaggio di successo
            alert('Preferito eliminato con successo!');
        } else {
            // Se ci sono errori, mostra un messaggio di errore
            alert('Errore durante l\'eliminazione del preferito!');
        }
    })
    .catch(error => {
        // Gestisci gli errori della richiesta
        console.error('Errore nella richiesta di eliminazione:', error);
        alert('Errore durante la richiesta di eliminazione!');
    });
}



function aggiornaBottoniNavigazione() {
    let paginationDiv = document.getElementById("pagination");

    // Se il div non esiste ancora, crealo
    if (!paginationDiv) {
        paginationDiv = document.createElement("div");
        paginationDiv.id = "pagination";
        paginationDiv.classList.add("flex", "justify-center", "gap-4");
        paginationDiv.style.marginTop = "40px"; 

        document.getElementById("risultati").appendChild(paginationDiv);
    }

    if (risultatiGlobali.length === 0) {
        if (paginationDiv) paginationDiv.remove();
        return; // Esci dalla funzione, non generare nulla
    }

    paginationDiv.style.display = "flex";

    paginationDiv.innerHTML = `
        <button onclick="paginaPrecedente(); scrollToTop();" ${paginaCorrente === 1 ? "disabled" : ""} 
            class="w-12 h-12 flex items-center justify-center rounded-lg" 
            style="border: none; background: #073B4C; opacity: ${paginaCorrente === 1 ? '0.5' : '1'}; cursor: ${paginaCorrente === 1 ? 'default' : 'pointer'};">
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5833 22.9166H16.3125L26.4792 12.75C27.2917 11.9375 27.2917 10.6041 26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163L9.8125 23.5208C9 24.3333 9 25.6458 9.8125 26.4583L23.5417 40.1875C24.3542 41 25.6667 41 26.4792 40.1875C27.2917 39.375 27.2917 38.0416 26.4792 37.2291L16.3125 27.1042H39.5833C40.8542 27.1042 42.1042 25.8542 42.1042 24.5833C42.1042 23.3125 40.8542 22.9166 39.5833 22.9166Z" fill="white"/>
            </svg>
        </button>
        <button onclick="paginaSuccessiva(); scrollToTop();" ${paginaCorrente * preferitiPerPagina >= risultatiGlobali.length ? "disabled" : ""} 
            class="w-12 h-12 flex items-center justify-center rounded-lg" 
            style="border: none; background: #073B4C; opacity: ${paginaCorrente * preferitiPerPagina >= risultatiGlobali.length ? '0.5' : '1'}; cursor: ${paginaCorrente * preferitiPerPagina >= risultatiGlobali.length ? 'default' : 'pointer'};">
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4167 27.0833H33.6875L23.5208 37.2291C22.7083 38.0416 22.7083 39.375 23.5208 40.1875C24.3542 41 25.6667 41 26.4792 40.1875L40.2083 26.4583C41.0208 25.6458 41.0208 24.3333 40.2083 23.5208L26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163C22.7292 10.6041 22.7292 11.9375 23.5417 12.75L33.6875 22.9166H10.4167C9.14583 22.9166 7.89583 24.1666 7.89583 25.4375C7.89583 26.7083 9.14583 27.0833 10.4167 27.0833Z" fill="white"/>
            </svg>
        </button>
    `;
}

function paginaSuccessiva() {
    if (paginaCorrente * preferitiPerPagina < filtri.length) {
        paginaCorrente++;
        mostraPreferiti();
    }
}

function paginaPrecedente() {
    if (paginaCorrente > 1) {
        paginaCorrente--;
        mostraPreferiti();
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeLogin/HomeLogin.html";
});

