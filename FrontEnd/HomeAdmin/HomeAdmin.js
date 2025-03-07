// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeAdmin/HomeAdmin.html";
});

document.addEventListener("DOMContentLoaded", function () {
    const targetPages = { 
        collaboratore: "../AggiungiDipendentiCollaboratore/AggiungiDipendentiCollaboratore.html",
        admin: "../AggiungiDipendentiAdmin/AggiungiDipendentiAdmin.html"
    };

    const userRole = localStorage.getItem("role"); // Recupera il ruolo dell'utente
    const targetPage = targetPages[userRole] || "../HomeNoLogin/HomeNoLogin.html"; // Imposta la destinazione

    // Imposta il link in base al ruolo dell'utente
    document.getElementById("dipendenti-link").addEventListener("click", function () {
        window.location.href = targetPage;
    });
});

let paginaCorrente = 1;
const annunciPerPagina = 10;
let risultatiGlobali = []; // Salviamo tutti gli annunci

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token"); // Recupera il token salvato
  
    if (!token) {
      alert("Accesso non autorizzato. Effettua il login.");
      window.location.href = "../AreaAgenzia/AreaAgenzia.html"; // Torna alla pagina di login
      return;
    }
  
    try {
      const response = await fetch("https://2fa95eb8-6532-48cf-86fc-bd61b88e3eb0.mock.pstmn.io/annunci?", {
        method: "GET",
        headers: {
          "Authorization": token, // Invia il token per l'autenticazione
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Errore nel recupero degli annunci");
      }

      risultatiGlobali = await response.json();

        if (risultatiGlobali.length === 0) {
            return;
        }
        
        aggiornaPaginazione(); // Mostra i primi risultati  
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un problema nel caricamento degli annunci.");
    }
});

function aggiornaPaginazione() {
    paginaCorrente = 1; // Resetta alla prima pagina quando carichiamo nuovi dati
    mostraAnnunci();
}

function mostraAnnunci() {
    const container = document.getElementById("risultati");
    container.innerHTML = ""; // Pulisce i vecchi risultati
    container.classList.add("flex", "flex-wrap", "justify-between", "gap-4");

    // Calcola gli indici per la paginazione
    const inizio = (paginaCorrente - 1) * annunciPerPagina;
    const fine = inizio + annunciPerPagina;
    const annunciDaMostrare = risultatiGlobali.slice(inizio, fine);

    // Se non ci sono più annunci, non fare nulla
    if (annunciDaMostrare.length === 0) {
        return;
    }

    // Popola la pagina con gli annunci della pagina corrente
    annunciDaMostrare.forEach(immobile => {
        const descrizioneCorta = immobile.descrizione.length > 200 
            ? immobile.descrizione.substring(0, 200) + "..." 
            : immobile.descrizione;

        const div = document.createElement("div");
        div.classList.add("annuncio");
        div.dataset.idAnnuncio = immobile.idAnnuncio;

        div.innerHTML = `
            <img src="${immobile.immagine || 'https://via.placeholder.com/100'}" alt="Immobile">
            <div class="info">
                <div class="top-info">
                    <p class="prezzo">€ ${immobile.prezzo}</p>
                    <p class="dettagli"><strong>${immobile.stanze}</strong> locali - <strong>${immobile.superficie} m²</strong></p>
                </div>
                <h3>In ${immobile.contratto} in ${immobile.indirizzo}, ${immobile.citta}, ${immobile.comune}</h3>
                <p class="descrizione">${descrizioneCorta}</p>
            </div>
        `;

        div.addEventListener("click", () => {
            sessionStorage.setItem("idAnnuncio", immobile.idAnnuncio); 
            window.location.href = "../AnnuncioAdmin/AnnuncioAdmin.html";
        });

        container.appendChild(div);
    });

    aggiornaBottoniNavigazione();
}

function aggiornaBottoniNavigazione() {
    const container = document.getElementById("risultati");
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
                <g clip-path="url(#clip0_11_145)">
                    <path d="M39.5833 22.9166H16.3125L26.4792 12.75C27.2917 11.9375 27.2917 10.6041 26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163L9.8125 23.5208C9 24.3333 9 25.6458 9.8125 26.4583L23.5417 40.1875C24.3542 41 25.6667 41 26.4792 40.1875C27.2917 39.375 27.2917 38.0625 26.4792 37.25L16.3125 27.0833H39.5833C40.7292 27.0833 41.6667 26.1458 41.6667 25C41.6667 23.8541 40.7292 22.9166 39.5833 22.9166Z" fill="white"/>
                </g>
                <defs>
                    <clipPath id="clip0_11_145">
                        <rect width="50" height="50" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </button>

        <button onclick="paginaSuccessiva(); scrollToTop();" ${paginaCorrente * annunciPerPagina >= risultatiGlobali.length ? "disabled" : ""} 
            class="w-12 h-12 flex items-center justify-center rounded-lg" 
            style="border: none; background: #073B4C; opacity: ${paginaCorrente * annunciPerPagina >= risultatiGlobali.length ? '0.5' : '1'}; cursor: ${paginaCorrente * annunciPerPagina >= risultatiGlobali.length ? 'default' : 'pointer'};">
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_11_141)">
                    <path d="M10.4166 27.0833H33.6874L23.5208 37.25C22.7083 38.0625 22.7083 39.3958 23.5208 40.2083C24.3333 41.0208 25.6458 41.0208 26.4583 40.2083L40.1874 26.4791C40.9999 25.6666 40.9999 24.3541 40.1874 23.5416L26.4791 9.79163C25.6666 8.97913 24.3541 8.97913 23.5416 9.79163C22.7291 10.6041 22.7291 11.9166 23.5416 12.7291L33.6874 22.9166H10.4166C9.27075 22.9166 8.33325 23.8541 8.33325 25C8.33325 26.1458 9.27075 27.0833 10.4166 27.0833Z" fill="white"/>
                </g>
                <defs>
                    <clipPath id="clip0_11_141">
                        <rect width="50" height="50" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </button>
    `;
}

function paginaPrecedente() {
    if (paginaCorrente > 1) {
        paginaCorrente--;
        mostraAnnunci();
    }
}

function paginaSuccessiva() {
    if (paginaCorrente * annunciPerPagina < risultatiGlobali.length) {
        paginaCorrente++;
        mostraAnnunci();
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
