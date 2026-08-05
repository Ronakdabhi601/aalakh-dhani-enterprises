import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import * as crypto from 'crypto';

// Mock database - replace with actual database calls
let membersDb: any[] = [
  {
    id: 1,
    mobileNumber: '9876543210',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    address: '123 Main Street, City',
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    mobileNumber: '9876543211',
    name: 'Priya Singh',
    email: 'priya@example.com',
    address: '456 Oak Avenue, City',
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let savingsDb: any[] = [
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
  {
    id: 2,
    memberId: 2,
    monthlyDeposit: 1000,
    totalSavings: 10000,
    profitEarned: 2000,
    lastDepositDate: new Date(),
    updatedAt: new Date(),
  },
];

export const membersRouter = router({
  // Get all members
  getAll: publicProcedure.query(async () => {
    return membersDb;
  }),

  // Get member by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const member = membersDb.find((m) => m.id === input.id);
      if (!member) {
        throw new Error('Member not found');
      }
      return member;
    }),

  // Get member by mobile number
  getByMobile: publicProcedure
    .input(z.object({ mobileNumber: z.string() }))
    .query(async ({ input }) => {
      const member = membersDb.find((m) => m.mobileNumber === input.mobileNumber);
      if (!member) {
        throw new Error('Member not found');
      }
      return member;
    }),

  // Create new member
  create: publicProcedure
    .input(
      z.object({
        mobileNumber: z.string().min(10),
        name: z.string().min(2),
        email: z.string().email().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if member already exists
      const existing = membersDb.find((m) => m.mobileNumber === input.mobileNumber);
      if (existing) {
        throw new Error('Member with this mobile number already exists');
      }

      const newMember = {
        id: Math.max(...membersDb.map((m) => m.id), 0) + 1,
        mobileNumber: input.mobileNumber,
        name: input.name,
        email: input.email || null,
        address: input.address || null,
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      membersDb.push(newMember);

      // Create savings account for new member
      const newSavings = {
        id: Math.max(...savingsDb.map((s) => s.id), 0) + 1,
        memberId: newMember.id,
        monthlyDeposit: 1000,
        totalSavings: 0,
        profitEarned: 0,
        lastDepositDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      savingsDb.push(newSavings);

      return newMember;
    }),

  // Update member
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const member = membersDb.find((m) => m.id === input.id);
      if (!member) {
        throw new Error('Member not found');
      }

      if (input.name) member.name = input.name;
      if (input.email) member.email = input.email;
      if (input.address) member.address = input.address;
      member.updatedAt = new Date();

      return member;
    }),

  // Delete member
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const index = membersDb.findIndex((m) => m.id === input.id);
      if (index === -1) {
        throw new Error('Member not found');
      }

      const deleted = membersDb.splice(index, 1)[0];

      // Also remove savings record
      const savingsIndex = savingsDb.findIndex((s) => s.memberId === input.id);
      if (savingsIndex !== -1) {
        savingsDb.splice(savingsIndex, 1);
      }

      return deleted;
    }),

  // Search members by name or mobile
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const lowerQuery = input.query.toLowerCase();
      return membersDb.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerQuery) ||
          m.mobileNumber.includes(lowerQuery)
      );
    }),

  // Get member savings
  getSavings: publicProcedure
    .input(z.object({ memberId: z.number() }))
    .query(async ({ input }) => {
      const savings = savingsDb.find((s) => s.memberId === input.memberId);
      if (!savings) {
        throw new Error('Savings record not found');
      }
      return savings;
    }),

  // Record monthly deposit
  recordDeposit: publicProcedure
    .input(
      z.object({
        memberId: z.number(),
        amount: z.number().positive(),
      })
    )
    .mutation(async ({ input }) => {
      const savings = savingsDb.find((s) => s.memberId === input.memberId);
      if (!savings) {
        throw new Error('Savings record not found');
      }

      savings.totalSavings += input.amount;
      savings.lastDepositDate = new Date();
      savings.updatedAt = new Date();

      return savings;
    }),

  // Get all members with savings
  getAllWithSavings: publicProcedure.query(async () => {
    return membersDb.map((member) => {
      const savings = savingsDb.find((s) => s.memberId === member.id);
      return {
        ...member,
        savings: savings || null,
      };
    });
  }),
});
