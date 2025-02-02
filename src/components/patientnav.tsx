'use client';  

import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter
import { useEffect, useState } from 'react'; // Import useEffect and useState
import {
  Activity,
  User,
  ChartBar,
  MessageSquare,
  Calendar,
  FileText,
  Heart,
  Bell,
} from 'lucide-react';

const PatientNavigation = () => {
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    // Using useEffect to ensure the code runs only on the client side
    const currentPath = window.location.pathname;
    const patientIdFromPath = currentPath.split('/')[2];
    setPatientId(patientIdFromPath); // Set patientId from the URL
  }, []);

  if (!patientId) return null; // You can return a loader here if needed

  const navItems = [
    { icon: Activity, label: 'Dashboard', path: '/' },
    { icon: ChartBar, label: 'Symptom Tracker', path: '/symptoms' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: MessageSquare, label: 'Health Chat', path: '/chat/124' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
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

          // Dynamically construct the correct link with the patient ID
          const linkPath = `/patient/${patientId}${item.path}`;

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

export default PatientNavigation;
