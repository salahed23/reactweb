import { createContext, useState } from "react";

export const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
    const [panier, setPanier] = useState([]);

    const ajouterAuPanier = (produit) => {
        setPanier((prev) => [...prev, produit]);
    };

    const supprimerDuPanier = (id) => {
        setPanier((prev) => prev.filter((item) => item.id !== id));
    };

    const viderPanier = () => setPanier([]);

    return (
        <PanierContext.Provider value={{ panier, ajouterAuPanier, supprimerDuPanier, viderPanier }}>
            {children}
        </PanierContext.Provider>
    );
};
