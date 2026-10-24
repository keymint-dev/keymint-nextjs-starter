import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const KEYMINT_SECRET = process.env.KEYMINT_WEBHOOK_SECRET || '';

function verifySignature(payload: string, header: string): boolean {
  const [tPart, v1Part] = header.split(',');
  const t = tPart?.startsWith('t=') ? tPart.substring(2) : '';
  const v1 = v1Part?.startsWith('v1=') ? v1Part.substring(3) : '';
  if (!t || !v1 || Math.abs(Date.now() / 1000 - parseInt(t, 10)) > 300) return false;
  const expected = crypto
    .createHmac('sha256', KEYMINT_SECRET)
    .update(t + '.' + payload)
    .digest('hex');
  // timingSafeEqual throws on different lengths; a wrong-length signature is just invalid.
  if (expected.length !== v1.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

export async function POST(req: NextRequest) {
  // Without a secret, any sender could compute a "valid" signature.
  if (!KEYMINT_SECRET) {
    return NextResponse.json({ error: 'KEYMINT_WEBHOOK_SECRET is not set' }, { status: 503 });
  }
  const payload = await req.text();
  const sig = req.headers.get('keymint-signature');

  if (!sig || !verifySignature(payload, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(payload);
  console.log(`Webhook received: ${event.type}`, {
    resourceType: event.resource_type,
    resourceId: event.resource_id,
  });

  // Handle events here — sync to your database, trigger emails, etc.
  // event.type examples: license.created, device.activated, customer.created

  return NextResponse.json({ received: true });
}
