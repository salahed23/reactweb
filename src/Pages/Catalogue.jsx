import React, { useContext } from "react";
import { Link } from "react-router-dom";
// import { produits } from "../data/Data";
import Article from "../Composants/Article";
import { PanierContext } from "../context/PanierContext";

export default function Catalogue() {
    const { panier, ajouterAuPanier } = useContext(PanierContext);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Catalogue</h1>
                <p>Articles dans le panier : {panier.length}</p>
                <Link to="/panier" style={styles.button}>Voir Panier</Link>
            </header>

            <nav style={styles.menuWrapper}>
                <Link to="/home" style={styles.button}>Accueil</Link>
                <Link to="/catalogue" style={styles.button}>Catalogue</Link>
                <Link to="/inscription" style={styles.button}>Inscription</Link>
                <Link to="/connexion" style={styles.button}>Login</Link>
            </nav>

            <ul style={styles.list}>
                {produits.map((item) => (
                    <li key={item.id} style={styles.item}>
                        <Article item={item} onAddToCart={() => ajouterAuPanier(item)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
