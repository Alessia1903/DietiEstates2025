document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const nomeInput = document.getElementById("nome");
    const cognomeInput = document.getElementById("cognome");
    const errorMessage = document.getElementById("error-message");
    const successModal = document.getElementById("successModal");
    const confirmSuccessButton = document.getElementById("confirmSuccessButton");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const cognome = cognomeInput.value.trim();

        // Verifica che i campi non siano vuoti
        if (nome === "" || cognome === "") {
            errorMessage.textContent = "Nome e Cognome sono obbligatori.";
            errorMessage.classList.remove("hidden");
            return;
        }

        // Simulazione della risposta senza backend
        /*setTimeout(() => {
            const result = { status: "success", message: "Registrazione completata" };

            if (result.status === "success") {
            successModal.style.display = "flex";
            } else {
                errorMessage.textContent = result.message;
                errorMessage.classList.remove("hidden");
            }
        }); */

        // Invio richiesta al backend
        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, cognome })
            });

            const result = await response.json();

            // Mostra il modale di conferma
            if (response.ok) {
                successModal.style.display = "flex";
            } else if (response.status === 409) {
                erroreMessaggio.innerText = "⚠ " + result.message;
                erroreMessaggio.style.display = "block";
            } else {
                erroreMessaggio.innerText = "❌ Errore imprevisto. Riprova più tardi.";
                erroreMessaggio.style.display = "block";
            }

            if (result.status === "error") {
                errorMessage.textContent = result.message;
                errorMessage.classList.remove("hidden");
            } else {
                errorMessage.classList.add("hidden");
                window.location.href = "Dashboard.html";
            }
            
        } catch (error) {
            console.error("Errore di connessione:", error);
            errorMessage.textContent = "Errore di connessione. Riprova.";
            errorMessage.classList.remove("hidden");
        }
    });

    // **Aggiunta della funzione per il pulsante PROSEGUI**
    confirmSuccessButton.addEventListener("click", function () {
        window.location.href = "../HomeNoLogin/HomeNoLogin.html"; // Assicurati che il percorso sia corretto
    });

    // Gestione accesso con Google
    /* window.handleCredentialResponse = function (response) {
        console.log("Google Credential Response:", response);
        window.location.href = "Dashboard.html";
    }; */

    // Rendi cliccabile il logo per tornare alla homepage
    document.getElementById("logo-container").addEventListener("click", function () {
        window.location.href = "../HomeNoLogin/HomeNoLogin.html";
    });
});



