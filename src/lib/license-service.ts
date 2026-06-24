const API_BASE = 'https://api.keymint.dev';
const ADMIN_API_KEY = process.env.KEYMINT_ADMIN_API_KEY || '';
const PRODUCT_ID = process.env.KEYMINT_PRODUCT_ID || '';
const CLIENT_API_KEY = process.env.KEYMINT_CLIENT_API_KEY || '';

const headers = () => ({
  Authorization: `Bearer ${ADMIN_API_KEY}`,
  'Content-Type': 'application/json',
});

export interface CreateLicenseParams {
  customerEmail: string;
  customerName: string;
  maxActivations?: number;
  expiryDate?: string;
}

export async function createCustomerLicense(params: CreateLicenseParams) {
  const response = await fetch(`${API_BASE}/key`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      productId: PRODUCT_ID,
      maxActivations: `${params.maxActivations ?? 1}`,
      licenseType: 'node-locked',
      expiryDate: params.expiryDate,
      newCustomer: {
        name: params.customerName,
        email: params.customerEmail,
      },
    }),
  });
  return response.json();
}

export async function blockLicense(licenseKey: string) {
  const response = await fetch(`${API_BASE}/key/block`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ productId: PRODUCT_ID, licenseKey }),
  });
  return response.json();
}

export async function unblockLicense(licenseKey: string) {
  const response = await fetch(`${API_BASE}/key/unblock`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ productId: PRODUCT_ID, licenseKey }),
  });
  return response.json();
}

export async function getLicenseInfo(licenseKey: string) {
  const response = await fetch(
    `${API_BASE}/key?productId=${encodeURIComponent(PRODUCT_ID)}&licenseKey=${encodeURIComponent(licenseKey)}`,
    { headers: headers() },
  );
  return response.json();
}

export async function validateLicense(licenseKey: string, hostId: string) {
  const response = await fetch(`${API_BASE}/key/activate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIENT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId: PRODUCT_ID, licenseKey, hostId }),
  });
  return response.json();
}
