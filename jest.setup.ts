import "@testing-library/jest-dom";
import "whatwg-fetch";

if (!(Response as unknown as { json?: unknown }).json) {
  (
    Response as unknown as {
      json: (data: unknown, init?: ResponseInit) => Response;
    }
  ).json = (data: unknown, init?: ResponseInit) => {
    const headers = new Headers(init?.headers ?? {});
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    return new Response(JSON.stringify(data), {
      ...init,
      headers,
    });
  };
}
