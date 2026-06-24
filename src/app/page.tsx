export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Next.js License Starter</h1>
      <p>
        Your Keymint licensing backend is ready. Visit{' '}
        <a href="/dashboard/licenses" style={{ color: '#2563eb' }}>
          /dashboard/licenses
        </a>{' '}
        to manage licenses.
      </p>
    </main>
  );
}
