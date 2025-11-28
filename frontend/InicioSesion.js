import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";
import logo from "../images/logo2.png";

// Helper to attach token to fetch calls
export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers ? { ...options.headers } : {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
}

const InicioSesion = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        let errText = "Credenciales incorrectas";
        try {
          const txt = await res.text();
          if (txt) errText = txt;
        } catch (_) {}
        throw new Error(errText);
      }

      const data = await res.json(); // espera { token: "..." }
      const token = data?.token;
      if (!token) throw new Error("Token no devuelto por el servidor");

      // Guardar token en localStorage
      if (formData.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        // sessionStorage si no quiere recordarme
        sessionStorage.setItem("token", token);
      }

      setLoginMessage({ type: "success", text: "¡Inicio de sesión exitoso! Redirigiendo..." });

      setIsLoading(false);

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage({ type: "error", text: error.message || "Usuario o contraseña incorrectos" });
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <img src={logo} alt="Level UP Gamer" className="auth-logo" />
          <h1>
            <i className="fas fa-user-circle"></i> Iniciar Sesión
          </h1>
          <p>Accede a tu cuenta de Level UP Gamer</p>
        </div>

        {/* Body */}
        <div className="auth-body">
          {/* Mensaje de éxito/error */}
          {loginMessage && (
            <div className={`alert-auth ${loginMessage.type === "success" ? "alert-success" : "alert-error"}`}>
              <i className={`fas ${loginMessage.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
              {loginMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="form-group-auth">
              <label htmlFor="email">
                Correo Electrónico <span className="required-star">*</span>
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? "input-error" : ""} placeholder="ejemplo@correo.com" />
              {errors.email && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Contraseña */}
            <div className="form-group-auth">
              <label htmlFor="password">
                Contraseña <span className="required-star">*</span>
              </label>
              <div className="password-toggle">
                <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} className={errors.password ? "input-error" : ""} placeholder="Ingresa tu contraseña" />
                <i className={`password-toggle-icon fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setShowPassword(!showPassword)}></i>
              </div>
              {errors.password && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Recordarme y contraseña olvidada */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="checkbox-group" style={{ margin: 0 }}>
                <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                <label htmlFor="rememberMe">Recordarme</label>
              </div>
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            {/* Botón de login */}
            <button type="submit" className={`btn-auth ${isLoading ? "loading" : ""}`} disabled={isLoading}>{isLoading ? "" : "Iniciar Sesión"}</button>

            {/* Link a registro */}
            <div className="auth-link">¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
