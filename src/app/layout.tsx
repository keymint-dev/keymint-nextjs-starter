import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js License Starter',
  description: 'Next.js app with Keymint license management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fafafa', color: '#111' }}>
        {children}
      </body>
    </html>
  );
}
