let paginaCorrente = 1;
const preferitiPerPagina = 5;
let risultatiGlobali = []; // Salviamo tutti i preferiti
let filtri = []; // Dati per i filtri

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token"); // Recupera il token salvato

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

    const inizio = (paginaCorrente - 1) * preferitiPerPagina;
    const fine = inizio + preferitiPerPagina;
    const preferitiDaMostrare = filtri.slice(inizio, fine);

    preferitiDaMostrare.forEach(filtro => {
        const rowWrapper = document.createElement("div");
        rowWrapper.classList.add("flex", "items-center", "w-full", "mb-4");

        const preferitoContainer = document.createElement("div");
        preferitoContainer.classList.add("bg-dark-blue", "p-4", "rounded-lg", "flex-1");
        preferitoContainer.setAttribute("data-id-filtro", filtro.id); // FIX

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

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("bg-light-green", "p-3", "rounded-lg", "ml-4");
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.71 3.29C14.53 3.11 14.28 3 14 3H10C9.72 3 9.47 3.11 9.29 3.29L8.5 4H5C4.45 4 4 4.45 4 5C4 5.55 4.45 6 5 6H19C19.55 6 20 5.55 20 5C20 4.45 19.55 4 19 4Z" fill="#073B4C"/>
            </svg>
        `;
        deleteButton.addEventListener("click", () => eliminaFiltro(filtro.id)); 

        rowWrapper.appendChild(preferitoContainer);
        rowWrapper.appendChild(deleteButton);
        container.appendChild(rowWrapper);
    });

    aggiornaBottoniNavigazione();
}



function eliminaFiltro(id) {
    const warningModal = document.getElementById("warningModal");
    const confirmWarningButton = document.getElementById("confirmWarningButton");
    const cancelButton = document.getElementById("cancelButton");

    // Mostra il modale di conferma
    warningModal.style.display = "flex";
    confirmWarningButton.addEventListener("click", function () {
        warningModal.style.display = "none";
        try{
            fetch(`https://cd5480b0-66c3-4d3f-8864-98af937fa5de.mock.pstmn.io/impostazioni/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    warningModal.style.display = "none";
                } else {
                    alert('Errore durante l\'eliminazione del preferito!');
                }
            })
        }catch(error){
            console.error('Errore nella richiesta di eliminazione:', error);
            alert('Errore durante la richiesta di eliminazione!');
        };
        
    });

    cancelButton.addEventListener("click", function () {
        warningModal.style.display = "none";
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

