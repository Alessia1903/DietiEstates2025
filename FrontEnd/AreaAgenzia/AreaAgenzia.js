document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

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


// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
const clickableElements = document.querySelectorAll('.custom-text-color, img');
clickableElements.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
        window.location.href = "../HomeNoLogin/HomeNoLogin.html";
    });
});
