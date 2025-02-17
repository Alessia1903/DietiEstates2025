// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
const clickableElements = document.querySelectorAll('.custom-text-color, img');
clickableElements.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
        window.location.href = 'HomeNoLogin.html';
    });
});

function cerca() {
    const cittaInput = document.getElementById("citta");
    
    if (!cittaInput.value.trim()) {
        // Cambia il colore del placeholder a rosso
        cittaInput.classList.add("input-error");
        cittaInput.placeholder = "Inserire un comune o una città"; // Messaggio di errore
        return;
    } else {
        // Ripristina lo stato normale
        cittaInput.classList.remove("input-error");
        cittaInput.placeholder = "Cerca un Comune o una Città";  // Ripristina il placeholder originale
    }

    // Recupera i valori
    const citta = cittaInput.value.trim();
    const contratto = document.getElementById("contratto").value;
    const classeEnergetica = document.getElementById("classeEnergetica").value;
    const numLocali = document.getElementById("numLocali").value || "";
    const prezzoMin = document.getElementById("prezzoMin").value || "";
    const prezzoMax = document.getElementById("prezzoMax").value || "";

    // Costruisce l'URL con i parametri di ricerca
    const params = new URLSearchParams({
        citta: citta,
        contratto: contratto,
        classeEnergetica: classeEnergetica,
        numLocali: numLocali,
        prezzoMin: prezzoMin,
        prezzoMax: prezzoMax
    });

    // Naviga alla pagina dei risultati nella stessa scheda
    window.location.href = `results.html?${params.toString()}`;
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
