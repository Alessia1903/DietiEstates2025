// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});

async function Registra() {

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("error-message");

    if (newPassword !== confirmPassword) {
        errorMessage.textContent = "Le password non coincidono";
        errorMessage.classList.remove("hidden");
        return;
    } else {
        errorMessage.classList.add("hidden");
    }

    try {
        const response = await fetch("https://80b7ead0-7ae9-493b-903f-9f9ae87bdada.mock.pstmn.io/ChangePassword", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (response.ok) {
            errorMessage.classList.add("hidden");
            alert("Password cambiata con successo!");

            // Recupero il ruolo dell'utente salvato in localStorage
            const userRole = localStorage.getItem("role");

            // Mappatura delle home in base al ruolo
            const homePages = {
                agente: "../HomeAgente/HomeAgente.html",
                collaboratore: "../HomeCollaboratore/HomeCollaboratore.html",
                admin: "../HomeAdmin/HomeAdmin.html",
            };

            // Reindirizza alla homepage corrispondente
            window.location.href = homePages[userRole] || "../HomeNoLogin/HomeNoLogin.html";
        } else {
            errorMessage.textContent = "Errore nel salvare la password, ritenta";
            errorMessage.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
        alert("Errore di connessione. Riprova.");
    }
};