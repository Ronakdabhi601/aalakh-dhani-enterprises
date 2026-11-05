import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Business money-in / money-out entries.
 *
 * Saved entries live only on this phone (AsyncStorage). Sample entries are
 * built-in demo data and are never written to storage.
 */

export type Direction = 'in' | 'out';

export interface EntryType {
  id: string;
  label: string;
  hint: string;
  direction: Direction;
  icon: string;
}

export const ENTRY_TYPES: EntryType[] = [
  { id: 'installment_received', label: 'આવેલો હપ્તો', hint: 'installment received', direction: 'in', icon: '₹' },
  { id: 'interest_received', label: 'આવેલ વ્યાજ', hint: 'interest received', direction: 'in', icon: '%' },
  { id: 'deduction_received', label: 'આવેલ કપાત', hint: 'deduction received', direction: 'in', icon: '−' },
  { id: 'expense', label: 'ખર્ચ', hint: 'expense', direction: 'out', icon: '↘' },
  { id: 'payment_made', label: 'ચૂકવણી', hint: 'payment made', direction: 'out', icon: '↗' },
];

export interface BusinessEntry {
  id: string;
  typeId: string;
  name: string;
  amount: number;
  /** YYYY-MM-DD */
  date: string;
  isSample?: boolean;
}

export function getEntryType(typeId: string): EntryType {
  return ENTRY_TYPES.find((t) => t.id === typeId) ?? ENTRY_TYPES[0];
}

const STORAGE_KEY = 'business.entries.v1';

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toIsoDate(d);
}

/** Demo entries shown on the screens (relative to today so totals look current). */
export function getSampleEntries(): BusinessEntry[] {
  return [
    { id: 'sample-1', typeId: 'installment_received', name: '', amount: 3500, date: isoDaysAgo(0), isSample: true },
    { id: 'sample-2', typeId: 'interest_received', name: '', amount: 1200, date: isoDaysAgo(0), isSample: true },
    { id: 'sample-3', typeId: 'deduction_received', name: '', amount: 500, date: isoDaysAgo(1), isSample: true },
  ];
}

export function sortEntries(list: BusinessEntry[]): BusinessEntry[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

export async function loadSavedEntries(): Promise<BusinessEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BusinessEntry[]) : [];
  } catch (error) {
    console.error('Failed to load business entries:', error);
    return [];
  }
}

export async function saveEntries(entries: BusinessEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Sample entries plus saved entries, newest first. */
export async function loadAllEntries(): Promise<BusinessEntry[]> {
  const saved = await loadSavedEntries();
  return sortEntries([...getSampleEntries(), ...saved]);
}

export function currentMonthKey(): string {
  return toIsoDate(new Date()).slice(0, 7);
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2026-11" -> "NOVEMBER 2026" */
export function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[Number(month) - 1].toUpperCase()} ${year}`;
}

/** "2026-11-05" -> "05/11/2026" */
export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** "05/11/2026" -> "2026-11-05", or null if the input is not a real date. */
export function parseDisplayDate(input: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return `${match[3]}-${match[2]}-${match[1]}`;
}

/** Indian digit grouping: 85000 -> "85,000", 1234567 -> "12,34,567". */
export function formatINR(value: number): string {
  const sign = value < 0 ? '-' : '';
  const digits = Math.round(Math.abs(value)).toString();
  if (digits.length <= 3) return `${sign}${digits}`;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${sign}${rest},${last3}`;
}

export function totalsFor(entries: BusinessEntry[], monthKey?: string) {
  let income = 0;
  let expense = 0;
  for (const entry of entries) {
    if (monthKey && !entry.date.startsWith(monthKey)) continue;
    if (getEntryType(entry.typeId).direction === 'in') {
      income += entry.amount;
    } else {
      expense += entry.amount;
    }
  }
  return { income, expense };
}
