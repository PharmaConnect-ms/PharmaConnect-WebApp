/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const AppointmentBooking = () => {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState<'physical' | 'online'>('physical');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !date || !reason.trim()) {
      setDialogMessage('Please fill all the fields');
      setIsSuccess(false);
      setDialogOpen(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || 1;

    const scheduledAt = new Date(date).toISOString();

    try {
      const res = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          scheduledAt,
          type,
          reason,
          patientId: userId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to book');
      }

      setDialogMessage('Appointment booked successfully!');
      setIsSuccess(true);
      setDialogOpen(true);
    } catch (err: any) {
      setDialogMessage(err.message || 'Something went wrong');
      setIsSuccess(false);
      setDialogOpen(true);
      //after 2 sec router push 
      setTimeout(() => {
        router.push('/user/appointment');
      }, 2000);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (isSuccess) {
      router.push('/user/appointment');
    }
  };

  const doctors = [{ id: '3', name: 'Dr. Dineth Chamara' }];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Doctor Selection */}
        <div>
          <label className="block mb-2 text-sm font-medium">Select Doctor</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-2 text-sm font-medium">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
          />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block mb-2 text-sm font-medium">Appointment Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded-xl font-medium border ${
                type === 'physical'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => setType('physical')}
            >
              Physical
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-xl font-medium border ${
                type === 'online'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => setType('online')}
            >
              Online
            </button>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block mb-2 text-sm font-medium">Reason for Appointment</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3"
            rows={4}
            placeholder="Describe your symptoms or reason"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition"
        >
          Confirm Appointment
        </button>
      </form>

      {/* MUI Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isSuccess ? 'Success' : 'Error'}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentBooking;
