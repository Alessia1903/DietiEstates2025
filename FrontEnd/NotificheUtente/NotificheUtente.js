let paginaCorrente = 1;
const notifichePerPagina = 5;
let risultatiGlobali = []; // Salviamo tutte le notifiche

document.addEventListener("DOMContentLoaded", async () => {
    
    const token = "Bearer abc123xyz456token789"; // Assegna un valore fittizio al token per il test
    //const token = localStorage.getItem("token"); // Recupera il token salvato
  
    if (!token) {
      alert("Accesso non autorizzato. Effettua il login.");
      window.location.href = "../AreaUtente/AreaUtente.html"; // Torna alla pagina di login
      return;
    }
  
    try {
      const response = await fetch("https://cd5480b0-66c3-4d3f-8864-98af937fa5de.mock.pstmn.io/login", {
        method: "GET",
        headers: {
          "Authorization": token, // Invia il token per l'autenticazione
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Errore nel recupero delle notifiche");
      }

      risultatiGlobali = await response.json();

        if (risultatiGlobali.length === 0) {
            return;
        }
        
        aggiornaPaginazione(); // Mostra i primi risultati  
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un problema nel caricamento deglle notifiche.");
    }
});

function aggiornaPaginazione() {
    paginaCorrente = 1; // Resetta alla prima pagina quando carichiamo nuovi dati
    mostraNotifiche();
}

function mostraNotifiche() {
    const container = document.getElementById("risultati");
    container.innerHTML = ""; // Pulisce i vecchi risultati
    container.classList.add("flex", "flex-wrap", "justify-between", "gap-4");

    const inizio = (paginaCorrente - 1) * notifichePerPagina;
    const fine = inizio + notifichePerPagina;
    const notificheDaMostrare = risultatiGlobali.slice(inizio, fine);

    if (notificheDaMostrare.length === 0) {
        return;
    }

    notificheDaMostrare.forEach(notifica => {
        const descrizioneCorta = notifica.descrizione.length > 200 
            ? notifica.descrizione.substring(0, 200) + "..." 
            : notifica.descrizione;

        const div = document.createElement("div");
        div.classList.add("notifica");
        div.dataset.idNotifica = notifica.idNotifica;

        const icona = getIcona(notifica.messaggio);

        div.innerHTML = `
            <div class="notification-icon">
                ${icona}
            </div>
            <div class="notification-info">
                <h3 class="notification-title">${notifica.messaggio}</h3>
                <p class="notification-description">${descrizioneCorta}</p>
            </div>
        `;

        div.addEventListener("click", () => {
            sessionStorage.setItem("idNotifica", notifica.idNotifica); 
            window.location.href = "../AnnuncioLog/AnnuncioLog.html";
        });

        container.appendChild(div);
    });
    aggiornaBottoniNavigazione();
}
 
function getIcona(messaggio) {
    switch (messaggio) {
        case "Nuovo annuncio in linea con le tue preferenze":
            return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 120 120" fill="none">
                <path d="M50 95V70h20v25c0 2.75 2.25 5 5 5h15c2.75 0 5-2.25 5-5V60h8.5c2.3 0 3.4-2.85 1.65-4.35L63.35 18c-1.9-1.7-4.8-1.7-6.7 0L14.85 55.65C13.15 57.15 14.2 60 16.5 60H25v35c0 2.75 2.25 5 5 5h15c2.75 0 5-2.25 5-5z" fill="#073B4C"/>
            </svg>`;
        case "La tua richiesta di visita è stata accettata":
            return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 120 120" fill="none">
                <path d="M80 65H65c-2.75 0-5 2.25-5 5v15c0 2.75 2.25 5 5 5h15c2.75 0 5-2.25 5-5V70c0-2.75-2.25-5-5-5zm0-50v5H40v-5c0-2.75-2.25-5-5-5s-5 2.25-5 5v5h-5c-5.55 0-10 4.5-10 10v70c0 5.5 4.45 10 10 10h70c5.5 0 10-4.5 10-10V30c0-5.5-4.5-10-10-10h-5v-5c0-2.75-2.25-5-5-5s-5 2.25-5 5zm10 85H30c-2.75 0-5-2.25-5-5V45h70v50c0 2.75-2.25 5-5 5z" fill="#073B4C"/>
            </svg>`;
        case "La tua richiesta di visita non è stata accettata":
            return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 120 120" fill="none">
                <path d="M60 10C32.35 10 10 32.35 10 60c0 27.65 22.35 50 50 50s50-22.35 50-50c0-27.65-22.35-50-50-50zM81.5 81.5c-1.95 1.95-5.1 1.95-7.05 0L60 67.05 45.55 81.5c-1.95 1.95-5.1 1.95-7.05 0-1.95-1.95-1.95-5.1 0-7.05L52.95 60 38.5 45.55c-1.95-1.95-1.95-5.1 0-7.05 1.95-1.95 5.1-1.95 7.05 0L60 52.95 74.45 38.5c1.95-1.95 5.1-1.95 7.05 0 1.95 1.95 1.95 5.1 0 7.05L67.05 60l14.45 14.45c1.9 1.9 1.9 5.1 0 7.05z" fill="#073B4C"/>
            </svg>`;
        default:
            return "";
    }
    
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
        <button onclick="paginaSuccessiva(); scrollToTop();" ${paginaCorrente * notifichePerPagina >= risultatiGlobali.length ? "disabled" : ""} 
            class="w-12 h-12 flex items-center justify-center rounded-lg" 
            style="border: none; background: #073B4C; opacity: ${paginaCorrente * notifichePerPagina >= risultatiGlobali.length ? '0.5' : '1'}; cursor: ${paginaCorrente * notifichePerPagina >= risultatiGlobali.length ? 'default' : 'pointer'};">
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4167 27.0833H33.6875L23.5208 37.2291C22.7083 38.0416 22.7083 39.375 23.5208 40.1875C24.3542 41 25.6667 41 26.4792 40.1875L40.2083 26.4583C41.0208 25.6458 41.0208 24.3333 40.2083 23.5208L26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163C22.7292 10.6041 22.7292 11.9375 23.5417 12.75L33.6875 22.9166H10.4167C9.14583 22.9166 7.89583 24.1666 7.89583 25.4375C7.89583 26.7083 9.14583 27.0833 10.4167 27.0833Z" fill="white"/>
            </svg>
        </button>
    `;
}

function paginaSuccessiva() {
    if (paginaCorrente * notifichePerPagina < risultatiGlobali.length) {
        paginaCorrente++;
        mostraNotifiche();
    }
}

function paginaPrecedente() {
    if (paginaCorrente > 1) {
        paginaCorrente--;
        mostraNotifiche();
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeLogin/HomeLogin.html";
});

function apriGestisciPreferiti() {
    window.location.href = "../AreaUtente/LoginUtente.html";
}