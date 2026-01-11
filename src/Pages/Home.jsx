// src/Composants/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [panier, setPanier] = useState([]);

    return (
        <div style={styles.container}>
            {/* Header simple */}
            <header style={styles.header}>
                <h1>Home 🏠</h1>
                <p>Articles dans le panier : {panier.length}</p>
            </header>

            {/* Menu horizontal */}
            <nav style={styles.menuWrapper}>
                <Link to="/home" style={styles.button}>
                    Home
                </Link>
                <Link to="/catalogue" style={styles.button}>
                    Catalogue
                </Link>
                <Link to="/inscription" style={styles.button}>
                    Inscription
                </Link>
                <Link to="/connexion" style={styles.button}>
                    Login
                </Link>
            </nav>

            {/* Contenu principal */}
            <main style={styles.content}>
                <h2 style={styles.title}>Bienvenue sur la page d'accueil</h2>
                <p>Ceci est la version web de votre page Home.</p>
            </main>
        </div>
    );
}

// Styles inline (similaire à ton StyleSheet)
const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#fff",
    },
    header: {
        marginBottom: "20px",
    },
    menuWrapper: {
        display: "flex",
        gap: "10px",
        marginBottom: "30px",
    },
    button: {
        backgroundColor: "#007AFF",
        color: "#fff",
        padding: "10px 12px",
        borderRadius: "6px",
        textDecoration: "none",
    },
    content: {
        textAlign: "center",
    },
    title: {
        fontSize: "22px",
        marginBottom: "20px",
    },
};
