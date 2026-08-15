import { Platform } from 'react-native';
import type { PurchasesOffering, CustomerInfo } from 'react-native-purchases';
import { env, isPurchasesConfigured } from './env';

export const ENTITLEMENT_ID = 'premium';
export type { PurchasesOffering, CustomerInfo };

/**
 * RevenueCat is a native module, so it isn't present in Expo Go. Loading it
 * lazily keeps the whole app runnable there — the paywall just explains that
 * purchases need a development build instead of crashing on launch.
 */
type PurchasesModule = typeof import('react-native-purchases').default;

let cached: PurchasesModule | null | undefined;

function getPurchases(): PurchasesModule | null {
  if (cached !== undefined) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-purchases');
    cached = (mod.default ?? mod) as PurchasesModule;
  } catch {
    cached = null;
  }
  return cached;
}

/** True when a real purchase can actually be made on this build. */
export function purchasesAvailable(): boolean {
  return isPurchasesConfigured && Platform.OS === 'ios' && getPurchases() !== null;
}

export function initPurchases() {
  if (!purchasesAvailable()) return;
  try {
    getPurchases()!.configure({ apiKey: env.revenueCatIosKey });
  } catch {
    cached = null;
  }
}

export async function getOffering(): Promise<PurchasesOffering | null> {
  if (!purchasesAvailable()) return null;
  try {
    const offerings = await getPurchases()!.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export function hasPremium(info: CustomerInfo | null): boolean {
  return Boolean(info?.entitlements.active[ENTITLEMENT_ID]);
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!purchasesAvailable()) return null;
  try {
    return await getPurchases()!.getCustomerInfo();
  } catch {
    return null;
  }
}

export async function purchasePackageId(packageId: string): Promise<CustomerInfo | null> {
  const p = getPurchases();
  if (!purchasesAvailable() || !p) throw new Error('Purchases need a development build.');
  const offering = await getOffering();
  const pkg = offering?.availablePackages.find((x) => x.identifier === packageId);
  if (!pkg) throw new Error('That plan is not available right now.');
  const { customerInfo } = await p.purchasePackage(pkg);
  return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (!purchasesAvailable()) return null;
  return getPurchases()!.restorePurchases();
}

/** Ties the RevenueCat identity to the Supabase user so entitlements survive reinstall. */
export async function identify(userId: string) {
  if (!purchasesAvailable()) return;
  try {
    await getPurchases()!.logIn(userId);
  } catch {
    // Non-fatal: entitlements still resolve from the store account.
  }
}

export async function logOutPurchases() {
  if (!purchasesAvailable()) return;
  try {
    await getPurchases()!.logOut();
  } catch {
    // Non-fatal.
  }
}
