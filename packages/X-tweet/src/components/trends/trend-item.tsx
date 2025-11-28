import React from "react";

interface TrendItemProps {
  name: string;
  tweet_volume?: number | null;
  url?: string;
}

export const TrendItem: React.FC<TrendItemProps> = ({
  name,
  tweet_volume,
  url,
}) => {
  return (
    <div className="flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-2xl transition">
      <a
        href={url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-sm text-blue-600 hover:underline"
      >
        {name}
      </a>
      <span className="text-xs text-gray-500">
        {tweet_volume ? `${tweet_volume.toLocaleString()} tweets` : "No data"}
      </span>
    </div>
  );
};
