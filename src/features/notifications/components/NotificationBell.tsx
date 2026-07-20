import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, CheckCheck } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "../../../hooks/useNotifications";
import { toast } from "sonner";

export default function NotificationBell() {
  const { user } = useAuth();
  const userId = user?.id || "";

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useNotifications(userId);
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markReadMutation.mutate({ id, userId });
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(userId, {
      onSuccess: () => toast.success("All notifications marked as read."),
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate({ id, userId });
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-gray-100 bg-white p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-2xs font-extrabold text-emerald-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-2xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-gray-400">
                No notifications right now.
              </div>
            ) : (
              notifications.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className={`pt-2.5 flex items-start justify-between gap-3 p-2 rounded-xl transition-colors ${
                    item.read ? "bg-white" : "bg-emerald-50/40"
                  }`}
                >
                  <div className="flex-1 space-y-0.5">
                    <span className="text-xs font-extrabold text-gray-900 block leading-tight">
                      {item.title}
                    </span>
                    <p className="text-2xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-3xs text-gray-400 block pt-0.5">
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    {!item.read && (
                      <button
                        onClick={(e) => handleMarkRead(item.id, e)}
                        title="Mark read"
                        className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-md cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Delete"
                      className="p-1 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
