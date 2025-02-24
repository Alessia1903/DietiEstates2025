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
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

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

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Rendi cliccabile il logo e il titolo per tornare alla homepage
    document.getElementById("homeRedirect").addEventListener("click", function () {
        window.location.href = "../HomeNoLogin/HomeNoLogin.html";
    });
});
