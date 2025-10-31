// This file is required by the Next.js App Router to define the root layout
// for the entire application. It ensures every page has the necessary <html> and <body> tags.

import './globals.css'; // Import the global Tailwind CSS file

/**
 * RootLayout is a required component in the Next.js App Router structure.
 * It wraps all pages and includes the necessary HTML structure (html, body).
 *
 * @param children - The page content or nested layout content.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define metadata for the document head
  const metadata = {
    title: 'AfroDex Frontend',
    description: 'AfroDex Decentralized Exchange (DEX) User Interface',
  };

  return (
    <html lang="en">
      <head>
        {/* Set the document title and description using the metadata object */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Ensure responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      {/* The body tag should apply global styling (e.g., using Tailwind classes).
        The Inter font is the Next.js default, but you can configure a custom one here.
      */}
      <body className={`min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
