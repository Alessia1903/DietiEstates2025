// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-title").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("button[onclick='Registra()']").addEventListener("click", function (event) {
        event.preventDefault();
        Registra();
    });

    const fileInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name-display');
    let selectedFiles = [];  // Array per tenere traccia dei file selezionati

    // Aggiungi un listener per l'evento 'change' che si attiva quando si selezionano file
    fileInput.addEventListener('change', function() {
        const files = fileInput.files;  // Ottieni i file selezionati
        // Aggiungi i nuovi file all'array `selectedFiles`
        selectedFiles = [...selectedFiles, ...files];

        // Crea un array con i nomi dei file
        let fileNames = [];
        selectedFiles.forEach(file => {
            fileNames.push(file.name);
        });

        // Visualizza i nomi dei file separati da virgola
        fileNameDisplay.textContent = "File selezionati: " + fileNames.join(", ");
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
        let response = await fetch("https://cd5480b0-66c3-4d3f-8864-98af937fa5de.mock.pstmn.io/login", {
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
