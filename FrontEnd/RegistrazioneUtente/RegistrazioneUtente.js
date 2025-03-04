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
        const email = localStorage.getItem("newUserEmail");
        const password = localStorage.getItem("newUserPassword");

        // Verifica che i campi non siano vuoti
        if (nome === "" || cognome === "") {
            errorMessage.textContent = "Nome e Cognome sono obbligatori.";
            errorMessage.classList.remove("hidden");
            return;
        }

        const userData = {
            email: email,
            password: password,
            nome: nome,
            cognome: cognome
        };
        
        // Invio richiesta al backend
        try {
            const response = await fetch("https://80b7ead0-7ae9-493b-903f-9f9ae87bdada.mock.pstmn.io/Risposta1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                errorMessage.classList.add("hidden");

                localStorage.setItem("token", result.token);

                successModal.style.display = "flex";

                confirmSuccessButton.addEventListener("click", function () {
                    window.location.href = "../HomeLogin/HomeLogin.html";
                });
            } else if (response.status === 409) {
                errorMessage.innerText = "⚠ " + result.message;
                errorMessage.style.display = "block";
            } else if (result.status === "error"){
                errorMessage.textContent = result.message;
                errorMessage.classList.remove("hidden");
            } else {
                errorMessage.innerText = "❌ Errore imprevisto. Riprova più tardi.";
                errorMessage.style.display = "block";
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
});

// Rendi cliccabile il logo per tornare alla homepage
document.getElementById("logo-container").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});


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
