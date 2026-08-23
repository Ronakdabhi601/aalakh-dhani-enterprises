/**
 * Savings Pool System Utilities
 * 
 * Each member contributes ₹1000/month to the savings pool
 * Monthly profit = Total EMI collected × 2% interest rate
 * Profit is distributed equally among all members
 */

export interface MemberSavings {
  memberId: number;
  memberName: string;
  totalSavings: number; // ₹1000 × number of months
  monthlyDeposit: number; // ₹1000
  profitEarned: number; // Total profit received
}

export interface SavingsPool {
  totalPoolAmount: number; // Sum of all members' savings
  totalEMICollected: number; // Total EMI received from all loans
  monthlyProfitRate: number; // 2% = 0.02
  totalProfitGenerated: number; // Total profit generated so far
  lastDistributionDate: string;
}

/**
 * Calculate monthly profit from EMI collections
 * Profit = Total EMI × 2%
 */
export function calculateMonthlyProfit(totalEMICollected: number): number {
  const profitRate = 0.02; // 2%
  return Math.round(totalEMICollected * profitRate * 100) / 100;
}

/**
 * Calculate the same profit share for each member.
 * Member Profit = Monthly Profit / Total Members
 */
export function calculateMemberProfitShare(
  totalMembers: number,
  monthlyProfit: number
): number {
  if (totalMembers <= 0) return 0;

  return Math.round((monthlyProfit / totalMembers) * 100) / 100;
}

/**
 * Distribute monthly profit among all members
 */
export function distributeProfitToMembers(
  members: MemberSavings[],
  monthlyProfit: number
): MemberSavings[] {
  if (members.length === 0) return members;

  const memberShare = calculateMemberProfitShare(members.length, monthlyProfit);

  return members.map(member => ({
    ...member,
    profitEarned: member.profitEarned + memberShare,
  }));
}

/**
 * Calculate total savings for a member (₹1000 × months)
 */
export function calculateTotalSavings(
  monthlyDeposit: number,
  numberOfMonths: number
): number {
  return monthlyDeposit * numberOfMonths;
}

/**
 * Get member's savings ratio in the pool
 */
export function getMemberSavingsRatio(
  memberSavings: number,
  totalPoolSavings: number
): number {
  if (totalPoolSavings === 0) return 0;
  return (memberSavings / totalPoolSavings) * 100; // Return as percentage
}

/**
 * Generate savings report for admin
 */
export interface SavingsReport {
  totalMembers: number;
  totalPoolAmount: number;
  totalEMICollected: number;
  monthlyProfit: number;
  averageSavingsPerMember: number;
  highestSavingsMember: MemberSavings | null;
  lowestSavingsMember: MemberSavings | null;
  memberDetails: MemberSavings[];
}

export function generateSavingsReport(
  members: MemberSavings[],
  totalEMICollected: number
): SavingsReport {
  const totalPoolAmount = members.reduce((sum, m) => sum + m.totalSavings, 0);
  const monthlyProfit = calculateMonthlyProfit(totalEMICollected);
  const averageSavings = members.length > 0 ? totalPoolAmount / members.length : 0;
  
  const sortedByTotal = [...members].sort((a, b) => b.totalSavings - a.totalSavings);
  
  return {
    totalMembers: members.length,
    totalPoolAmount,
    totalEMICollected,
    monthlyProfit,
    averageSavingsPerMember: Math.round(averageSavings * 100) / 100,
    highestSavingsMember: sortedByTotal[0] || null,
    lowestSavingsMember: sortedByTotal[sortedByTotal.length - 1] || null,
    memberDetails: members,
  };
}

/**
 * Calculate member's net benefit (savings + profit earned)
 */
export function calculateMemberNetBenefit(member: MemberSavings): number {
  return Math.round((member.totalSavings + member.profitEarned) * 100) / 100;
}

/**
 * Calculate return on investment (ROI) for member
 * ROI = (Profit Earned / Total Savings) × 100
 */
export function calculateMemberROI(member: MemberSavings): number {
  if (member.totalSavings === 0) return 0;
  return Math.round((member.profitEarned / member.totalSavings) * 10000) / 100; // Return as percentage
}
