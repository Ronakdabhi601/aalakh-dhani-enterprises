import { describe, expect, it } from "vitest";

describe("Render API base URL", () => {
  it("returns JSON from the deployed health endpoint", async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    expect(baseUrl).toBe("https://aalakh-dhani-enterprises.onrender.com");

    const response = await fetch(`${baseUrl}/api/health`);
    expect(response.ok).toBe(true);

    const contentType = response.headers.get("content-type") ?? "";
    expect(contentType).toMatch(/application\/json/i);

    const body = await response.json();
    expect(body).toBeDefined();
  }, 30_000);
});
