import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';

const memberInputSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().trim().email('Enter a valid email address').max(255).optional(),
  address: z.string().trim().max(2000).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100).optional(),
});

type PublicMember = Omit<db.MemberRecord, 'passwordHash'>;

function toPublicMember(member: db.MemberRecord): PublicMember {
  const { passwordHash: _passwordHash, ...publicMember } = member;
  return publicMember;
}

export const membersRouter = router({
  // Get all members from MySQL/TiDB.
  getAll: publicProcedure.query(async () => {
    const members = await db.getAllMembers();
    return members.map(toPublicMember);
  }),

  // Get member by ID.
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const member = await db.getMemberById(input.id);
      if (!member) {
        throw new Error('Member not found');
      }
      return toPublicMember(member);
    }),

  // Get member by mobile number.
  getByMobile: publicProcedure
    .input(z.object({ mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits') }))
    .query(async ({ input }) => {
      const member = await db.getMemberByMobileNumber(input.mobileNumber);
      if (!member) {
        throw new Error('Member not found');
      }
      return toPublicMember(member);
    }),

  // Insert a new member and its initial savings account atomically.
  create: publicProcedure
    .input(memberInputSchema)
    .mutation(async ({ input }) => {
      const existing = await db.getMemberByMobileNumber(input.mobileNumber);
      if (existing) {
        throw new Error('Member with this mobile number already exists');
      }

      const createdMember = await db.createMemberWithSavings({
        mobileNumber: input.mobileNumber,
        passwordHash: db.hashPassword(input.password ?? 'member123'),
        name: input.name,
        email: input.email || null,
        address: input.address || null,
        isActive: 1,
      });

      return toPublicMember(createdMember);
    }),

  // Update editable member fields in MySQL/TiDB.
  update: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(2).max(255).optional(),
        email: z.string().trim().email().max(255).optional(),
        address: z.string().trim().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...changes } = input;
      const updatedMember = await db.updateMember(id, {
        name: changes.name,
        email: changes.email,
        address: changes.address,
      });
      return toPublicMember(updatedMember);
    }),

  // Delete the member and its savings account in one transaction.
  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const deletedMember = await db.deleteMember(input.id);
      return toPublicMember(deletedMember);
    }),

  // Search members by name or mobile number.
  search: publicProcedure
    .input(z.object({ query: z.string().trim() }))
    .query(async ({ input }) => {
      const lowerQuery = input.query.toLowerCase();
      const members = await db.getAllMembers();
      return members
        .filter(
          (member) =>
            member.name.toLowerCase().includes(lowerQuery) ||
            member.mobileNumber.includes(lowerQuery),
        )
        .map(toPublicMember);
    }),

  // Get a member's savings record.
  getSavings: publicProcedure
    .input(z.object({ memberId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const savings = await db.getSavingsByMemberId(input.memberId);
      if (!savings) {
        throw new Error('Savings record not found');
      }
      return savings;
    }),

  // Record a monthly savings deposit in MySQL/TiDB.
  recordDeposit: publicProcedure
    .input(
      z.object({
        memberId: z.number().int().positive(),
        amount: z.number().positive(),
      })
    )
    .mutation(async ({ input }) => {
      const savings = await db.recordSavingsDeposit(input.memberId, input.amount);
      if (!savings) {
        throw new Error('Savings record not found');
      }
      return savings;
    }),

  // Get all members with their savings records.
  getAllWithSavings: publicProcedure.query(async () => {
    const membersWithSavings = await db.getAllMembersWithSavings();
    return membersWithSavings.map(({ savings, ...member }) => ({
      ...toPublicMember(member),
      savings,
    }));
  }),
});
