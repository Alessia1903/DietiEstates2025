// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeLogin/HomeLogin.html";
});

async function cerca() {
    const cittaInput = document.getElementById("citta");

    if (!cittaInput.value.trim()) {
        // Cambia il colore del placeholder a rosso
        cittaInput.classList.add("input-error");
        cittaInput.placeholder = "Inserire un comune o una città"; // Messaggio di errore
        return;
    } else {
        // Ripristina lo stato normale
        cittaInput.classList.remove("input-error");
        cittaInput.placeholder = "Cerca un Comune o una Città"; // Ripristina il placeholder originale
    }

    // Recupera i valori
    const citta = cittaInput.value.trim();
    const contratto = document.getElementById("contratto").value;
    const classeEnergetica = document.getElementById("classeEnergetica").value;
    const numLocali = document.getElementById("numLocali").value || "";
    const prezzoMin = document.getElementById("prezzoMin").value || "";
    const prezzoMax = document.getElementById("prezzoMax").value || "";

    // Recupera il token dal localStorage
    const token = localStorage.getItem("token");
    
    // Crea l'oggetto con i dati da inviare al backend
    const searchParams = {
        citta,
        contratto,
        classeEnergetica,
        numLocali,
        prezzoMin,
        prezzoMax
    };

    try {
        // Li salvo nel backend per la cronologia
        const response = await fetch("https://80b7ead0-7ae9-493b-903f-9f9ae87bdada.mock.pstmn.io/Risposta2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Invia il token nell'header
            },
            body: JSON.stringify(searchParams)
        });

        if (!response.ok) {
            throw new Error("Errore nella richiesta al server");
        }

        // Salva i parametri di ricerca nella sessionStorage
        sessionStorage.setItem("citta", citta);
        sessionStorage.setItem("contratto", contratto);
        sessionStorage.setItem("classeEnergetica", classeEnergetica);
        sessionStorage.setItem("numLocali", numLocali);
        sessionStorage.setItem("prezzoMin", prezzoMin);
        sessionStorage.setItem("prezzoMax", prezzoMax);

        // Reindirizza alla pagina dei risultati
        window.location.href = "../RisultatiLogin/RisultatiLogin.html";
    } catch (error) {
        console.error("Errore:", error.message);
        alert("Errore durante la ricerca. Riprova.");
    }
}

// Seleziona gli elementi
const numLocali = document.getElementById("numLocali");
const prezzoMin = document.getElementById("prezzoMin");
const prezzoMax = document.getElementById("prezzoMax");

// Imposta i valori minimi
numLocali.min = 0;
prezzoMin.min = 0;
prezzoMax.min = 0;

// Controllo per Num di Locali (impedisce valori negativi)
numLocali.addEventListener("input", () => {
    if (numLocali.value < 0) numLocali.value = 0;
});

// Controllo per Prezzo Minimo (impedisce valori negativi e aggiorna prezzo massimo se necessario)
prezzoMin.addEventListener("input", () => {
    let min = parseInt(prezzoMin.value) || 0;
    if (min < 0) prezzoMin.value = 0;
    sincronizzaMax();
});

// Controllo per Prezzo Massimo (impedisce valori negativi e aggiorna dinamicamente)
prezzoMax.addEventListener("input", () => {
    let max = parseInt(prezzoMax.value) || 0;
    if (max < 0) prezzoMax.value = 0;
    sincronizzaMin();
});

// Funzione per mantenere coerenti i prezzi
function sincronizzaMax() {
    let min = parseInt(prezzoMin.value) || 0;
    let max = parseInt(prezzoMax.value) || 0;

    if (max <= min) {
        prezzoMax.value = min + 10000;
    }
}

function sincronizzaMin() {
    let min = parseInt(prezzoMin.value) || 0;
    let max = parseInt(prezzoMax.value) || 0;

    if (max <= min) {
        prezzoMin.value = (max - 10000>0) ? max - 10000 : 0;
    }
}