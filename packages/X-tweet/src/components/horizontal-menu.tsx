'use client';

import { FC } from 'react';
import cn from 'clsx';

interface HorizontalMenuProps {
  activeIndex: number;
}

const menuItems = ['For you', 'Trending', 'News', 'Sports', 'Entertainment'];

const HorizontalMenu: FC<HorizontalMenuProps> = ({ activeIndex }) => {
  return (
    <div className="bg-main-background border-b border-light-border dark:border-dark-border flex gap-4 px-4 py-2 overflow-x-auto whitespace-nowrap">
      {menuItems.map((item, idx) => (
        <button
          key={idx}
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium hover:bg-light-hover dark:hover:bg-dark-hover',
            idx === activeIndex ? 'bg-main-accent text-white' : 'text-light-secondary dark:text-dark-secondary'
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default HorizontalMenu;
