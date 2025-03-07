// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeAdmin/HomeAdmin.html";
});

document.addEventListener("DOMContentLoaded", function () {
    const targetPages = { 
        collaboratore: "../AggiungiDipendentiCollaboratore/AggiungiDipendentiCollaboratore.html",
        admin: "../AggiungiDipendentiAdmin/AggiungiDipendentiAdmin.html"
    };

    const userRole = localStorage.getItem("role"); // Recupera il ruolo dell'utente
    const targetPage = targetPages[userRole] || "../HomeNoLogin/HomeNoLogin.html"; // Imposta la destinazione

    // Imposta il link in base al ruolo dell'utente
    document.getElementById("dipendenti-link").addEventListener("click", function () {
        window.location.href = targetPage;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token"); // Recupera il token dal localStorage

    if (!token) {
        alert("Utente non autenticato! Effettua il login.");
        window.location.href = "login.html"; // Reindirizza al login se non autenticato
        return;
    }

    let userPassword = ""; // Variabile per memorizzare la password

    // Richiesta al backend per ottenere i dati dell'utente
    fetch("https://8e6dd234-c612-45f8-aa98-6c9b4407fbc1.mock.pstmn.io/Login", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("nome").textContent = data.nome;
        document.getElementById("cognome").textContent = data.cognome;
        document.getElementById("email").textContent = data.email;
        
        // Memorizza la password ma la nasconde inizialmente
        userPassword = data.password;
        const passwordField = document.getElementById("password");
        passwordField.textContent = "********"; 
        passwordField.classList.remove("hidden"); // Rimuove la classe nascosta
    })
    .catch(error => {
        console.error("Errore nel recupero dati:", error);
        alert("Errore nel caricamento del profilo.");
    });

    // Gestione mostra/nascondi password
    const passwordField = document.getElementById("password");
    const toggleButton = document.getElementById("togglePassword");

    toggleButton.addEventListener("click", function () {
        if (passwordField.textContent === "********") {
            passwordField.textContent = userPassword; // Mostra la password reale
            toggleButton.textContent = "X";
        } else {
            passwordField.textContent = "********"; // Nasconde la password
            toggleButton.textContent = "MOSTRA";
        }
    });
});
