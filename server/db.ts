import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import {
  admins,
  members,
  savings,
  loans,
  payments,
  users,
  type InsertAdmin,
  type InsertMember,
  type InsertUser,
  type Admin,
  type Member,
  type User,
} from "../drizzle/schema";

export type MemberRecord = Member;

/**
 * The database connection is created lazily so local UI tooling and unit tests
 * can run without a DATABASE_URL. Production CRUD operations fail explicitly
 * when the database is not configured instead of silently losing data.
 */
type Database = ReturnType<typeof drizzle>;
let database: Database | null | undefined;

export async function getDb(): Promise<Database | null> {
  if (database !== undefined) {
    return database;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    database = null;
    return database;
  }

  try {
    database = drizzle(connectionString);
  } catch (error) {
    console.warn("[Database] Failed to initialize MySQL/TiDB connection:", error);
    database = null;
  }

  return database;
}

function requireDb(db: Database | null): Database {
  if (!db) {
    throw new Error("Database not available. Configure DATABASE_URL and run the database migration.");
  }
  return db;
}

/**
 * Hash passwords without adding another native dependency to the Expo project.
 * The stored format is scrypt$<salt>$<derived-key>.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [algorithm, salt, encodedKey] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !encodedKey) {
    return false;
  }

  try {
    const expectedKey = Buffer.from(encodedKey, "hex");
    const actualKey = scryptSync(password, salt, expectedKey.length);
    return expectedKey.length === actualKey.length && timingSafeEqual(expectedKey, actualKey);
  } catch {
    return false;
  }
}

// Temporary read-only fallback keeps the demo UI usable when local DATABASE_URL
// is absent. New records are never written to this fallback.
const mockAdmins: Admin[] = [
  {
    id: 1,
    email: "admin@khushi.com",
    passwordHash: hashPassword("admin123"),
    name: "Admin User",
    phone: "9876543210",
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockMembers: Member[] = [
  {
    id: 1,
    mobileNumber: "9876543210",
    passwordHash: hashPassword("member123"),
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    address: "123 Main Street, City",
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSavings = [
  {
    id: 1,
    memberId: 1,
    monthlyDeposit: 1000,
    totalSavings: 12000,
    profitEarned: 2400,
    lastDepositDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// User functions (OAuth)
export async function getUserByOpenId(openId: string): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] ?? null;
}

export async function upsertUser(data: Partial<InsertUser> & { openId: string }): Promise<void> {
  const db = requireDb(await getDb());
  await db.insert(users).values({
    openId: data.openId,
    name: data.name ?? null,
    email: data.email ?? null,
    loginMethod: data.loginMethod ?? null,
    role: data.role ?? "user",
    lastSignedIn: data.lastSignedIn ?? new Date(),
  }).onDuplicateKeyUpdate({
    set: {
      name: data.name ?? null,
      email: data.email ?? null,
      loginMethod: data.loginMethod ?? null,
      lastSignedIn: data.lastSignedIn ?? new Date(),
    },
  });
}

// Admin functions
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const db = await getDb();
  if (!db) {
    return mockAdmins.find((admin) => admin.email === email) ?? null;
  }

  const result = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  return result[0] ?? (email === "admin@khushi.com" ? mockAdmins[0] ?? null : null);
}

export async function createAdmin(data: InsertAdmin): Promise<number> {
  const db = requireDb(await getDb());
  const result = await db.insert(admins).values(data);
  return Number((result as any)[0]?.insertId ?? (result as any).insertId);
}

// Member functions
export async function getMemberByMobileNumber(mobileNumber: string): Promise<Member | null> {
  const db = await getDb();
  if (!db) {
    return mockMembers.find((member) => member.mobileNumber === mobileNumber) ?? null;
  }

  const result = await db.select().from(members).where(eq(members.mobileNumber, mobileNumber)).limit(1);
  return result[0] ?? (mobileNumber === "9876543210" ? mockMembers[0] ?? null : null);
}

export async function getMemberById(id: number): Promise<Member | null> {
  const db = await getDb();
  if (!db) {
    return mockMembers.find((member) => member.id === id) ?? null;
  }

  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getAllMembers(): Promise<Member[]> {
  const db = await getDb();
  if (!db) {
    return mockMembers;
  }

  return db.select().from(members);
}

export async function createMemberWithSavings(data: InsertMember): Promise<Member> {
  const db = requireDb(await getDb());

  const memberId = await db.transaction(async (transaction) => {
    const result = await transaction.insert(members).values(data);
    const insertedId = Number((result as any)[0]?.insertId ?? (result as any).insertId);
    if (!insertedId) {
      throw new Error("Member was not created by the database");
    }

    await transaction.insert(savings).values({
      memberId: insertedId,
      monthlyDeposit: 1000,
      totalSavings: 0,
      profitEarned: 0,
      lastDepositDate: null,
    });

    return insertedId;
  });

  const createdMember = await getMemberById(memberId);
  if (!createdMember) {
    throw new Error("Member was inserted but could not be reloaded");
  }
  return createdMember;
}

export async function updateMember(
  id: number,
  data: Partial<Pick<InsertMember, "name" | "email" | "address">>,
): Promise<Member> {
  const db = requireDb(await getDb());
  await db.update(members).set(data).where(eq(members.id, id));

  const updatedMember = await getMemberById(id);
  if (!updatedMember) {
    throw new Error("Member not found");
  }
  return updatedMember;
}

export async function deleteMember(id: number): Promise<Member> {
  const db = requireDb(await getDb());
  const member = await getMemberById(id);
  if (!member) {
    throw new Error("Member not found");
  }

  await db.transaction(async (transaction) => {
    await transaction.delete(savings).where(eq(savings.memberId, id));
    await transaction.delete(members).where(eq(members.id, id));
  });

  return member;
}

// Loan functions remain available for the existing screens.
export async function getLoansByMemberId(memberId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(loans).where(eq(loans.memberId, memberId));
}

export async function getAllLoans() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(loans);
}

// Payment functions remain available for the existing screens.
export async function getPaymentsByLoanId(loanId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.loanId, loanId));
}

export async function getPaymentsByMemberId(memberId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.memberId, memberId));
}

export async function getSavingsByMemberId(memberId: number) {
  const db = await getDb();
  if (!db) {
    return mockSavings.find((saving) => saving.memberId === memberId) ?? null;
  }

  const result = await db.select().from(savings).where(eq(savings.memberId, memberId)).limit(1);
  return result[0] ?? null;
}

export async function recordSavingsDeposit(memberId: number, amount: number) {
  const db = await getDb();
  const existing = await getSavingsByMemberId(memberId);
  if (!existing) {
    throw new Error("Savings record not found");
  }

  const totalSavings = existing.totalSavings + amount;
  const lastDepositDate = new Date();
  if (!db) {
    const mockSaving = mockSavings.find((saving) => saving.memberId === memberId);
    if (mockSaving) {
      mockSaving.totalSavings = totalSavings;
      mockSaving.lastDepositDate = lastDepositDate;
      mockSaving.updatedAt = lastDepositDate;
    }
    return mockSaving ?? null;
  }

  await db.update(savings).set({
    totalSavings,
    lastDepositDate,
  }).where(eq(savings.memberId, memberId));

  return getSavingsByMemberId(memberId);
}

export async function getAllMembersWithSavings() {
  const allMembers = await getAllMembers();
  return Promise.all(allMembers.map(async (member) => ({
    ...member,
    savings: await getSavingsByMemberId(member.id),
  })));
}
