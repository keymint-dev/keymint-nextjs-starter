import { KeyMint } from 'keymint';

const BASE_URL = process.env.KEYMINT_BASE_URL || 'https://api.keymint.dev';
const PRODUCT_ID = process.env.KEYMINT_PRODUCT_ID || '';

function adminClient() {
  const apiKey = process.env.KEYMINT_ADMIN_API_KEY || '';
  if (!apiKey) throw new Error('KEYMINT_ADMIN_API_KEY is not set');
  return new KeyMint(apiKey, BASE_URL);
}

function clientClient() {
  const apiKey = process.env.KEYMINT_CLIENT_API_KEY || '';
  if (!apiKey) throw new Error('KEYMINT_CLIENT_API_KEY is not set');
  return new KeyMint(apiKey, BASE_URL);
}

function requireProduct() {
  if (!PRODUCT_ID) throw new Error('KEYMINT_PRODUCT_ID is not set');
  return PRODUCT_ID;
}

export interface CreateLicenseParams {
  customerEmail: string;
  customerName: string;
  maxActivations?: number;
  expiryDate?: string;
}

export async function createCustomerLicense(params: CreateLicenseParams) {
  const res = await adminClient().createKey({
    productId: requireProduct(),
    maxActivations: `${params.maxActivations ?? 1}`,
    licenseType: 'node-locked',
    expiryDate: params.expiryDate,
    newCustomer: {
      name: params.customerName,
      email: params.customerEmail,
    },
  });
  return res;
}

export async function blockLicense(licenseKey: string) {
  return adminClient().blockKey({ productId: requireProduct(), licenseKey });
}

export async function unblockLicense(licenseKey: string) {
  return adminClient().unblockKey({ productId: requireProduct(), licenseKey });
}

export async function getLicenseInfo(licenseKey: string) {
  return adminClient().getKey({ productId: requireProduct(), licenseKey });
}

export async function validateLicense(licenseKey: string, hostId: string) {
  return clientClient().activateKey({ productId: requireProduct(), licenseKey, hostId });
}
