import { NextRequest, NextResponse } from 'next/server';
import { createCustomerLicense } from '@/lib/license-service';
import { hasBearerSecret } from '@/lib/require-secret';

/**
 * Creates a license with your Keymint ADMIN key, so it must never be public.
 * Call it from your own backend with `Authorization: Bearer $LICENSE_API_SECRET`.
 * In a real app, create licenses from your payment provider's webhook (after
 * a successful checkout) instead of exposing a route like this.
 */
export async function POST(req: NextRequest) {
  if (!process.env.LICENSE_API_SECRET) {
    return NextResponse.json({ error: 'LICENSE_API_SECRET is not set' }, { status: 503 });
  }
  if (!hasBearerSecret(req.headers.get('authorization'), process.env.LICENSE_API_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { customerEmail?: unknown; customerName?: unknown; maxActivations?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const customerEmail = typeof body.customerEmail === 'string' ? body.customerEmail.trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || customerEmail.length > 254) {
    return NextResponse.json({ error: 'A valid customerEmail is required' }, { status: 400 });
  }
  const customerName =
    typeof body.customerName === 'string' && body.customerName.trim() ? body.customerName.trim().slice(0, 100) : customerEmail;
  const maxActivations = body.maxActivations ?? 1;
  if (!Number.isInteger(maxActivations) || (maxActivations as number) < 1 || (maxActivations as number) > 100) {
    return NextResponse.json({ error: 'maxActivations must be an integer from 1 to 100' }, { status: 400 });
  }

  try {
    const license = await createCustomerLicense({ customerEmail, customerName, maxActivations: maxActivations as number });
    return NextResponse.json({ success: true, licenseKey: license.key });
  } catch (error) {
    // Log the detail server-side; don't echo admin-client errors to callers.
    console.error('License creation failed:', error);
    return NextResponse.json({ error: 'Failed to create license' }, { status: 500 });
  }
}
