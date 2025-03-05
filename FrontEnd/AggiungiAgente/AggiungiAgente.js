// Rendi cliccabile il titolo, il sottotitolo e il logo per tornare alla homepage
document.getElementById("logo-container").addEventListener("click", function () {
    window.location.href = "../HomeNoLogin/HomeNoLogin.html";
});

let paginaCorrente = 1;
const annunciPerPagina = 10;
let risultatiGlobali = []; // Salviamo tutti gli annunci

document.addEventListener("DOMContentLoaded", async () => {
    const token = "Bearer abc123xyz456token789"; // Assegna un valore fittizio al token per il test
    //const token = localStorage.getItem("token"); // Recupera il token salvato
  
    if (!token) {
      alert("Accesso non autorizzato. Effettua il login.");
      window.location.href = "../AreaAgenzia/AreaAgenzia.html"; // Torna alla pagina di login
      return;
    }
  
    try {
      const response = await fetch("https://2fa95eb8-6532-48cf-86fc-bd61b88e3eb0.mock.pstmn.io/annunci?", {
        method: "GET",
        headers: {
          "Authorization": token, // Invia il token per l'autenticazione
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Errore nel recupero degli annunci");
      }

      risultatiGlobali = await response.json();

        if (risultatiGlobali.length === 0) {
            return;
        }
        
        aggiornaPaginazione(); // Mostra i primi risultati  
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un problema nel caricamento degli annunci.");
    }
});

