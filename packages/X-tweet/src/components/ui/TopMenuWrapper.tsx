'use client';
import TopMenu from './TopMenu.client';

export default function TopMenuWrapper() {
  // userId can be passed here if you have auth context
  return <TopMenu userId={undefined} />;
}
