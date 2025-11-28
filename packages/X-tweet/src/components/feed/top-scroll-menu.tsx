'use client';
import { useState } from 'react';
import cn from 'clsx';

export type Tab = { id: string; label: string };

export const TopScrollMenu = ({
  tabs,
  onSelect,
}: {
  tabs: Tab[];
  onSelect?: (tabId: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleClick = (id: string) => {
    setActiveTab(id);
    onSelect?.(id);
  };

  return (
    <div className="overflow-x-auto scrollbar-hide border-b border-light-border dark:border-dark-border">
      <div className="flex gap-3 px-4 py-2 whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full transition-all font-medium',
              activeTab === tab.id
                ? 'bg-main-accent text-white'
                : 'text-light-secondary dark:text-dark-secondary hover:bg-light-hover dark:hover:bg-dark-hover'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
