// src/app/layout.tsx
import React from 'react';
import '../styles/globals.css'; // or your global styles

export const metadata = {
  title: 'X-Tweet Trending',
  description: 'Trending tweets powered by X-Tweet backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* You can add a header or nav here if needed */}
        {children}
      </body>
    </html>
  );
}
