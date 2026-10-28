import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LoginPage", () => {
  it("shows the current password validation message without sending a request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText("Email"), "student@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Password must contain at least 8 characters.")).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
