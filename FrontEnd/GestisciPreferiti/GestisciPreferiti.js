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

    // Assicurati che "filtri" contenga i dati dal backend
    if (filtri.length > 0) {
        filtri.forEach(filtro => {
            // Crea un nuovo contenitore verde per ogni preferito
            const preferitoContainer = document.createElement("div");
            preferitoContainer.classList.add("bg-dark-green", "w-full", "h-auto", "px-4", "py-4", "rounded-lg", "mb-4", "relative");  // Aggiunto "relative" per il posizionamento del pulsante
            preferitoContainer.dataset.idFiltro = filtro.id;

            // All'interno di questo contenitore verde, aggiungi il contenuto specifico
            preferitoContainer.innerHTML = `
                <!-- Label del filtro in cima -->
                <div class="filter-info mb-4">
                    <div class="info-item bg-white p-2 rounded-lg">
                        <span class="text-sm text-dark-green">${filtro.label}</span>
                    </div>
                </div>

                <!-- Dettagli del filtro disposti orizzontalmente -->
                <div class="filter-details flex space-x-4 mt-4">
                    <div class="info-item bg-white p-2 rounded-lg">
                        <span class="text-sm text-dark-green">${filtro.info1}</span>
                    </div>
                    <div class="info-item bg-white p-2 rounded-lg">
                        <span class="text-sm text-dark-green">${filtro.info2}</span>
                    </div>
                    <div class="info-item bg-white p-2 rounded-lg">
                        <span class="text-sm text-dark-green">${filtro.info3}</span>
                    </div>
                    <div class="info-item bg-white p-2 rounded-lg">
                        <span class="text-sm text-dark-green">${filtro.info4}</span>
                    </div>
                    <div class="info-item bg-white p-2 rounded-lg">
                        <span class="text-sm text-dark-green">${filtro.info5}</span>
                    </div>
                </div>
            `;
            
            // Aggiungi il pulsante di eliminazione al di fuori del contenitore verde
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn", "bg-light-green", "text-white", "w-6", "h-6", "rounded-md", "absolute", "top-2", "right-2");
            deleteButton.setAttribute("onclick", `eliminaFiltro(${filtro.id})`);
            deleteButton.innerHTML = "X";

            // Aggiungi il pulsante di eliminazione al contenitore principale
            container.appendChild(deleteButton);

            // Aggiungi il preferito container al contenitore principale
            container.appendChild(preferitoContainer);
        });
    }
    aggiornaBottoniNavigazione();
}



// Funzione per eliminare il filtro dal backend
function eliminaFiltro(id) {
    // Implementa la logica per eliminare il filtro dal backend, ad esempio una chiamata API
    fetch(`/eliminaFiltro/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Rimuove l'elemento dal DOM se l'eliminazione è andata a buon fine
                const filtroDiv = document.querySelector(`[data-id-filtro="${id}"]`);
                if (filtroDiv) {
                    filtroDiv.remove();
                }
            } else {
                alert('Errore nell\'eliminazione del filtro.');
            }
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            alert('Errore nel server.');
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
    if (paginaCorrente * preferitiPerPagina < risultatiGlobali.length) {
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

