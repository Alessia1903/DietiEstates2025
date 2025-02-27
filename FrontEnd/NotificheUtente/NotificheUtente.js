let paginaCorrente = 1;
const notifichePerPagina = 5; // Numero di notifiche per pagina
let notificheGlobali = []; // Salviamo tutte le notifiche

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Esempio di notifiche (puoi sostituirle con i tuoi dati)
        notificheGlobali = [
            { id: 1, descrizione: "Nuovo messaggio da Giovanni!", icona: "📩" },
            { id: 2, descrizione: "Offerta speciale per il tuo abbonamento!", icona: "🎉" },
            { id: 3, descrizione: "Il tuo ordine è stato spedito.", icona: "🚚" },
            { id: 4, descrizione: "Nuovo commento sul tuo post.", icona: "💬" },
            { id: 5, descrizione: "Il tuo pagamento è stato confermato.", icona: "💳" },
            { id: 6, descrizione: "Hai ricevuto una richiesta di amicizia.", icona: "👥" },
            { id: 7, descrizione: "Aggiornamenti disponibili per l'app.", icona: "🔧" },
            { id: 8, descrizione: "Promozione valida solo per oggi!", icona: "🔥" }
        ];

        if (notificheGlobali.length === 0) {
            return;
        }

        aggiornaPaginazione(); // Mostra le prime notifiche
    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un problema nel caricamento delle notifiche.");
    }
});

function aggiornaPaginazione() {
    paginaCorrente = 1; // Resetta alla prima pagina quando carichiamo nuovi dati
    mostraNotifiche();
}

function mostraNotifiche() {
    const container = document.getElementById("risultati");
    container.innerHTML = ""; // Pulisce le notifiche precedenti
    container.classList.add("flex", "flex-wrap", "justify-between", "gap-4");

    // Calcola gli indici per la paginazione
    const inizio = (paginaCorrente - 1) * notifichePerPagina;
    const fine = inizio + notifichePerPagina;
    const notificheDaMostrare = notificheGlobali.slice(inizio, fine);

    // Se non ci sono più notifiche, non fare nulla
    if (notificheDaMostrare.length === 0) {
        return;
    }

    // Popola la pagina con le notifiche della pagina corrente
    notificheDaMostrare.forEach(notifica => {
        const div = document.createElement("div");
        div.classList.add("notifica");
        div.dataset.idNotifica = notifica.id;

        div.innerHTML = `
            <div class="icona" style="font-size: 24px;">${notifica.icona}</div>
            <div class="descrizione" style="flex-grow: 1; padding-left: 10px;">
                <p>${notifica.descrizione}</p>
            </div>
        `;

        container.appendChild(div);
    });

    aggiornaBottoniNavigazione();
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

    if (notificheGlobali.length === 0) {
        if (paginationDiv) paginationDiv.remove();
        return; // Esci dalla funzione, non generare nulla
    } 

    paginationDiv.style.display = "flex";

    paginationDiv.innerHTML = `
        <button onclick="paginaPrecedente(); scrollToTop();" ${paginaCorrente === 1 ? "disabled" : ""} 
            class="w-12 h-12 flex items-center justify-center rounded-lg" 
            style="border: none; background: #073B4C; opacity: ${paginaCorrente === 1 ? '0.5' : '1'}; cursor: ${paginaCorrente === 1 ? 'default' : 'pointer'};">
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5833 22.9166H16.3125L26.4792 12.75C27.2917 11.9375 27.2917 10.6041 26.4792 9.79163C25.6667 8.97913 24.3542 8.97913 23.5417 9.79163L9.8125 23.5208C9 24.3333 9 25.6458 9.8125 26.4583L23.5417 40.1875C24.3542 41 25.6667 41 26.4792 40.1875C27.2917 39.375 27.2917 38.0625 26.4792 37.25L16.3125 27.0833H39.5833C40.7292 27.0833 41.6667 26.1458 41.6667 25C41.6667 23.8541 40.7292 22.9166 39.5833 22.9166Z" fill="white"/>
            </svg>
        </button>

        <button onclick="paginaSuccessiva(); scrollToTop();" ${paginaCorrente * notifichePerPagina >= notificheGlobali.length ? "disabled" : ""} 
            class="w-12 h-12 flex items-center justify-center rounded-lg" 
            style="border: none; background: #073B4C; opacity: ${paginaCorrente * notifichePerPagina >= notificheGlobali.length ? '0.5' : '1'}; cursor: ${paginaCorrente * notifichePerPagina >= notificheGlobali.length ? 'default' : 'pointer'};">
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4166 27.0833H33.6874L23.5208 37.25C22.7083 38.0625 22.7083 39.3958 23.5208 40.2083C24.3333 41.0208 25.6458 41.0208 26.4583 40.2083L40.1874 26.4791C40.9999 25.6666 40.9999 24.3541 40.1874 23.5416L26.4791 9.79163C25.6666 8.97913 24.3541 8.97913 23.5416 9.79163C22.7291 10.6041 22.7291 11.9166 23.5416 12.7291L33.6874 22.9166H10.4166C9.27075 22.9166 8.33325 23.8541 8.33325 25C8.33325 26.1458 9.27075 27.0833 10.4166 27.0833Z" fill="white"/>
            </svg>
        </button>
    `;
}

function paginaPrecedente() {
    if (paginaCorrente > 1) {
        paginaCorrente--;
        mostraNotifiche();
    }
}

function paginaSuccessiva() {
    if (paginaCorrente * notifichePerPagina < notificheGlobali.length) {
        paginaCorrente++;
        mostraNotifiche();
    }
}

function scrollToTop() {
    window.scrollTo(0, 0);
}
