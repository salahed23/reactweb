import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Inscription from "../Pages/Inscription";

describe("Formulaire d'inscription", () => {
    const mockOnSubmit = vi.fn();

    const renderComponent = () =>
        render(
            <MemoryRouter>
                <Inscription onSubmit={mockOnSubmit} />
            </MemoryRouter>
        );

    test("affiche tous les champs du formulaire", () => {
        renderComponent();

        expect(screen.getByLabelText(/^Prénom \*$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Nom \*$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Email \*$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Téléphone \*$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Mot de passe \*$/i)).toBeInTheDocument();
        expect(
            screen.getByLabelText(/^Confirmer le mot de passe \*$/i)
        ).toBeInTheDocument();
    });

    test("affiche une erreur si le formulaire est vide et soumis", () => {
        renderComponent();

        fireEvent.click(
            screen.getByRole("button", { name: /s'inscrire/i })
        );

        expect(screen.getByText(/Le prénom est requis/i)).toBeInTheDocument();
        expect(screen.getByText(/Le nom est requis/i)).toBeInTheDocument();
    });

    test("soumet correctement le formulaire avec des données valides", () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/^Prénom \*$/i), {
            target: { value: "Alice" },
        });
        fireEvent.change(screen.getByLabelText(/^Nom \*$/i), {
            target: { value: "Dupont" },
        });
        fireEvent.change(screen.getByLabelText(/^Email \*$/i), {
            target: { value: "alice@test.com" },
        });
        fireEvent.change(screen.getByLabelText(/^Téléphone \*$/i), {
            target: { value: "0612345678" },
        });
        fireEvent.change(screen.getByLabelText(/^Mot de passe \*$/i), {
            target: { value: "Password1" },
        });
        fireEvent.change(
            screen.getByLabelText(/^Confirmer le mot de passe \*$/i),
            {
                target: { value: "Password1" },
            }
        );

        fireEvent.click(
            screen.getByRole("button", { name: /s'inscrire/i })
        );

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
});
