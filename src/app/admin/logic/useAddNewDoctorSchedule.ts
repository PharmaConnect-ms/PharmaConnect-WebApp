"use client";

import React, { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useCreateDoctorScheduleMutation } from "@/redux/api/doctor-schedule";
import { useAdminDashBoard } from "./use-admin-dashboard";

interface ScheduleFormErrors {
    doctorId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    slotDurationMinutes?: string;
}



export const useAddNewDoctorSchedule = (onClose: () => void) => {

    const { doctorsData, doctorsError, doctorsLoading } = useAdminDashBoard();
    const [createDoctorSchedule, { isLoading: isCreating }] = useCreateDoctorScheduleMutation();

    // Form state (Day.js for date/time, string for doctorId, number for duration)
    const [doctorId, setDoctorId] = useState<string>("");
    const [date, setDate] = useState<Dayjs | null>(null);
    const [start, setStart] = useState<Dayjs | null>(dayjs().hour(9).minute(0).second(0));
    const [end, setEnd] = useState<Dayjs | null>(dayjs().hour(17).minute(0).second(0));
    const [slotDurationMinutes, setSlotDurationMinutes] = useState<number>(30);

    const [errors, setErrors] = useState<ScheduleFormErrors>({});
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const today = useMemo(() => dayjs().startOf("day"), []);
    const minDate = today;

    const handleRangeChange = (next: { start: Dayjs | null; end: Dayjs | null }) => {
        if (errors.startTime || errors.endTime) {
            setErrors((prev) => ({ ...prev, startTime: undefined, endTime: undefined }));
        }
        setStart(next.start);
        setEnd(next.end);
    };

    const validateForm = (): boolean => {
        const newErrors: ScheduleFormErrors = {};

        if (!doctorId) newErrors.doctorId = "Please select a doctor";
        if (!date) {
            newErrors.date = "Please select a date";
        } else if (date.startOf("day").isBefore(today)) {
            newErrors.date = "Date cannot be in the past";
        }

        if (!start) newErrors.startTime = "Please select start time";
        if (!end) newErrors.endTime = "Please select end time";

        if (start && end && !end.isAfter(start)) {
            newErrors.endTime = "End time must be after start time";
        }

        if (slotDurationMinutes < 15 || slotDurationMinutes > 120) {
            newErrors.slotDurationMinutes = "Slot duration must be between 15 and 120 minutes";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setDoctorId("");
        setDate(null);
        setStart(dayjs().hour(9).minute(0).second(0));
        setEnd(dayjs().hour(17).minute(0).second(0));
        setSlotDurationMinutes(30);
    };

    const handleCancel = () => {
        console.log('Cancel function called');
        resetForm();
        setSubmitStatus("idle");
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                doctorId: parseInt(doctorId, 10),
                date: date!.format("YYYY-MM-DD"),
                startTime: start!.format("HH:mm"),
                endTime: end!.format("HH:mm"),
                slotDurationMinutes,
                isActive: true,
            };

            await createDoctorSchedule(payload).unwrap();
            setSubmitStatus("success");

            // brief success state then close
            setTimeout(() => {
                resetForm();
                setSubmitStatus("idle");
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error creating schedule:", err);
            setSubmitStatus("error");
            setTimeout(() => setSubmitStatus("idle"), 3000);
        }
    };

    return {
        doctorsData,
        doctorsError,
        doctorsLoading,
        isCreating,
        doctorId,
        setDoctorId,
        date,
        setDate,
        start,
        setStart,
        end,
        setEnd,
        slotDurationMinutes,
        setSlotDurationMinutes,
        errors,
        handleRangeChange,
        validateForm,
        resetForm,
        handleCancel,
        handleSubmit,
        submitStatus,
        minDate,
        setErrors
    };
};
