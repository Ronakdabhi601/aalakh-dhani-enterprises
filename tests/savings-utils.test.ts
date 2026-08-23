import { describe, expect, it } from "vitest";

import {
  calculateMemberProfitShare,
  calculateMonthlyProfit,
  distributeProfitToMembers,
  type MemberSavings,
} from "../lib/savings-utils";

const members: MemberSavings[] = [
  {
    memberId: 1,
    memberName: "Member One",
    totalSavings: 12000,
    monthlyDeposit: 1000,
    profitEarned: 0,
  },
  {
    memberId: 2,
    memberName: "Member Two",
    totalSavings: 1000,
    monthlyDeposit: 1000,
    profitEarned: 10,
  },
  {
    memberId: 3,
    memberName: "Member Three",
    totalSavings: 0,
    monthlyDeposit: 1000,
    profitEarned: 25,
  },
];

describe("equal savings-pool profit distribution", () => {
  it("divides monthly profit by the member count", () => {
    expect(calculateMonthlyProfit(45000)).toBe(900);
    expect(calculateMemberProfitShare(45, 900)).toBe(20);
  });

  it("gives every member the same share regardless of savings", () => {
    const distributed = distributeProfitToMembers(members, 900);

    expect(distributed.map((member) => member.profitEarned)).toEqual([300, 310, 325]);
  });

  it("returns zero for an empty member count", () => {
    expect(calculateMemberProfitShare(0, 900)).toBe(0);
    expect(distributeProfitToMembers([], 900)).toEqual([]);
  });
});
