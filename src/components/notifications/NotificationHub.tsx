import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationContext, NotificationType } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Bell, Calendar, CreditCard, Wrench, Home, Info, 
  CheckCheck, Trash2, Users, DollarSign, Building, Settings, FileText, 
  Loader2, AlertTriangle, TrendingDown, Zap, Filter, Star
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type PriorityLevel = "urgent" | "high" | "normal" | "low";
type TabFilter = "all" | "priority" | "property" | "maintenance" | "payment";

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

const priorityColors: Record<PriorityLevel, string> = {
  urgent: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  normal: "bg-accent text-accent-foreground",
  low: "bg-muted text-muted-foreground",
};

const priorityIcons: Record<PriorityLevel, typeof Bell> = {
  urgent: AlertTriangle,
  high: Zap,
  normal: Bell,
  low: Info,
};

// Determine priority based on notification type and content
function getPriority(notification: { type: NotificationType; title: string; message: string; data?: Record<string, unknown> }): PriorityLevel {
  const { type, title, message } = notification;
  const lowerTitle = title.toLowerCase();
  const lowerMessage = message.toLowerCase();

  // Urgent: Payment due, emergency maintenance, rejected items
  if (
    lowerTitle.includes("overdue") ||
    lowerTitle.includes("emergency") ||
    lowerMessage.includes("urgent") ||
    lowerTitle.includes("rejected") ||
    (type === "payment" && lowerMessage.includes("due"))
  ) {
    return "urgent";
  }

  // High: New matches, price changes, bookings, commissions
  if (
    type === "booking" ||
    type === "commission" ||
    lowerTitle.includes("new match") ||
    lowerTitle.includes("price") ||
    lowerTitle.includes("approved") ||
    lowerMessage.includes("price drop")
  ) {
    return "high";
  }

  // Low: System notifications, general info
  if (type === "system" || lowerTitle.includes("reminder")) {
    return "low";
  }

  return "normal";
}

// Get smart summary text for notification groups
function getGroupSummary(notifications: Array<{ type: NotificationType }>): string {
  const typeCounts: Record<string, number> = {};
  notifications.forEach(n => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });

  const parts: string[] = [];
  if (typeCounts.property) parts.push(`${typeCounts.property} property update${typeCounts.property > 1 ? "s" : ""}`);
  if (typeCounts.maintenance) parts.push(`${typeCounts.maintenance} maintenance alert${typeCounts.maintenance > 1 ? "s" : ""}`);
  if (typeCounts.payment) parts.push(`${typeCounts.payment} payment notice${typeCounts.payment > 1 ? "s" : ""}`);
  if (typeCounts.booking) parts.push(`${typeCounts.booking} booking update${typeCounts.booking > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(", ") : "No new updates";
}

interface NotificationWithPriority {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
  priority: PriorityLevel;
}

export function NotificationHub() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    clearAllNotifications 
  } = useNotificationContext();

  // Add priority to notifications
  const notificationsWithPriority: NotificationWithPriority[] = useMemo(() => {
    return notifications.map(n => ({
      ...n,
      priority: getPriority(n)
    }));
  }, [notifications]);

  // Filter notifications by tab
  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "priority":
        return notificationsWithPriority.filter(n => n.priority === "urgent" || n.priority === "high");
      case "property":
        return notificationsWithPriority.filter(n => 
          n.type === "property" || n.type === "booking" || n.type === "visit" || n.type === "lead"
        );
      case "maintenance":
        return notificationsWithPriority.filter(n => 
          n.type === "maintenance" || n.type === "service"
        );
      case "payment":
        return notificationsWithPriority.filter(n => 
          n.type === "payment" || n.type === "commission"
        );
      default:
        return notificationsWithPriority;
    }
  }, [notificationsWithPriority, activeTab]);

  // Count by priority
  const urgentCount = notificationsWithPriority.filter(n => !n.is_read && n.priority === "urgent").length;
  const highCount = notificationsWithPriority.filter(n => !n.is_read && n.priority === "high").length;

  // Get tab counts
  const tabCounts = useMemo(() => ({
    all: notifications.length,
    priority: notificationsWithPriority.filter(n => n.priority === "urgent" || n.priority === "high").length,
    property: notifications.filter(n => ["property", "booking", "visit", "lead"].includes(n.type)).length,
    maintenance: notifications.filter(n => ["maintenance", "service"].includes(n.type)).length,
    payment: notifications.filter(n => ["payment", "commission"].includes(n.type)).length,
  }), [notifications, notificationsWithPriority]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
              urgentCount > 0 ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-accent text-accent-foreground"
            }`}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 pb-2 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <div>
                <SheetTitle className="font-display">Notification Hub</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {getGroupSummary(notifications.filter(n => !n.is_read))}
                </p>
              </div>
            </div>
            <Link 
              to="/notification-settings" 
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Notification Settings"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>

          {/* Priority Alerts Banner */}
          {(urgentCount > 0 || highCount > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-lg bg-gradient-to-r from-destructive/10 to-warning/10 border border-destructive/20"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-foreground">Priority Alerts</span>
              </div>
              <div className="flex gap-2 mt-2">
                {urgentCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <Zap className="w-3 h-3" />
                    {urgentCount} Urgent
                  </Badge>
                )}
                {highCount > 0 && (
                  <Badge className="gap-1 bg-warning text-warning-foreground">
                    <Star className="w-3 h-3" />
                    {highCount} Important
                  </Badge>
                )}
              </div>
            </motion.div>
          )}
        </SheetHeader>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-border">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)}>
            <TabsList className="w-full grid grid-cols-5 h-9">
              <TabsTrigger value="all" className="text-xs gap-1">
                All
                {tabCounts.all > 0 && <span className="text-muted-foreground">({tabCounts.all})</span>}
              </TabsTrigger>
              <TabsTrigger value="priority" className="text-xs gap-1">
                <Zap className="w-3 h-3" />
                Priority
              </TabsTrigger>
              <TabsTrigger value="property" className="text-xs gap-1">
                <Building className="w-3 h-3" />
                Property
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="text-xs gap-1">
                <Wrench className="w-3 h-3" />
                Maint.
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-xs gap-1">
                <CreditCard className="w-3 h-3" />
                Payment
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Actions Bar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-border">
          <span className="text-xs text-muted-foreground">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-xs">
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAllNotifications}
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {activeTab !== "all" ? "Try checking other categories" : "You're all caught up!"}
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type] || Info;
                  const PriorityIcon = priorityIcons[notification.priority];
                  const isHighPriority = notification.priority === "urgent" || notification.priority === "high";
                  
                  return (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      transition={{ delay: index * 0.02 }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                        notification.is_read
                          ? "bg-card border-border hover:border-muted-foreground/30"
                          : isHighPriority
                            ? "bg-gradient-to-r from-destructive/5 to-warning/5 border-warning/30"
                            : "bg-accent/5 border-accent/20"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              notificationColors[notification.type] || notificationColors.system
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          {isHighPriority && !notification.is_read && (
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                              notification.priority === "urgent" ? "bg-destructive" : "bg-warning"
                            }`}>
                              <PriorityIcon className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground text-sm truncate">
                                  {notification.title}
                                </h4>
                                {!notification.is_read && (
                                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 rounded-md"
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                              {isHighPriority && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] h-5 ${
                                    notification.priority === "urgent" 
                                      ? "border-destructive/50 text-destructive" 
                                      : "border-warning/50 text-warning"
                                  }`}
                                >
                                  {notification.priority === "urgent" ? "Urgent" : "Important"}
                                </Badge>
                              )}
                            </div>
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
                                View Details →
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

        {/* Quick Actions Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                setOpen(false);
              }}
              asChild
            >
              <Link to="/notification-settings">
                <Settings className="w-4 h-4 mr-2" />
                Manage Alerts
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                setActiveTab("priority");
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Priority Only
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
