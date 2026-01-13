import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PanierContext } from "../Context/PanierContext";

export default function Panier() {
  const { panier, supprimerDuPanier, viderPanier } = useContext(PanierContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Mon Panier</h1>
      {panier.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <>
          <ul>
            {panier.map((item, index) => (
              <li key={item.id + "-" + index}>
                {item.name} - {item.prix}€
                <button
                  onClick={() => supprimerDuPanier(item.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
          <button onClick={viderPanier} style={{ marginTop: "10px" }}>
            Vider le panier
          </button>
        </>
      )}
      <div style={{ marginTop: "20px" }}>
        <Link to='/catalogue'>Retour au catalogue</Link>
      </div>
    </div>
  );
}
