import { describe, expect, it } from "vitest";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const hasValidApiBaseUrl = Boolean(apiBaseUrl && /^https?:\/\/[^\s/]+/.test(apiBaseUrl));

describe("native API base URL", () => {
  it("accepts a valid HTTP(S) URL when one is configured", () => {
    if (!apiBaseUrl || !hasValidApiBaseUrl) return;

    expect(apiBaseUrl).toMatch(/^https?:\/\/[^\s/]+$/);
  });

  it.skipIf(!hasValidApiBaseUrl)("reaches the configured backend and receives JSON", async () => {
    const response = await fetch(`${apiBaseUrl}/api/trpc/members.getAll`);
    const contentType = response.headers.get("content-type") ?? "";

    expect(response.ok).toBe(true);
    expect(contentType).toContain("application/json");
    await expect(response.json()).resolves.toBeDefined();
  });
});
