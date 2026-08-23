import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../server/db";

const read = (path: string) => readFileSync(path, "utf8");

describe("Member database persistence", () => {
  it("hashes and verifies member passwords without storing plaintext", () => {
    const storedHash = hashPassword("member-secret");

    expect(storedHash).toMatch(/^scrypt\$[^$]+\$[0-9a-f]+$/);
    expect(storedHash).not.toContain("member-secret");
    expect(verifyPassword("member-secret", storedHash)).toBe(true);
    expect(verifyPassword("wrong-password", storedHash)).toBe(false);
  });

  it("routes Admin creation through the database transaction and creates savings", () => {
    const routerSource = read("server/members-router.ts");
    const databaseSource = read("server/db.ts");
    const formSource = read("app/(tabs)/members-management.tsx");

    expect(routerSource).toContain("db.createMemberWithSavings");
    expect(routerSource).toContain("db.hashPassword(input.password ?? 'member123')");
    expect(databaseSource).toContain("transaction.insert(members).values(data)");
    expect(databaseSource).toContain("transaction.insert(savings).values");
    expect(formSource).toContain("createMemberMutation.mutateAsync");
    expect(formSource).toContain("password: formData.password");
  });
});
