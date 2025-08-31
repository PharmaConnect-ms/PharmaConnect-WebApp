"use client";

import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PharmaColors } from "@/theme";
import { useAddNewDoctorSchedule } from "../../logic/useAddNewDoctorSchedule";

// MUI
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";

// Reusable bits
import { DoctorSelect } from "@/components/forms/DoctorSelect";
import { DateField } from "@/components/forms/DateField";
import { TimeRangeField } from "@/components/forms/TimeRangeField";
import { SlotDurationSelect } from "@/components/forms/SlotDurationSelect";
import { StatusAlert } from "@/components/forms/StatusAlert";



interface AddNewDoctorScheduleModalProps {
    onClose: () => void;
}

const AddNewDoctorScheduleModal: React.FC<AddNewDoctorScheduleModalProps> = ({ onClose }) => {

    const {
        doctorsData,
        doctorsError,
        doctorsLoading,
        isCreating,
        doctorId,
        setDoctorId,
        date,
        setDate,
        start,
        end,
        slotDurationMinutes,
        setSlotDurationMinutes,
        errors,
        handleRangeChange,
        handleCancel,
        handleSubmit,
        submitStatus,
        minDate,
        setErrors
    } = useAddNewDoctorSchedule(onClose);

    if (doctorsLoading) {
        return (
            <Card sx={{ maxWidth: 720, mx: "auto" }}>
                <CardContent sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

    if (doctorsError) {
        return (
            <Card sx={{ maxWidth: 720, mx: "auto" }}>
                <CardContent sx={{ py: 4 }}>
                    <StatusAlert status="error" />
                    <Typography variant="body2" color="text.secondary">
                        Error loading doctor data. Please try again later.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ maxWidth: 720, mx: "auto", border: "none", boxShadow: "none" }}>
                <CardHeader
                    title={
                        <Typography variant="h5" fontWeight={700} textAlign={"center"}>
                            Add New Doctor Schedule
                        </Typography>
                    }
                    subheader="Create a new schedule for doctor appointments"
                />
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit} >
                        <Stack spacing={2.5}>
                            <DoctorSelect
                                value={doctorId}
                                onChange={(v) => {
                                    if (errors.doctorId) setErrors((p) => ({ ...p, doctorId: undefined }));
                                    setDoctorId(v);
                                }}
                                doctors={doctorsData}
                                error={!!errors.doctorId}
                                helperText={errors.doctorId}
                                disabled={isCreating}
                            />

                            <DateField
                                value={date}
                                onChange={(v) => {
                                    if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
                                    setDate(v);
                                }}
                                minDate={minDate}
                                error={!!errors.date}
                                helperText={errors.date}
                                disabled={isCreating}
                            />

                            <TimeRangeField
                                start={start}
                                end={end}
                                onChange={handleRangeChange}
                                startError={!!errors.startTime}
                                endError={!!errors.endTime}
                                startHelperText={errors.startTime}
                                endHelperText={errors.endTime}
                                disabled={isCreating}
                            />

                            <SlotDurationSelect
                                value={slotDurationMinutes}
                                onChange={(v) => {
                                    if (errors.slotDurationMinutes)
                                        setErrors((p) => ({ ...p, slotDurationMinutes: undefined }));
                                    setSlotDurationMinutes(v);
                                }}
                                error={!!errors.slotDurationMinutes}
                                helperText={errors.slotDurationMinutes}
                                disabled={isCreating}
                            />

                            <StatusAlert status={submitStatus} />

                            <Stack direction="row" spacing={2.5} pt={3}>
                                <Button
                                    type="button"
                                    sx={{ color: PharmaColors.primary }}
                                    variant="outlined"
                                    fullWidth
                                    onClick={handleCancel}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    sx={{ bgcolor: PharmaColors.primary }}
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isCreating || submitStatus === "success"}
                                    endIcon={isCreating ? <CircularProgress size={18} /> : undefined}
                                >
                                    {isCreating ? "Creating..." : "Create Schedule"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default AddNewDoctorScheduleModal;
