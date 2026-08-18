import './globals.css';

// Root layout is a pass-through. The <html lang={locale}> and <body> tags
// are rendered by the [locale]/layout.tsx so that the lang attribute matches
// the active locale. The root not-found.tsx renders its own <html> for
// non-locale routes.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
