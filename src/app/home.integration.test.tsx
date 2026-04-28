import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const filaments = [
  {
    identifier: "PL-101",
    type: "Matte PLA",
    color: "Red",
    colorHex: "#ff0000",
    material: "PLA",
    brand: "Prusa",
    diameter: 1.75,
    weight: 1000,
    weightLeft: 700,
    inStock: true,
    dateAdded: "2026-01-01T00:00:00.000Z",
    printSettings: {},
    cost: 40,
  },
  {
    identifier: "PT-202",
    type: "PETG",
    color: "Blue",
    colorHex: "#0000ff",
    material: "PETG",
    brand: "Sunlu",
    diameter: 1.75,
    weight: 1000,
    weightLeft: 0,
    inStock: false,
    dateAdded: "2026-03-01T00:00:00.000Z",
    printSettings: {},
    cost: 28,
  },
];

const server = setupServer(
  rest.get("http://localhost/api/filament", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ filaments }));
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
    server.use(
      rest.get("http://localhost/api/filament", (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ filaments: [] }));
      }),
    );
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("No filaments found.")).toBeInTheDocument();
    });
  });

  it("renders filament cards after loading", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("PL-101")).toBeInTheDocument();
      expect(screen.getByText("PT-202")).toBeInTheDocument();
    });
  });

  it("shows total filament count in summary card", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Total Filaments")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("shows in-stock count in summary card", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Filament in Stock")).toBeInTheDocument();
    });
  });

  it("shows materials summary badge", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Materials")).toBeInTheDocument();
    });
  });

  it("renders the FilamentForm placeholder", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("FilamentForm")).toBeInTheDocument();
    });
  });

  it("shows sort selector", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Identifier")).toBeInTheDocument();
    });
  });

  it("shows filter dropdowns", async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("All Materials")).toBeInTheDocument();
    });
  });

  it("clear filters button is present", async () => {
    renderHome();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear filters/i }),
      ).toBeInTheDocument();
    });
  });

  it("clears filters when Clear Filters is clicked", async () => {
    const user = userEvent.setup();
    renderHome();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear filters/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    // Still shows filaments after clearing
    await waitFor(() => {
      expect(screen.getByText("PL-101")).toBeInTheDocument();
    });
  });
});
