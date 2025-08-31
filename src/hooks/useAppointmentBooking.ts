'use client';
import { useState, useMemo, useCallback } from 'react';
import { TimeSlotInterface, TimeSlotStatus } from '@/types/time-slots';
import { AppointmentSlot } from '@/types/appointment-booking';

interface UseAppointmentBookingProps {
  timeSlots?: TimeSlotInterface[];
}

export interface AppointmentBookingStats {
  total: number;
  available: number;
  booked: number;
  completed: number;
  cancelled: number;
  noShow: number;
  utilizationRate: number;
  availabilityRate: number;
  completionRate: number;
}

export const useAppointmentBooking = ({ timeSlots }: UseAppointmentBookingProps) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Transform time slots into appointment slots
  const appointmentSlots = useMemo((): AppointmentSlot[] => {
    if (!timeSlots || timeSlots.length === 0) {
      return [];
    }

    return timeSlots.map((slot, index) => ({
      ...slot,
      slotLabel: `Appointment Slot ${index + 1}`,
      slotPosition: index + 1,
      isBookable: slot.status === TimeSlotStatus.AVAILABLE,
      patientName: slot.appointment?.patient?.username,
      appointmentType: slot.appointment?.type
    }));
  }, [timeSlots]);

  // Calculate comprehensive statistics
  const stats = useMemo((): AppointmentBookingStats => {
    const total = appointmentSlots.length;
    const available = appointmentSlots.filter(slot => slot.status === TimeSlotStatus.AVAILABLE).length;
    const booked = appointmentSlots.filter(slot => slot.status === TimeSlotStatus.BOOKED).length;
    const completed = appointmentSlots.filter(slot => slot.status === TimeSlotStatus.COMPLETED).length;
    const cancelled = appointmentSlots.filter(slot => slot.status === TimeSlotStatus.CANCELLED).length;
    const noShow = appointmentSlots.filter(slot => slot.status === TimeSlotStatus.NO_SHOW).length;

    const utilizationRate = total > 0 ? ((booked + completed) / total) * 100 : 0;
    const availabilityRate = total > 0 ? (available / total) * 100 : 0;
    const totalAppointments = booked + completed + cancelled + noShow;
    const completionRate = totalAppointments > 0 ? (completed / totalAppointments) * 100 : 0;

    return {
      total,
      available,
      booked,
      completed,
      cancelled,
      noShow,
      utilizationRate,
      availabilityRate,
      completionRate
    };
  }, [appointmentSlots]);

  // Get selected slot
  const selectedSlot = useMemo(() => {
    if (!selectedSlotId) return null;
    return appointmentSlots.find(slot => slot.id === selectedSlotId) || null;
  }, [selectedSlotId, appointmentSlots]);

  // Utility functions
  const selectSlot = useCallback((slotId: string) => {
    setSelectedSlotId(slotId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSlotId(null);
  }, []);

  const getAvailableSlots = useCallback(() => {
    return appointmentSlots.filter(slot => slot.isBookable);
  }, [appointmentSlots]);

  const getSlotsByStatus = useCallback((status: TimeSlotStatus) => {
    return appointmentSlots.filter(slot => slot.status === status);
  }, [appointmentSlots]);

  const getSlotsByTimeRange = useCallback((startTime: string, endTime: string) => {
    return appointmentSlots.filter(slot => 
      slot.startTime >= startTime && slot.endTime <= endTime
    );
  }, [appointmentSlots]);

  const bookAppointmentSlot = useCallback(async (
    slot: AppointmentSlot, 
    bookingHandler: (slot: AppointmentSlot) => Promise<void>
  ) => {
    if (!slot.isBookable) return false;
    
    try {
      setBookingInProgress(true);
      await bookingHandler(slot);
      return true;
    } catch (error) {
      console.error('Booking failed:', error);
      return false;
    } finally {
      setBookingInProgress(false);
    }
  }, []);

  return {
    // Data
    appointmentSlots,
    stats,
    selectedSlot,
    selectedSlotId,
    bookingInProgress,
    
    // Actions
    selectSlot,
    clearSelection,
    bookAppointmentSlot,
    
    // Utilities
    getAvailableSlots,
    getSlotsByStatus,
    getSlotsByTimeRange
  };
};
