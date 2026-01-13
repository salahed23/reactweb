// src/composants/Login.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import "./Login.css"; // tu peux créer ce fichier pour le style

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export default function Login({ onSubmit, onForgotPassword }) {
    const [loginData, setLoginData] = useState({ email: "", motDePasse: "" });
    const [erreurs, setErreurs] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const intervalRef = useRef(null);

    // Compte à rebours blocage
    useEffect(() => {
        if (isLocked && remainingSeconds > 0) {
            intervalRef.current = setInterval(() => {
                setRemainingSeconds(prev => prev - 1);
            }, 1000);
        } else if (remainingSeconds === 0 && isLocked) {
            setIsLocked(false);
            setFailedAttempts(0);
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isLocked, remainingSeconds]);

    const handleChange = e => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        if (erreurs[name]) setErreurs(prev => ({ ...prev, [name]: "" }));
        if (serverError) setServerError("");
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!loginData.email.trim()) newErrors.email = "L'email est requis";
        else if (!emailRegex.test(loginData.email)) newErrors.email = "Email invalide";

        if (!loginData.motDePasse.trim()) newErrors.motDePasse = "Le mot de passe est requis";

        return newErrors;
    };

    const handleLogin = async e => {
        e.preventDefault();
        if (isLocked) return;

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErreurs(validationErrors);
            return;
        }

        setIsLoading(true);
        setServerError("");

        try {
            await onSubmit(loginData); // ton appel API réel ici
            alert("Connexion réussie !");
            setLoginData({ email: "", motDePasse: "" });
            setFailedAttempts(0);
        } catch (err) {
            setServerError("Email ou mot de passe incorrect");
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            if (newAttempts >= MAX_ATTEMPTS) {
                setIsLocked(true);
                setRemainingSeconds(LOCKOUT_SECONDS);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin} noValidate>
                <h2>Connexion</h2>

                {/* Erreur serveur */}
                {serverError && !isLocked && <div className="server-error">{serverError}</div>}

                {/* Blocage brute-force */}
                {isLocked && (
                    <div className="server-error">
                        Trop de tentatives. Réessayez dans {remainingSeconds} seconde{remainingSeconds > 1 ? "s" : ""}
                    </div>
                )}

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="exemple@email.com"
                        value={loginData.email}
                        onChange={handleChange}
                        className={erreurs.email ? "error" : ""}
                        disabled={isLoading || isLocked}
                    />
                    {erreurs.email && <span className="error-message">{erreurs.email}</span>}
                </div>

                {/* Mot de passe */}
                <div className="form-group">
                    <label htmlFor="motDePasse">Mot de passe *</label>
                    <input
                        type="password"
                        id="motDePasse"
                        name="motDePasse"
                        placeholder="••••••••"
                        value={loginData.motDePasse}
                        onChange={handleChange}
                        className={erreurs.motDePasse ? "error" : ""}
                        disabled={isLoading || isLocked}
                    />
                    {erreurs.motDePasse && <span className="error-message">{erreurs.motDePasse}</span>}
                </div>

                <button type="submit" disabled={isLoading || isLocked} className="submit-btn">
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                </button>

                <div className="forgot-link">
                    <button type="button" onClick={onForgotPassword} className="link-btn">
                        Mot de passe oublié ?
                    </button>
                </div>

                <div className="register-link">
                    <p>Pas encore de compte ?</p>
                    <Link to="/inscription" className="link-btn">
                        Créer un compte
                    </Link>
                </div>
            </form>
        </div>
    );
}
