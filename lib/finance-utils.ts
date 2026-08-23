/**
 * Finance Utilities for Aalakh Dhani Enterprises
 * Handles all financial calculations including EMI, interest, and loan management
 */

export interface LoanDetails {
  loanId: string;
  memberId: string;
  loanAmount: number;
  loanDuration: number; // in months (6, 12, 18, or 24)
  monthlyInterestRate: number; // percentage (default: 2%)
  startDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
}

export interface PaymentSchedule {
  month: number;
  dueDate: Date;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  isPaid: boolean;
  paidDate?: Date;
  paidAmount?: number;
}

export interface LoanCalculations {
  loanAmount: number;
  loanDuration: number;
  monthlyInterestRate: number;
  totalInterest: number;
  totalPayable: number;
  monthlyEMI: number;
  paymentSchedule: PaymentSchedule[];
}

/**
 * Calculate EMI (Equated Monthly Installment) using the standard formula
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where P = Principal, r = monthly interest rate, n = number of months
 */
export function calculateEMI(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  const monthlyRateDecimal = monthlyRate / 100;
  const numerator =
    principal * monthlyRateDecimal * Math.pow(1 + monthlyRateDecimal, months);
  const denominator = Math.pow(1 + monthlyRateDecimal, months) - 1;
  const emi = numerator / denominator;
  return Math.round(emi * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate total interest for a loan
 */
export function calculateTotalInterest(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  const emi = calculateEMI(principal, monthlyRate, months);
  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;
  return Math.round(totalInterest * 100) / 100;
}

/**
 * Calculate total payable amount for a loan
 */
export function calculateTotalPayable(
  principal: number,
  monthlyRate: number,
  months: number
): number {
  const emi = calculateEMI(principal, monthlyRate, months);
  const totalPayable = emi * months;
  return Math.round(totalPayable * 100) / 100;
}

/**
 * Generate complete payment schedule for a loan
 */
export function generatePaymentSchedule(
  loanAmount: number,
  loanDuration: number,
  monthlyInterestRate: number,
  startDate: Date
): PaymentSchedule[] {
  const emi = calculateEMI(loanAmount, monthlyInterestRate, loanDuration);
  const schedule: PaymentSchedule[] = [];
  let remainingBalance = loanAmount;

  for (let month = 1; month <= loanDuration; month++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + month);

    const monthlyRateDecimal = monthlyInterestRate / 100;
    const interestAmount = Math.round(remainingBalance * monthlyRateDecimal * 100) / 100;
    const principalAmount = Math.round((emi - interestAmount) * 100) / 100;
    remainingBalance = Math.round((remainingBalance - principalAmount) * 100) / 100;

    // Ensure last payment covers any rounding differences
    if (month === loanDuration && remainingBalance < 0) {
      remainingBalance = 0;
    }

    schedule.push({
      month,
      dueDate,
      emiAmount: emi,
      principalAmount,
      interestAmount,
      remainingBalance: Math.max(0, remainingBalance),
      isPaid: false,
    });
  }

  return schedule;
}

/**
 * Calculate remaining balance after a payment
 */
export function calculateRemainingBalance(
  schedule: PaymentSchedule[],
  paidUpToMonth: number
): number {
  if (paidUpToMonth <= 0) return schedule[0]?.remainingBalance || 0;
  if (paidUpToMonth >= schedule.length) return 0;
  return schedule[paidUpToMonth - 1]?.remainingBalance || 0;
}

/**
 * Calculate total amount paid so far
 */
export function calculateTotalPaid(
  schedule: PaymentSchedule[],
  payments: Array<{ month: number; amount: number }>
): number {
  return payments.reduce((total, payment) => total + payment.amount, 0);
}

/**
 * Calculate overdue amount
 */
export function calculateOverdueAmount(
  schedule: PaymentSchedule[],
  currentDate: Date
): number {
  let overdueAmount = 0;

  for (const payment of schedule) {
    if (!payment.isPaid && payment.dueDate < currentDate) {
      overdueAmount += payment.emiAmount;
    }
  }

  return Math.round(overdueAmount * 100) / 100;
}

/**
 * Get next payment due date
 */
export function getNextPaymentDueDate(
  schedule: PaymentSchedule[],
  currentDate: Date
): Date | null {
  for (const payment of schedule) {
    if (!payment.isPaid) {
      return payment.dueDate;
    }
  }
  return null;
}

/**
 * Calculate days until payment is due
 */
export function getDaysUntilDue(dueDate: Date, currentDate: Date = new Date()): number {
  const timeDiff = dueDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

/**
 * Check if a payment is overdue
 */
export function isPaymentOverdue(dueDate: Date, currentDate: Date = new Date()): boolean {
  return currentDate > dueDate;
}

/**
 * Generate complete loan calculations
 */
export function generateLoanCalculations(
  loanAmount: number,
  loanDuration: number,
  monthlyInterestRate: number = 2,
  startDate: Date = new Date()
): LoanCalculations {
  const monthlyEMI = calculateEMI(loanAmount, monthlyInterestRate, loanDuration);
  const totalInterest = calculateTotalInterest(
    loanAmount,
    monthlyInterestRate,
    loanDuration
  );
  const totalPayable = calculateTotalPayable(
    loanAmount,
    monthlyInterestRate,
    loanDuration
  );
  const paymentSchedule = generatePaymentSchedule(
    loanAmount,
    loanDuration,
    monthlyInterestRate,
    startDate
  );

  return {
    loanAmount,
    loanDuration,
    monthlyInterestRate,
    totalInterest,
    totalPayable,
    monthlyEMI,
    paymentSchedule,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = '₹'): string {
  return `${currency} ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date, locale: string = 'en-IN'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Validate loan parameters
 */
export function validateLoanParameters(
  loanAmount: number,
  loanDuration: number,
  maxMembers: number = 50
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (loanAmount <= 0) {
    errors.push('Loan amount must be greater than 0');
  }

  if (![6, 12, 18, 24].includes(loanDuration)) {
    errors.push('Loan duration must be 6, 12, 18, or 24 months');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate collection statistics
 */
export interface CollectionStats {
  totalCollected: number;
  totalOutstanding: number;
  totalOverdue: number;
  numberOfPayments: number;
  averagePayment: number;
}

export function calculateCollectionStats(
  schedule: PaymentSchedule[],
  currentDate: Date = new Date()
): CollectionStats {
  let totalCollected = 0;
  let totalOutstanding = 0;
  let totalOverdue = 0;
  let numberOfPayments = 0;

  for (const payment of schedule) {
    if (payment.isPaid) {
      totalCollected += payment.paidAmount || payment.emiAmount;
      numberOfPayments++;
    } else {
      totalOutstanding += payment.emiAmount;
      if (isPaymentOverdue(payment.dueDate, currentDate)) {
        totalOverdue += payment.emiAmount;
      }
    }
  }

  return {
    totalCollected: Math.round(totalCollected * 100) / 100,
    totalOutstanding: Math.round(totalOutstanding * 100) / 100,
    totalOverdue: Math.round(totalOverdue * 100) / 100,
    numberOfPayments,
    averagePayment:
      numberOfPayments > 0
        ? Math.round((totalCollected / numberOfPayments) * 100) / 100
        : 0,
  };
}
