// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-container").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});

async function Registra() {
    const warningModal = document.getElementById("warningModal");
    const successModal = document.getElementById("successModal");
    const confirmWarningButton = document.getElementById("confirmWarningButton");
    const confirmSuccessButton = document.getElementById("confirmSuccessButton");
    const cancelButton = document.getElementById("cancelButton");

    let nomeAgenzia = document.getElementById("nomeAgenzia").value.trim();
    let partitaIVA = document.getElementById("partitaIVA").value.trim();
    let nomeAdmin = document.getElementById("nomeAdmin").value.trim();
    let cognomeAdmin = document.getElementById("cognomeAdmin").value.trim();
    let emailAdmin = document.getElementById("emailAdmin").value.trim();
    let erroreMessaggio = document.getElementById("erroreMessaggio");

    // Nasconde eventuali errori precedenti
    erroreMessaggio.style.display = "none";
    erroreMessaggio.innerText = "";

    // Controllo che tutti i campi siano compilati
    if (!nomeAgenzia || !partitaIVA || !nomeAdmin || !cognomeAdmin || !emailAdmin) {
        erroreMessaggio.innerText = "⚠ Tutti i campi sono obbligatori!";
        erroreMessaggio.style.display = "block";
        return;
    }

    if (!validaPartitaIVA(partitaIVA)){
        erroreMessaggio.innerText = "⚠ La partita IVA inserita non è valida";
        erroreMessaggio.style.display = "block";
        return;
    }

    // Dati da inviare al backend
    let dati = {
        nomeAgenzia,
        partitaIVA,
        nomeAdmin,
        cognomeAdmin,
        emailAdmin
    };

    try {
        let response = await fetch("https://80b7ead0-7ae9-493b-903f-9f9ae87bdada.mock.pstmn.io/RegistraAzienda", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dati)
        });

        let result = await response.json();

        if (response.ok) {
            // Mostra il modale di conferma
            warningModal.style.display = "flex";

            confirmWarningButton.addEventListener("click", function () {
                warningModal.style.display = "none";
                successModal.style.display = "flex";
            });

            cancelButton.addEventListener("click", function () {
                warningModal.style.display = "none";
            });

            confirmSuccessButton.addEventListener("click", function () {
                window.location.href = "../AreaAgenzia/AreaAgenzia.html";
            });

        } else if (response.status === 409) {
            erroreMessaggio.innerText = "⚠ " + result.message;
            erroreMessaggio.style.display = "block";
        } else {
            erroreMessaggio.innerText = "❌ Errore imprevisto. Riprova più tardi.";
            erroreMessaggio.style.display = "block";
        }
    } catch (error) {
        console.error("Errore di rete:", error);
        erroreMessaggio.innerText = "❌ Errore di connessione. Controlla la tua rete.";
        erroreMessaggio.style.display = "block";
    }
}

function validaPartitaIVA(piva) {
    // Rimuove eventuali spazi
    piva = piva.trim();

    // Controlla che sia lunga esattamente 11 caratteri numerici
    if (!/^\d{11}$/.test(piva)) {
        return false;
    }

    // Algoritmo di validazione della Partita IVA
    let somma = 0;
    for (let i = 0; i < 11; i++) {
        let cifra = parseInt(piva[i]);

        if (i % 2 === 0) { 
            // Posizioni dispari (0-based index), somma direttamente
            somma += cifra;
        } else {
            // Posizioni pari: moltiplica per 2, somma le cifre del risultato
            let doppio = cifra * 2;
            somma += doppio > 9 ? doppio - 9 : doppio;
        }
    }

    // La somma deve essere multipla di 10
    return somma % 10 === 0;
}

/* 
{
    "success": false,
    "message": "Questa Partita IVA è già registrata."
}
    {
  "message": "Registrazione avvenuta con successo!"
}
*/