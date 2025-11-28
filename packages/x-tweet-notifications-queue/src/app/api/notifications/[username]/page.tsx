import React, { useEffect, useState } from "react";

interface Notification {
  id: string;
  type: string;
  content: string;
  created_at: string;
}

interface Props {
  username: string;
}

export default function NotificationsPage({ username }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      const res = await fetch(`/api/notifications/${username}/route`);
      const data = await res.json();
      setNotifications(data || []);
      setLoading(false);
    }

    fetchNotifications();
  }, [username]);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      <h1>{username}'s Notifications</h1>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <strong>{n.type}</strong>: {n.content} <em>({n.created_at})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
