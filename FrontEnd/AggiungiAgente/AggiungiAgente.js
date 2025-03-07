// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeAdmin/HomeAdmin.html";
});

async function Registra() {
    const warningModal = document.getElementById("warningModal");
    const successModal = document.getElementById("successModal");
    const confirmWarningButton = document.getElementById("confirmWarningButton");
    const confirmSuccessButton = document.getElementById("confirmSuccessButton");
    const cancelButton = document.getElementById("cancelButton");

    let nomeAg = document.getElementById("nomeAg").value.trim();
    let cognomeAg = document.getElementById("cognomeAg").value.trim();
    let emailAg = document.getElementById("emailAg").value.trim();
    let erroreMessaggio = document.getElementById("erroreMessaggio");

    // Nasconde eventuali errori precedenti
    erroreMessaggio.style.display = "none";
    erroreMessaggio.innerText = "";

    // Controllo che tutti i campi siano compilati
    if (!nomeAg || !cognomeAg || !emailAg) {
        erroreMessaggio.innerText = "⚠ Tutti i campi sono obbligatori!";
        erroreMessaggio.style.display = "block";
        return;
    }

    // Dati da inviare al backend
    let dati = {
        nomeAg,
        cognomeAg,
        emailAg
    };

    try {
        let response = await fetch("https://cd5480b0-66c3-4d3f-8864-98af937fa5de.mock.pstmn.io/login", {
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
                window.location.href = "../HomeAdmin/HomeAdmin.html";
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