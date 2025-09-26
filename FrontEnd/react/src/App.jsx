import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeLogin from "./HomeLogin/HomeLogin";
import LoginUtente from "./AreaUtente/LoginUtente";
import AreaAgenzia from "./AreaAgenzia/AreaAgenzia";
import CambioCredenziali from "./CambioCredenziali/CambioCredenziali";
import NotificheAgente from "./NotificheAgente/NotificheAgente";
import RegistrazioneUtente from "./AreaUtente/RegistrazioneUtente";
import ProfiloUtente from "./ProfiloUtente/ProfiloUtente";
import ProfiloAdmin from "./ProfiloAdmin/ProfiloAdmin";
import Cronologia from "./Cronologia/Cronologia";
import NotificheUtente from "./NotificheUtente/NotificheUtente";
import DettagliImmobile from "./DettagliImmobile/DettagliImmobile";
import RegistrazioneAgenzia from "./RegistrazioneAgenzia/RegistrazioneAgenzia";
import HomeAdmin from "./HomeAdmin/HomeAdmin";
import AggiungiAgente from "./AggiungiAgente/AggiungiAgente";
import AggiungiCollaboratore from "./AggiungiCollaboratore/AggiungiCollaboratore";
import PreferitiUtente from "./PreferitiUtente/PreferitiUtente";
import HomeAgente from "./HomeAgente/HomeAgente";
import ProfiloAgente from "./ProfiloAgente/ProfiloAgente";
import AggiungiImmobile from "./AggiungiImmobile/AggiungiImmobile";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomeLogin />} />
        <Route path="/login" element={<LoginUtente />} />
        <Route path="/home" element={<HomeLogin />} />
        <Route path="/area-agenzia" element={<AreaAgenzia />} />
        <Route path="/cambio-credenziali" element={<CambioCredenziali />} />
        <Route path="/registrazione-utente" element={<RegistrazioneUtente />} />
        <Route path="/profilo-utente" element={<ProfiloUtente />} />
        <Route path="/profilo-admin" element={<ProfiloAdmin />} />
        <Route path="/cronologia" element={<Cronologia />} />
        <Route path="/notifiche-utente" element={<NotificheUtente />} />
        <Route path="/dettagli-immobile" element={<DettagliImmobile />} />
        <Route path="/registrazione-agenzia" element={<RegistrazioneAgenzia />} />
        <Route path="/home-admin" element={<HomeAdmin />} />
        <Route path="/aggiungi-agente" element={<AggiungiAgente />} />
        <Route path="/aggiungi-collaboratore" element={<AggiungiCollaboratore />} />
        <Route path="/preferiti" element={<PreferitiUtente />} />
        <Route path="/home-agente" element={<HomeAgente />} />
        <Route path="/profilo-agente" element={<ProfiloAgente />} />
        <Route path="/aggiungi-immobile" element={<AggiungiImmobile />} />
        <Route path="/notifiche-agente" element={<NotificheAgente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
