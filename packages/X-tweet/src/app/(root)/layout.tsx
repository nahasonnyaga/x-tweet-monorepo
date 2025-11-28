// src/app/(root)/layout.tsx
import '../../styles/globals.css';
import type { ReactNode } from 'react';
import { AuthContextProvider } from '@lib/context/auth-context';
import TopMenuWrapper from '../../components/ui/TopMenuWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthContextProvider>
      <html lang="en">
        <body className="bg-white text-black">
          {/* Client-only TopMenu */}
          <TopMenuWrapper />
          {children}
        </body>
      </html>
    </AuthContextProvider>
  );
}
