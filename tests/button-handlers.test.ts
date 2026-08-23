import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), relativePath), 'utf8');

describe('dashboard interaction wiring', () => {
  it('provides working home quick actions and logout navigation', () => {
    const source = read('app/(tabs)/index.tsx');

    expect(source).toContain("router.push('/(tabs)/members-management' as any)");
    expect(source).toContain("router.push('/(tabs)/payment-recording' as any)");
    expect(source).toContain('onPress={handleViewReports}');
    expect(source).toContain("router.replace('/auth/role-selection' as any)");
  });

  it('provides logout navigation and action feedback on both role dashboards', () => {
    const adminSource = read('app/(tabs)/admin-dashboard.tsx');
    const memberSource = read('app/(tabs)/member-dashboard.tsx');

    expect(adminSource).toContain("router.replace('/auth/role-selection' as any)");
    expect(adminSource).toContain("router.push('/(tabs)/loans-management' as any)");
    expect(memberSource).toContain("router.replace('/auth/role-selection' as any)");
    expect(memberSource).toContain('onPress={handleLoanDetails}');
    expect(memberSource).toContain('onPress={handleDownloadStatement}');
  });
});
