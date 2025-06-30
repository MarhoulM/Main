import React from "react";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactForm from "./ContactForm";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("ContactForm", () => {
  // Test 1: Kontrola, zda se komponenta správně renderuje
  test("renders the contact form with all fields and button", () => {
    render(<ContactForm />);

    expect(screen.getByText("Chcete se na něco zeptat?")).toBeInTheDocument();
    expect(screen.getByLabelText(/jméno:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zpráva:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /odeslat/i })
    ).toBeInTheDocument();
  });

  // Test 2: Kontrola aktualizace stavu při změně vstupních polí
  test("updates form data on input change", () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/jméno:/i);
    const emailInput = screen.getByLabelText(/e-mail:/i);
    const messageTextarea = screen.getByLabelText(/zpráva:/i);

    fireEvent.change(nameInput, {
      target: { name: "name", value: "Jan Novák" },
    });
    fireEvent.change(emailInput, {
      target: { name: "email", value: "jan.novak@example.com" },
    });
    fireEvent.change(messageTextarea, {
      target: { name: "message", value: "Ahoj, mám dotaz." },
    });

    expect(nameInput).toHaveValue("Jan Novák");
    expect(emailInput).toHaveValue("jan.novak@example.com");
    expect(messageTextarea).toHaveValue("Ahoj, mám dotaz.");
  });

  // Test 3: Validace prázdných polí
  test("shows error message when form fields are empty on submit", async () => {
    render(<ContactForm />);
    const form = screen.getByRole("form");

    fireEvent.submit(form);

    const errorMessage = await screen.findByText(
      "Prosím vyplňte všechna pole."
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("contact-form-message", "error");
  });

  // Test 4: Validace neplatného emailu
  test("zobrazí chybovou zprávu pro neplatný e-mail", async () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/jméno:/i);
    const emailInput = screen.getByLabelText(/e-mail:/i);
    const messageTextarea = screen.getByLabelText(/zpráva:/i);
    const submitButton = screen.getByRole("button", { name: /odeslat/i });

    fireEvent.change(nameInput, { target: { value: "Test Jméno" } });
    await waitFor(() => expect(nameInput).toHaveValue("Test Jméno"));

    fireEvent.change(emailInput, { target: { value: "neplatny@email" } });
    await waitFor(() => expect(emailInput).toHaveValue("neplatny@email"));

    fireEvent.change(messageTextarea, {
      target: { value: "Testovací zpráva" },
    });
    await waitFor(() =>
      expect(messageTextarea).toHaveValue("Testovací zpráva")
    );

    await userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText(
      "Zadejte prosím platnou e-mailovou adresu."
    );
    expect(emailErrorMessage).toBeInTheDocument();
    expect(emailErrorMessage).toHaveClass("contact-form-message", "error");
  });
  // Test 5: Úspěšné odeslání formuláře
  test("submits the form successfully and clears fields", async () => {
    render(<ContactForm />);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Zpráva byla úspěšně odeslána!",
      }),
    });

    const nameInput = screen.getByLabelText(/jméno:/i);
    const emailInput = screen.getByLabelText(/e-mail:/i);
    const messageTextarea = screen.getByLabelText(/zpráva:/i);
    const submitButton = screen.getByRole("button", { name: /odeslat/i });

    fireEvent.change(nameInput, {
      target: { name: "name", value: "Jan Novák" },
    });
    fireEvent.change(emailInput, {
      target: { name: "email", value: "jan.novak@example.com" },
    });
    fireEvent.change(messageTextarea, {
      target: { name: "message", value: "Ahoj, mám dotaz." },
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      const callArgs = fetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody.name).toBe("Jan Novák");
      expect(requestBody.email).toBe("jan.novak@example.com");
      expect(requestBody.message).toBe("Ahoj, mám dotaz.");
      expect(requestBody.Subject).toBe(
        "Portfolio - Dotaz od Jan Novák - jan.novak@example.com"
      );
      expect(requestBody.Body).toContain("Jan Novák");
      expect(requestBody.Body).toContain("jan.novak@example.com");
      expect(requestBody.Body).toContain("Ahoj, mám dotaz.");
    });

    await waitFor(() => {
      expect(
        screen.getByText("Zpráva byla úspěšně odeslána!")
      ).toBeInTheDocument();
    });

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(messageTextarea).toHaveValue("");
  });

  // Test 6: Chyba při odesílání formuláře (např. chyba ze serveru)
  test("zobrazí chybovou zprávu, když odeslání formuláře selže", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Zprávu nelze odeslat." }),
      })
    );

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/jméno/i), {
      target: { value: "Test Jméno" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/zpráva/i), {
      target: { value: "Testovací zpráva" },
    });

    const submitButton = screen.getByRole("button", { name: /odeslat/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(
        /Chyba při odesílání dotazu: Zprávu nelze odeslat\./i
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("error");
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Odeslat");
    });
  });
  // Test 7: Kontrola stavu načítání tlačítka
  test('disables submit button and shows "Odesílám..." during submission', async () => {
    render(<ContactForm />);

    let resolvePromise;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    fetch.mockImplementationOnce(() => pendingPromise);

    const nameInput = screen.getByLabelText(/jméno:/i);
    const emailInput = screen.getByLabelText(/e-mail:/i);
    const messageTextarea = screen.getByLabelText(/zpráva:/i);
    const submitButton = screen.getByRole("button", { name: /odeslat/i });

    fireEvent.change(nameInput, {
      target: { name: "name", value: "Loading Test" },
    });
    fireEvent.change(emailInput, {
      target: { name: "email", value: "loading@example.com" },
    });
    fireEvent.change(messageTextarea, {
      target: { name: "message", value: "Loading message" },
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Odesílám...");

    await act(async () => {
      resolvePromise({
        ok: true,
        json: async () => ({ success: true, message: "Odesláno!" }),
      });
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Odeslat");
    });

    await waitFor(() => {
      expect(screen.getByText("Odesláno!")).toBeInTheDocument();
    });
  });
});
