import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Home from "@/app/page";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock("@/components/FilamentForm", () => {
  return function MockedFilamentForm() {
    return <div>FilamentForm</div>;
  };
});

const server = setupServer(
  rest.get("http://localhost/api/filament", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ filaments: [] }));
  }),
);

const renderHome = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>,
  );
};

describe("Home integration", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("shows loading state during request", () => {
    renderHome();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state when list is empty", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("No filaments found.")).toBeInTheDocument();
    });
  });
});
