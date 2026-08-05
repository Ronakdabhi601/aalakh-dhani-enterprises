import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import * as db from "./db";
import { membersRouter } from "./members-router";

export const appRouter = router({
  // Health check
  health: publicProcedure.query(() => ({ status: "ok" })),

  // Admin authentication
  admin: router({
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        const admin = await db.getAdminByEmail(input.email);
        
        if (!admin) {
          throw new Error("Admin not found");
        }

        // TODO: Implement proper password verification with bcrypt
        // For demo: simple password check
        if (input.password !== "admin123") {
          throw new Error("Invalid password");
        }

        return {
          success: true,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
          },
        };
      }),
  }),

  // Member authentication
  member: router({
    login: publicProcedure
      .input(z.object({
        mobileNumber: z.string().min(10).max(10),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        const member = await db.getMemberByMobileNumber(input.mobileNumber);
        
        if (!member) {
          throw new Error("Member not found");
        }

        // TODO: Implement proper password verification with bcrypt
        // For demo: simple password check
        if (input.password !== "member123") {
          throw new Error("Invalid password");
        }

        return {
          success: true,
          member: {
            id: member.id,
            name: member.name,
            mobileNumber: member.mobileNumber,
            email: member.email,
          },
        };
      }),

    // Send OTP (demo)
    sendOTP: publicProcedure
      .input(z.object({
        mobileNumber: z.string().min(10).max(10),
      }))
      .mutation(async ({ input }) => {
        // TODO: Implement actual OTP service integration
        return {
          success: true,
          message: "OTP sent to your mobile number",
          // In demo: OTP is 123456
        };
      }),

    // Verify OTP (demo)
    verifyOTP: publicProcedure
      .input(z.object({
        mobileNumber: z.string().min(10).max(10),
        otp: z.string().length(6),
      }))
      .mutation(async ({ input }) => {
        // TODO: Implement actual OTP verification
        // For demo: accept any 6-digit OTP
        if (input.otp === "123456" || input.otp.match(/^\d{6}$/)) {
          const member = await db.getMemberByMobileNumber(input.mobileNumber);
          
          if (!member) {
            throw new Error("Member not found");
          }

          return {
            success: true,
            member: {
              id: member.id,
              name: member.name,
              mobileNumber: member.mobileNumber,
              email: member.email,
            },
          };
        }

        throw new Error("Invalid OTP");
      }),

    // Get member dashboard data
    getDashboard: publicProcedure
      .input(z.object({
        memberId: z.number(),
      }))
      .query(async ({ input }) => {
        const member = await db.getMemberById(input.memberId);
        
        if (!member) {
          throw new Error("Member not found");
        }

        const loans = await db.getLoansByMemberId(input.memberId);
        const payments = await db.getPaymentsByMemberId(input.memberId);

        return {
          member,
          loans,
          payments,
        };
      }),
  }),

  // Admin dashboard
  admin_dashboard: router({
    getMetrics: publicProcedure.query(async () => {
      const members = await db.getAllMembers();
      const loans = await db.getAllLoans();

      return {
        totalMembers: members.length,
        activeLoans: loans.filter(l => (l as any).status === "approved").length,
        todaysCollection: 0, // TODO: Calculate from payments
        monthlyCollection: 0, // TODO: Calculate from payments
        pendingInstallments: 0, // TODO: Calculate from loans
        totalOutstanding: 0, // TODO: Calculate from loans
      };
    }),
  }),

  // Members management
  members: membersRouter,
});

export type AppRouter = typeof appRouter;
