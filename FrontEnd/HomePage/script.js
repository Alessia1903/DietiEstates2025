function cerca() {
    window.location.href = 'risultati.html';
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
numLocali.addEventListener("input", function() {
    if (numLocali.value < 0) {
        numLocali.value = 0;
    }
});

// Controllo per Prezzo Minimo (impedisce valori negativi)
prezzoMin.addEventListener("input", function() {
    if (prezzoMin.value < 0) {
        prezzoMin.value = 0;
    }
});

// Controllo per Prezzo Massimo (impedisce valori negativi)
prezzoMax.addEventListener("input", function() {
    if (prezzoMax.value < 0) {
        prezzoMax.value = 0;
    }
});


