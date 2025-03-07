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
    document.querySelector("button[onclick='Registra()']").addEventListener("click", function (event) {
        event.preventDefault();
        Registra();
    });

    const fileInput = document.getElementById("file-upload");
    const fileNameDisplay = document.getElementById("file-name-display");
    
    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            fileNameDisplay.innerText = fileInput.files[0].name;
        } else {
            fileNameDisplay.innerText = "";
        }
    });
});

async function Registra() {
    const warningModal = document.getElementById("warningModal");
    const successModal = document.getElementById("successModal");
    const confirmWarningButton = document.getElementById("confirmWarningButton");
    const confirmSuccessButton = document.getElementById("confirmSuccessButton");
    const cancelButton = document.getElementById("cancelButton");
    const erroreMessaggio = document.getElementById("erroreMessaggio");

    // Nasconde eventuali errori precedenti
    erroreMessaggio.style.display = "none";
    erroreMessaggio.innerText = "";

    let city = document.getElementById("city").value.trim();
    let town = document.getElementById("town").value.trim();
    let address = document.getElementById("address").value.trim();
    let civicNumber = document.getElementById("civic-number").value.trim();
    let floor = document.getElementById("floor").value.trim();
    let totalFloors = document.getElementById("total-floors").value.trim();
    let surface = document.getElementById("surface").value.trim();
    let rooms = document.getElementById("rooms").value.trim();
    let energyClass = document.getElementById("energy-class").value.trim();
    let description = document.getElementById("description").value.trim();
    let price = document.getElementById("price").value.trim();

    // Controllo che tutti i campi siano compilati
    if (!city || !town || !address || !civicNumber || !floor || !totalFloors || !surface || !rooms || !energyClass || !description || !price) {
        erroreMessaggio.innerText = "⚠ Tutti i campi sono obbligatori!";
        erroreMessaggio.style.display = "block";
        return;
    }

    let formData = new FormData();
    formData.append("city", city);
    formData.append("town", town);
    formData.append("address", address);
    formData.append("civic_number", civicNumber);
    formData.append("floor", floor);
    formData.append("total_floors", totalFloors);
    formData.append("surface", surface);
    formData.append("elevator", document.getElementById("elevator").checked);
    formData.append("rooms", rooms);
    formData.append("energy_class", energyClass);
    formData.append("description", description);
    formData.append("price", price);

    const fileInput = document.getElementById("file-upload");
    if (fileInput.files.length > 0) {
        formData.append("image", fileInput.files[0]);
    }

    document.querySelectorAll("input[name='arredamento']:checked").forEach(input => {
        formData.append("arredamento", input.nextSibling.nodeValue.trim());
    });
    document.querySelectorAll("input[name='riscaldamento']:checked").forEach(input => {
        formData.append("riscaldamento", input.nextSibling.nodeValue.trim());
    });
    document.querySelectorAll("input[name='stato']:checked").forEach(input => {
        formData.append("stato", input.nextSibling.nodeValue.trim());
    });
    document.querySelectorAll("input[name='contratto']:checked").forEach(input => {
        formData.append("contratto", input.nextSibling.nodeValue.trim());
    });

    try {
        let response = await fetch("https://tuo-backend.com/api/immobili", {
            method: "POST",
            body: formData
        });
        let result = await response.json();

        if (response.ok) {
            warningModal.style.display = "flex";

            confirmWarningButton.addEventListener("click", function () {
                warningModal.style.display = "none";
                successModal.style.display = "flex";
            });

            cancelButton.addEventListener("click", function () {
                warningModal.style.display = "none";
            });

            confirmSuccessButton.addEventListener("click", function () {
                window.location.href = "../HomeAdmin/HomeAdmin.html";
            });
        } else {
            erroreMessaggio.innerText = "❌ " + (result.message || "Errore imprevisto. Riprova più tardi.");
            erroreMessaggio.style.display = "block";
        }
    } catch (error) {
        console.error("Errore di rete:", error);
        erroreMessaggio.innerText = "❌ Errore di connessione. Controlla la tua rete.";
        erroreMessaggio.style.display = "block";
    }
}
