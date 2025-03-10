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

document.addEventListener("DOMContentLoaded", async function () {
    const idAnnuncio = sessionStorage.getItem("idAnnuncio");
    if (!idAnnuncio) {
        alert("Errore: nessun annuncio selezionato.");
        window.location.href = "../HomeAdmin/HomeAdmin.html";
        return;
    }

    try {
        const response = await fetch(`https://80b7ead0-7ae9-493b-903f-9f9ae87bdada.mock.pstmn.io/Annuncio`);

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const annuncio = await response.json();

        document.getElementById("annuncio-prezzo").textContent = `€ ${annuncio.prezzo.toLocaleString()}`;
        document.getElementById("annuncio-titolo").textContent = `In ${annuncio.contratto} in ${annuncio.indirizzo}, ${annuncio.citta}, ${annuncio.comune}`;
        document.getElementById("annuncio-descrizione").textContent = annuncio.descrizione;
        document.getElementById("piano").textContent = annuncio.piano;
        document.getElementById("totale-piani").textContent = annuncio.totalePiani;
        document.getElementById("superficie").textContent = `${annuncio.superficie} m²`;
        document.getElementById("stanze").textContent = annuncio.numeroStanze;
        document.getElementById("classe-energetica").textContent = annuncio.classeEnergetica;
        document.getElementById("arredamento").textContent = annuncio.arredamento;
        document.getElementById("riscaldamento").textContent = annuncio.riscaldamento;
        document.getElementById("stato-immobile").textContent = annuncio.stato;
        document.getElementById("ascensore").textContent = annuncio.ascensore ? "Sì" : "No";

        // Salviamo le coordinate per usarle nella mappa
        latitudineAnnuncio = annuncio.latitudine;
        longitudineAnnuncio = annuncio.longitudine;

        let imgIndex = 0;
        const imgElement = document.getElementById("annuncio-img");
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");

        const images = (annuncio.foto && annuncio.foto.length > 0) 
            ? annuncio.foto 
            : ["https://github.com/Alessia1903/DietiEstates2025/blob/master/Photos/LenteObl-removebg-preview.png?raw=true"];

        imgElement.src = images[imgIndex];

        function aggiornaBottoni() {
            prevBtn.disabled = imgIndex === 0;
            nextBtn.disabled = imgIndex === images.length - 1;

            prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
            nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";

            prevBtn.style.cursor = prevBtn.disabled ? "default" : "pointer";
            nextBtn.style.cursor = nextBtn.disabled ? "default" : "pointer";
        }

        function cambiaImmagine(direction) {
            if (images.length > 1) {
                imgIndex = (imgIndex + direction + images.length) % images.length;
                imgElement.src = images[imgIndex];
            }
            aggiornaBottoni();
        }

        // Aggiungi event listeners ai bottoni
        prevBtn.addEventListener("click", () => cambiaImmagine(-1));
        nextBtn.addEventListener("click", () => cambiaImmagine(1));

        aggiornaBottoni();

    } catch (error) {
        console.error("Errore nel caricamento dell'annuncio:", error);
        alert(`Errore nel caricamento dell'annuncio: ${error.message}`);
    }
});

let mappa = null; // Variabile globale per la mappa

function mostraMappa() {
    if (!latitudineAnnuncio || !longitudineAnnuncio) {
        alert("Coordinate non disponibili per questo annuncio.");
        return;
    }

    // Mostriamo il modal della mappa
    document.getElementById("mappaModal").style.display = "flex";

    // Se la mappa non è stata inizializzata, la creiamo
    if (!mappa) {
        mappa = L.map("mappa").setView([latitudineAnnuncio, longitudineAnnuncio], 15); // Centro sulla posizione

        // Aggiungiamo il layer di OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mappa);
    } else {
        // Se la mappa esiste già, la riposizioniamo
        mappa.setView([latitudineAnnuncio, longitudineAnnuncio], 15);
    }

    // Rimuoviamo eventuali marker esistenti
    mappa.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            mappa.removeLayer(layer);
        }
    });

    // Aggiungiamo un nuovo marker per l'annuncio
    L.marker([latitudineAnnuncio, longitudineAnnuncio])
        .addTo(mappa)
        .bindPopup("Siamo qui!").openPopup();
}

// Funzione per chiudere la mappa
function chiudiMappa() {
    document.getElementById("mappaModal").style.display = "none";
}