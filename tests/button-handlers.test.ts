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

  it('registers the actual auth route and uses absolute auth navigation paths', () => {
    const rootLayout = read('app/_layout.tsx');
    const roleSelection = read('app/auth/role-selection.tsx');
    const adminLogin = read('app/auth/admin-login.tsx');
    const memberLogin = read('app/auth/member-login.tsx');

    expect(rootLayout).toContain('<Stack.Screen name="auth" />');
    expect(roleSelection).toContain("router.push('/auth/admin-login' as any)");
    expect(roleSelection).toContain("router.push('/auth/member-login' as any)");
    expect(adminLogin).toContain("router.replace('/auth/role-selection' as any)");
    expect(memberLogin).toContain("router.replace('/auth/role-selection' as any)");
  });
});
