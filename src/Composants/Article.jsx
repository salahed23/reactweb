import React, { useContext } from "react";
import { PanierContext } from "../Context/PanierContext";
// import "../styles/styles.css";


const Article = ({ item }) => {
    const { ajouterAuPanier } = useContext(PanierContext);

    return (
        <div className="articleContainer">
            <img src={item.image} alt={item.name} className="image" />
            <div className="info">
                <h3 className="nom">{item.name}</h3>
                <p className="prix">{item.prix} €</p>
                <button onClick={() => ajouterAuPanier(item)}>Ajouter au panier</button>
            </div>
        </div>
    );
};

export default Article;
