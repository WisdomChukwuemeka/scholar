"use client";

import React from 'react';
import { toast } from 'react-toastify';
import { NotificationAPI } from '../api';
import Link from 'next/link';

// Component to render a single notification item
// Props:
// - notification: Object containing id, message, is_read, created_at, and related_publication
const NotificationItem = ({ notification }) => {
  const handleMarkRead = async () => {
    try {
      await NotificationAPI.markRead(notification.id);
      toast.success('Notification marked as read', {
        position: 'top-right',
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read', {
        position: 'top-right',
      });
    }
  };

  return (
    <div
      className={`border p-4 rounded ${
        notification.is_read ? 'bg-gray-100' : 'bg-white'
      } shadow-sm`}
    >
      <p className="text-gray-800">{notification.message}</p>
      <p className="text-sm text-gray-500">
        {new Date(notification.created_at).toLocaleString()}
      </p>
      {notification.related_publication && (
        <Link href={`/publication/${notification.related_publication}`}>
          <a className="text-blue-500 hover:underline">View Publication</a>
        </Link>
      )}
      {!notification.is_read && (
        <button
          onClick={handleMarkRead}
          className="mt-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
        >
          Mark as Read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;