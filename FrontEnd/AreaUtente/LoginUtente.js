document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Verifica formato email
        if (!validateEmail(email) || password.length < 6) {
            errorMessage.textContent = "Email o password non valide.";
            errorMessage.classList.remove("hidden");
            return;
        }

        // Invio richiesta al backend
        try {
            const response = await fetch("https://80b7ead0-7ae9-493b-903f-9f9ae87bdada.mock.pstmn.io/Risposta1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.status === "error") {
                errorMessage.textContent = result.message;
                errorMessage.classList.remove("hidden");
            } else if (result.status === "new_user") {
                // Salva temporaneamente i dati di accesso
                localStorage.setItem("newUserEmail", email);
                localStorage.setItem("newUserPassword", password);
            
                // Reindirizza alla pagina di registrazione
                window.location.href = "../RegistrazioneUtente/RegistrazioneUtente.html";
            } else {
                errorMessage.classList.add("hidden");
                localStorage.setItem("token", result.token);
                window.location.href = "Dashboard.html";
            }

        } catch (error) {
            console.error("Errore di connessione:", error);
            errorMessage.textContent = "Errore di connessione. Riprova.";
            errorMessage.classList.remove("hidden");
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-container").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});

/*
{
    "status": "new_user",
    "message": "Email non registrata"
}
{
    "status": "error",
    "message": "Password errata"
}
{
    "status": "success",
    "message": "Login effettuato con successo",
    "token": "eyJhbGciOiJIUzI1"  
}
*/