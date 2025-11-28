// src/app/trending/layout.tsx
import React from 'react';

export default function TrendingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Trending</h1>
      {children}
    </div>
  );
}
