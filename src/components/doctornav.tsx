'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Users, Handshake } from 'lucide-react';
import { useState, useEffect } from 'react';

const doctorNavItems = [
  { icon: Activity, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Patients', path: '/getPatients' },
  { icon: Handshake, label: 'Appointments', path: '/appointments' },
];

const DoctorNavigation = () => {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const pathname = usePathname(); // Using Next.js hook for the current path

  useEffect(() => {
    const doctorIdFromPath = pathname.split('/')[2]; // Assuming the URL format is "/doctor/{id}/..."
    setDoctorId(doctorIdFromPath);
  }, [pathname]);

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-xl font-bold text-primary">Doctor Dashboard</h1>
      </div>
      <div className="space-y-2">
        {doctorNavItems.map((item) => {
          const Icon = item.icon;
          const linkPath = doctorId
            ? `/doctor/${doctorId}${item.path}`
            : item.path;

          return (
            <Link
              key={item.path}
              href={linkPath}
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
