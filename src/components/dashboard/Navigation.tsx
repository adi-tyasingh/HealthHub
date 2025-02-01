import { Link } from "react-router-dom";
import {
  Activity,
  User,
  ChartBar,
  MessageSquare,
  Calendar,
  FileText,
  Heart,
  Bell,
} from "lucide-react";

const Navigation = () => {
  const navItems = [
    { icon: Activity, label: "Dashboard", path: "/" },
    { icon: ChartBar, label: "Symptom Tracker", path: "/symptoms" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Heart, label: "Lifestyle", path: "/lifestyle" },
    { icon: MessageSquare, label: "Health Chat", path: "/chat" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold text-primary">HealthDash</h1>
      </div>
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;