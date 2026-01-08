import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationContext, NotificationType } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Bell, Calendar, CreditCard, Wrench, Home, Info, 
  CheckCheck, Trash2, Users, DollarSign, Building, Settings, FileText, Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const notificationIcons: Record<NotificationType, typeof Bell> = {
  visit: Calendar,
  booking: Home,
  maintenance: Wrench,
  payment: CreditCard,
  system: Info,
  lead: Users,
  commission: DollarSign,
  property: Building,
  service: Settings,
  agreement: FileText,
};

const notificationColors: Record<NotificationType, string> = {
  visit: "bg-accent text-accent-foreground",
  booking: "bg-success/20 text-success",
  maintenance: "bg-warning/20 text-warning",
  payment: "bg-primary/20 text-primary",
  system: "bg-muted text-muted-foreground",
  lead: "bg-blue-500/20 text-blue-600",
  commission: "bg-emerald-500/20 text-emerald-600",
  property: "bg-purple-500/20 text-purple-600",
  service: "bg-orange-500/20 text-orange-600",
  agreement: "bg-indigo-500/20 text-indigo-600",
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    clearAllNotifications 
  } = useNotificationContext();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="font-display">Notifications</SheetTitle>
              <Link 
                to="/notification-settings" 
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
                title="Notification Settings"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllNotifications}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AnimatePresence>
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type] || Info;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer group ${
                        notification.is_read
                          ? "bg-card border-border"
                          : "bg-accent/5 border-accent/20"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notificationColors[notification.type] || notificationColors.system
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-foreground text-sm">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.is_read && (
                                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                            {notification.action_url && (
                              <Link
                                to={notification.action_url}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                  setOpen(false);
                                }}
                                className="text-xs text-accent font-medium hover:underline"
                              >
                                View Details
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
