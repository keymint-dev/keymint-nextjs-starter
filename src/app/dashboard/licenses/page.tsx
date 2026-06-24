export default function LicensesPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>License Dashboard</h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Your Keymint integration is active. Licenses created via the API will appear here.
      </p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
        <strong>Next steps:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
          <li>Create a product in the <a href="https://app.keymint.dev" style={{ color: '#2563eb' }}>Keymint Dashboard</a></li>
          <li>Set your <code>KEYMINT_PRODUCT_ID</code> in <code>.env.local</code></li>
          <li>POST to <code>/api/licenses</code> to create a license</li>
          <li>Configure Keymint webhooks to point to <code>/api/webhooks/keymint</code></li>
        </ul>
      </div>
    </div>
  );
}
