// src/composants/Inscription.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import "./Inscription.css";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

const Inscription = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        motDePasse: "",
        confirmMotDePasse: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Protection brute-force
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const intervalRef = useRef(null);

    // Compte à rebours pendant blocage
    useEffect(() => {
        if (isLocked && remainingSeconds > 0) {
            intervalRef.current = setInterval(() => {
                setRemainingSeconds((prev) => prev - 1);
            }, 1000);
        } else if (remainingSeconds === 0 && isLocked) {
            setIsLocked(false);
            setFailedAttempts(0);
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isLocked, remainingSeconds]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");
    };

    // Validation du mot de passe fort
    const validatePasswordStrength = (password) => {
        const minLength = 8; // adapté mobile
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (password.length < minLength) return "Minimum 8 caractères";
        if (!hasUpperCase) return "Au moins une majuscule";
        if (!hasLowerCase) return "Au moins une minuscule";
        if (!hasNumber) return "Au moins un chiffre";

        return null;
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
        if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) newErrors.email = "L'email est requis";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Email invalide";

        const telRegex = /^[0-9]{10}$/;
        if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
        else if (!telRegex.test(formData.telephone.replace(/\s/g, ''))) newErrors.telephone = "Téléphone invalide (10 chiffres)";

        const passwordError = validatePasswordStrength(formData.motDePasse);
        if (passwordError) newErrors.motDePasse = passwordError;

        if (formData.motDePasse && formData.confirmMotDePasse && formData.motDePasse !== formData.confirmMotDePasse) {
            newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas";
        }

        if (!formData.confirmMotDePasse) newErrors.confirmMotDePasse = "Veuillez confirmer votre mot de passe";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLocked) return;

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setServerError("");

        try {
            // Appel API simulé
            await onSubmit?.(formData);

            // Succès
            alert(`Inscription réussie ! Bienvenue ${formData.prenom} ${formData.nom}`);
            setFormData({
                prenom: "",
                nom: "",
                email: "",
                telephone: "",
                motDePasse: "",
                confirmMotDePasse: "",
            });

            setFailedAttempts(0);
        } catch (err) {
            setServerError("Erreur lors de l'inscription");

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
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit} noValidate>
                <h2>Inscription</h2>

                {serverError && !isLocked && (
                    <div className="server-error" role="alert">{serverError}</div>
                )}

                {isLocked && (
                    <div className="server-error" role="alert">
                        Trop de tentatives. Réessayez dans {remainingSeconds} seconde{remainingSeconds > 1 ? "s" : ""}
                    </div>
                )}

                {["prenom", "nom", "email", "telephone", "motDePasse", "confirmMotDePasse"].map((champ) => (
                    <div className="form-group" key={champ}>
                        <label htmlFor={champ}>
                            {champ === "prenom" ? "Prénom *" :
                                champ === "nom" ? "Nom *" :
                                    champ === "email" ? "Email *" :
                                        champ === "telephone" ? "Téléphone *" :
                                            champ === "motDePasse" ? "Mot de passe *" :
                                                "Confirmer le mot de passe *"}
                        </label>
                        <input
                            type={champ.includes("motDePasse") ? "password" : "text"}
                            id={champ}
                            name={champ}
                            value={formData[champ]}
                            onChange={handleChange}
                            placeholder={champ.includes("motDePasse") ? "••••••••" : champ === "email" ? "exemple@email.com" : `Votre ${champ}`}
                            className={errors[champ] ? "error" : ""}
                            disabled={isLoading || isLocked}
                        />
                        {errors[champ] && <span className="error-message">{errors[champ]}</span>}
                    </div>
                ))}

                <button type="submit" className="submit-btn" disabled={isLoading || isLocked}>
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </button>

                <div className="login-link" style={{ marginTop: "1.5rem", textAlign: "center" }}>
                    <p style={{ color: "#666", marginBottom: "0.5rem" }}>Déjà un compte ?</p>
                    <Link
                        to="/connexion"
                        style={{ fontWeight: 600, color: "#0066cc", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                    >
                        Se connecter
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Inscription;