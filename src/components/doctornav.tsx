'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Users, UserPlus } from 'lucide-react';

const doctorNavItems = [
  { icon: Activity, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Patients', path: '/getPatients' },
  { icon: UserPlus, label: 'Add Patients', path: '/add-patients' },
];

const DoctorNavigation = () => {
  const path = usePathname();
  console.log(path);

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-xl font-bold text-primary">Doctor Dashboard</h1>
      </div>
      <div className="space-y-2">
        {doctorNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={
                path.match(/^\/doctor\/([^/]+)\/dashboard$/) // Match "/doctor/{id}/dashboard"
                  ? path.replace("/dashboard", "/getPatients") // Replace "dashboard" with "getPatients"
                  : `${path === "/" ? "" : path}${item.path}`
              }
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

export default DoctorNavigation;
