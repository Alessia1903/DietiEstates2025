document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const nomeInput = document.getElementById("nome");
    const cognomeInput = document.getElementById("cognome");
    const errorMessage = document.getElementById("error-message");

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

        // Invio richiesta al backend
        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, cognome })
            });

            const result = await response.json();

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

