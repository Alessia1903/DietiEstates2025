// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-container").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});

async function Registra() {
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
            window.location.href = "../AccediUtente/AccediUtente.html";
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
/* 
{
    "success": false,
    "message": "Questa Partita IVA è già registrata."
}
*/