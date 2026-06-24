import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const KEYMINT_SECRET = process.env.KEYMINT_WEBHOOK_SECRET || '';

function verifySignature(payload: string, header: string): boolean {
  const [tPart, v1Part] = header.split(',');
  const t = tPart?.substring(2);
  const v1 = v1Part?.substring(3);
  if (!t || !v1 || Math.abs(Date.now() / 1000 - parseInt(t)) > 300) return false;
  const expected = crypto
    .createHmac('sha256', KEYMINT_SECRET)
    .update(t + '.' + payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

export async function POST(req: NextRequest) {
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
