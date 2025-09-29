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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomeLogin />} />
        <Route path="/login" element={<LoginUtente />} />
        <Route path="/home" element={<HomeLogin />} />
        <Route path="/area-agenzia" element={<AreaAgenzia />} />
        <Route path="/cambio-credenziali" element={
          <ProtectedRoute requiredRole="admin" redirectTo="/area-agenzia">
            <CambioCredenziali />
          </ProtectedRoute>
        } />
        <Route path="/registrazione-utente" element={<RegistrazioneUtente />} />
        <Route path="/profilo-utente" element={
          <ProtectedRoute requiredRole="user" redirectTo="/login">
            <ProfiloUtente />
          </ProtectedRoute>
        } />
        <Route path="/profilo-admin" element={
          <ProtectedRoute requiredRole="admin" redirectTo="/area-agenzia">
            <ProfiloAdmin />
          </ProtectedRoute>
        } />
        <Route path="/cronologia" element={
          <ProtectedRoute requiredRole="user" redirectTo="/login">
            <Cronologia />
          </ProtectedRoute>
        } />
        <Route path="/notifiche-utente" element={
          <ProtectedRoute requiredRole="user" redirectTo="/login">
            <NotificheUtente />
          </ProtectedRoute>
        } />
        <Route path="/dettagli-immobile" element={<DettagliImmobile />} />
        <Route path="/registrazione-agenzia" element={<RegistrazioneAgenzia />} />
        <Route path="/home-admin" element={
          <ProtectedRoute requiredRole="admin" redirectTo="/area-agenzia">
            <HomeAdmin />
          </ProtectedRoute>
        } />
        <Route path="/aggiungi-agente" element={
          <ProtectedRoute requiredRole="admin" redirectTo="/area-agenzia">
            <AggiungiAgente />
          </ProtectedRoute>
        } />
        <Route path="/aggiungi-collaboratore" element={
          <ProtectedRoute requiredRole="admin" redirectTo="/area-agenzia">
            <AggiungiCollaboratore />
          </ProtectedRoute>
        } />
        <Route path="/preferiti" element={
          <ProtectedRoute requiredRole="user" redirectTo="/login">
            <PreferitiUtente />
          </ProtectedRoute>
        } />
        <Route path="/home-agente" element={
          <ProtectedRoute requiredRole="agent" redirectTo="/area-agenzia">
            <HomeAgente />
          </ProtectedRoute>
        } />
        <Route path="/profilo-agente" element={
          <ProtectedRoute requiredRole="agent" redirectTo="/area-agenzia">
            <ProfiloAgente />
          </ProtectedRoute>
        } />
        <Route path="/aggiungi-immobile" element={
          <ProtectedRoute requiredRole="agent" redirectTo="/area-agenzia">
            <AggiungiImmobile />
          </ProtectedRoute>
        } />
        <Route path="/notifiche-agente" element={
          <ProtectedRoute requiredRole="agent" redirectTo="/area-agenzia">
            <NotificheAgente />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
