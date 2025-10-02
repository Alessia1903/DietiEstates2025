// Pagina di callback per Google OAuth
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state"); // "register" oppure undefined
    if (!code) {
      navigate("/login");
      return;
    }
    const endpoint = state === "register"
      ? "http://localhost:8080/api/buyers/auth/google/register"
      : "http://localhost:8080/api/buyers/auth/google/callback";
    axios.post(endpoint, { code })
      .then(res => {
        // Salva JWT o gestisci la risposta di registrazione
        if (state === "register") {
          alert("Registrazione Google completata! Ora puoi accedere.");
          navigate("/login");
        } else {
          localStorage.setItem("jwtToken", res.data.jwt);
          localStorage.setItem("role", res.data.role || "user");
          navigate("/home");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center p-8">
      <h2>Accesso in corso...</h2>
    </div>
  );
};

export default AuthCallback;
















