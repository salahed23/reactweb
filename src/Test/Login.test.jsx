// src/Test/Login.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "../Pages/Login.jsx";

// Helper pour wrapper le composant
const renderLogin = (props = {}) => {
    return render(
        <BrowserRouter>
            <Login {...props} />
        </BrowserRouter>
    );
};

describe("Login component", () => {
    const mockSubmit = vi.fn();
    const mockForgot = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ------------------------
    // TESTS UNITAIRES
    // ------------------------

    it("affiche les champs email et mot de passe", () => {
        renderLogin({ onSubmit: mockSubmit, onForgotPassword: mockForgot });

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
    });

    it("affiche une erreur si les champs sont vides", async () => {
        renderLogin({ onSubmit: mockSubmit });

        await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

        expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
        expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("affiche une erreur si l'email est invalide", async () => {
        renderLogin({ onSubmit: mockSubmit });

        await userEvent.type(screen.getByLabelText(/email/i), "testtest.com");
        await userEvent.type(screen.getByLabelText(/mot de passe/i), "password");
        await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

        expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    // ------------------------
    // TESTS D’INTÉGRATION
    // ------------------------

    it("appelle onSubmit avec les bonnes données si le formulaire est valide", async () => {
        mockSubmit.mockResolvedValueOnce();

        renderLogin({ onSubmit: mockSubmit });

        await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
        await userEvent.type(screen.getByLabelText(/mot de passe/i), "Test1234!");
        await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

        expect(mockSubmit).toHaveBeenCalledOnce();
        expect(mockSubmit).toHaveBeenCalledWith({
            email: "test@test.com",
            motDePasse: "Test1234!",
        });
    });

    it("affiche une erreur serveur si onSubmit échoue", async () => {
        mockSubmit.mockRejectedValueOnce(new Error("Erreur login"));

        renderLogin({ onSubmit: mockSubmit });

        await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
        await userEvent.type(screen.getByLabelText(/mot de passe/i), "wrongpass");
        await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

        expect(await screen.findByText(/email ou mot de passe incorrect/i)).toBeInTheDocument();
    });

    it("bloque l'utilisateur après 5 tentatives échouées", async () => {
        mockSubmit.mockRejectedValue(new Error("Erreur"));

        renderLogin({ onSubmit: mockSubmit });

        for (let i = 0; i < 5; i++) {
            await userEvent.clear(screen.getByLabelText(/email/i));
            await userEvent.clear(screen.getByLabelText(/mot de passe/i));

            await userEvent.type(screen.getByLabelText(/email/i), "test@test.com");
            await userEvent.type(screen.getByLabelText(/mot de passe/i), "wrong");
            await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));
        }

        expect(
            await screen.findByText(/trop de tentatives/i)
        ).toBeInTheDocument();
    });

    it("appelle la fonction mot de passe oublié", async () => {
        renderLogin({ onSubmit: mockSubmit, onForgotPassword: mockForgot });

        await userEvent.click(screen.getByText(/mot de passe oublié/i));

        expect(mockForgot).toHaveBeenCalledOnce();
    });
});
