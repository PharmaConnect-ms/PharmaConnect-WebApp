'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

interface Appointment {
  id: string;
  doctor: { username: string };
  scheduledAt: string;
  reason: string;
  appointmentNo: number;
  type: 'online' | 'physical';
}

const AppointmentDashboard = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || 1;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/appointments/user/${userId}`);
        const data = await res.json();
        console.log('Fetched appointments:', data);
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => router.push('/user')} style={{ cursor: 'pointer' }}>
            user
          </Link>
          <Typography color="text.primary">Appointments</Typography>
        </Breadcrumbs>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <button
          onClick={() => router.push('/user/appointment/create')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          + New Appointment
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const isOnline = appt.type === 'online';

            const handleClick = () => {
              if (isOnline) {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const name = encodeURIComponent(user.username || 'Guest');
                router.push(`/user/meeting?id=${appt.id}&name=${name}`);
              }
            };

            return (
              <div
                key={appt.id}
                onClick={handleClick}
                className={`p-5 rounded-2xl border border-gray-200 shadow-sm bg-white ${
                  isOnline ? 'cursor-pointer hover:shadow-md transition' : ''
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Dr. {appt.doctor.username}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {format(new Date(appt.scheduledAt), 'PPPPp')}
                    </p>
                    {isOnline && (
                      <span className="mt-1 inline-block text-xs text-white bg-blue-500 px-2 py-0.5 rounded-md">
                        Online
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{appt.reason}</p>
                    <p className="text-xs text-gray-500">
                      Queue No: #{appt.appointmentNo}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentDashboard;
