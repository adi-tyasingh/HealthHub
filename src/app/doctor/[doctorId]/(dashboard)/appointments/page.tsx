import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const appointments = [
  {
    id: 1,
    date: '2024-02-15',
    time: '10:00 AM',
    info: {
      Symptoms: {
        Fever: 'severe',
        Headache: 'severe',
        Chills: 'severe'
      },
      Duration: '3 days',
      consumed_substances: false,
      Notes: []
    }
  },
  {
    id: 2,
    date: '2024-02-16',
    time: '1:00 PM',
    info: {
      Symptoms: {
        nausea: 8,
        vomiting: 8,
        'stomach ache': 10
      },
      Duration: '1 day',
      consumed_substances: false,
      Notes: []
    }
  }
];

// Function to convert numeric severity to text
const getSeverityText = (value) => {
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1); // Capitalize the first letter
  }
  if (value >= 8) return 'High';
  if (value >= 5) return 'Moderate';
  return 'Low';
};

const Page = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor's Appointments</h1>
      <div className="space-y-4 w-full max-w-2xl">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-4 shadow-md rounded-2xl">
            <CardContent>
              <div className="mb-2">
                <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Symptoms</h3>
                <ul className="space-y-1">
                  {Object.entries(appointment.info.Symptoms).map(([symptom, severity], index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{symptom}</span>
                      <Badge variant={
                        getSeverityText(severity) === 'High' ? 'destructive' :
                        getSeverityText(severity) === 'Moderate' ? 'warning' : 
                        'default'
                      }>
                        {getSeverityText(severity)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
