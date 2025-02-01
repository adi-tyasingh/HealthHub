'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, Activity } from 'lucide-react';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';

// Interfaces
interface PatientData {
  labels: string[];
  values: number[];
}

interface Appointment {
  id: number;
  patient: string;
  time: string;
  type: AppointmentType;
}

interface StatsCard {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
}

// Type definitions
type AppointmentType = 'Check-up' | 'Follow-up' | 'Consultation';

const DoctorDashboard: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Sample data with types
  const patientData: PatientData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [45, 52, 49, 63, 58, 64]
  };

  const upcomingAppointments: Appointment[] = [
    { id: 1, patient: 'Sarah Johnson', time: '09:00 AM', type: 'Check-up' },
    { id: 2, patient: 'Michael Chen', time: '10:30 AM', type: 'Follow-up' },
    { id: 3, patient: 'Emma Davis', time: '02:00 PM', type: 'Consultation' },
    { id: 4, patient: 'Robert Wilson', time: '03:30 PM', type: 'Check-up' }
  ];

  const statsCards: StatsCard[] = [
    {
      title: 'Total Patients',
      value: '1,284',
      subtext: '+12% from last month',
      icon: <Users className="h-4 w-4 text-gray-500" />
    },
    {
      title: "Today's Appointments",
      value: '8',
      subtext: '2 pending confirmations',
      icon: <Calendar className="h-4 w-4 text-gray-500" />
    },
    {
      title: 'Average Daily Load',
      value: '6.2',
      subtext: 'patients per day',
      icon: <Activity className="h-4 w-4 text-gray-500" />
    }
  ];

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chartData: ChartData = {
      labels: patientData.labels,
      datasets: [{
        label: 'Number of Patients',
        data: patientData.values,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    chartInstance.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const formatDate = (): string => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-gray-600">{formatDate()}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat: StatsCard, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] relative">
              <canvas ref={chartRef} />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment: Appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="text-sm text-gray-600">{appointment.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;