import { NextRequest, NextResponse } from 'next/server';
import { createCustomerLicense } from '@/lib/license-service';

export async function POST(req: NextRequest) {
  try {
    const { customerEmail, customerName, maxActivations } = await req.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'customerEmail is required' },
        { status: 400 },
      );
    }

    const license = await createCustomerLicense({
      customerEmail,
      customerName: customerName || customerEmail,
      maxActivations: maxActivations ?? 1,
    });

    return NextResponse.json({ success: true, licenseKey: license.key });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create license' },
      { status: 500 },
    );
  }
}
