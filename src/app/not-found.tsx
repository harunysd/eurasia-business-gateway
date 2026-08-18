// Global 404 fallback, shown when no locale can be inferred (e.g. a path
// that does not match any locale prefix). Kept intentionally in English with
// no chrome so it works without the next-intl provider.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B1D3A',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          padding: '0 1rem',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '10rem',
              fontWeight: 800,
              lineHeight: 1,
              color: '#169AA5',
              margin: 0,
            }}
          >
            404
          </p>
          <h1
            style={{
              marginTop: '1rem',
              fontSize: '1.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fff',
            }}
          >
            Page not found
          </h1>
          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '2rem',
              border: '2px solid #fff',
              padding: '1rem 2rem',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
            }}
          >
            Back to Home
          </a>
        </div>
      </body>
    </html>
  );
}
