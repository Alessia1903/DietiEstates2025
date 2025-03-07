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