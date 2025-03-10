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
        const response = await fetch("https://80b7ead0-7ae9-493b-903f-9f9ae87bdada.mock.pstmn.io/Login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });
    
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
    
            if (data.firstLogin) {
                window.location.href = "../CambioCredenziali/CambioCredenziali.html"; // Reindirizza alla pagina di cambio password
            } else {
                const homePages = {
                    agente: "../HomeAgente/HomeAgente.html",
                    collaboratore: "../HomeAdmin/HomeAdmin.html",
                    admin: "../HomeAdmin/HomeAdmin.html",
                };
                window.location.href = homePages[data.role] || "../HomeNoLogin/HomeNoLogin.html";
            }
        } else {
            alert("Login fallito");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
        alert("Errore di connessione. Riprova.");
    }    
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});