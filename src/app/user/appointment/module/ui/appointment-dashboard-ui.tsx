'use client';

import React, { useState, useMemo } from 'react';
import {
    Container,
    Typography,
    Box,
    Tab,
    Tabs,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Stepper,
    Step,
    StepLabel,
    useMediaQuery,
    useTheme,
    Fab
} from '@mui/material';
import {
    CalendarToday as CalendarIcon, // ✅ replace Calendar with CalendarToday
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Add as AddIcon,
    VideoCall as VideoCallIcon,
    LocalHospital as LocalHospitalIcon,
    AccessTime as TimeIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon
} from '@mui/icons-material';
import { useAppointmentDashboard } from '../logic/useAppointmentDashboardUi';
import { AppointmentResponse, AppointmentStatus } from '@/types/appointment-types';
import { TimeSlotInterface } from '@/types/time-slots';
import DoctorSelectionGrid from '@/components/forms/DoctorSelectionGrid';
import ScheduleSelectionCalendar from '@/components/forms/ScheduleSelectionCalendar';
import TimeSlotSelection from '@/components/forms/TimeSlotSelection';
import BookingConfirmationModal from '@/components/forms/BookingConfirmationModal';
import { format, parseISO } from 'date-fns';
import { useZoomMeeting } from '@/hooks/useZoomMeeting';
import { getMeetingLink } from '@/utils/appointment-utils';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div hidden={value !== index} style={{ width: '100%' }}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const AppointmentDashboardUI = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { joinMeeting } = useZoomMeeting();

    const {
        appointment,
        appointmentError,
        isLoadingAppointment,
        createAppointment,
        isCreating,
        doctors,
        doctorsError,
        isLoadingDoctors,
        schedules,
        schedulesError,
        isLoadingSchedules,
        timeSlots,
        timeSlotsError,
        isLoadingTimeSlots,
        selectedDoctorId,
        setSelectedDoctorId,
        selectedScheduleId,
        setSelectedScheduleId
    } = useAppointmentDashboard();

    const [activeTab, setActiveTab] = useState(0);
    const [bookingStep, setBookingStep] = useState(0);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotInterface | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const bookingSteps = ['Select Doctor', 'Choose Date', 'Pick Time', 'Confirm'];

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleDoctorSelect = (doctorId: string) => {
        setSelectedDoctorId(doctorId);
        setBookingStep(1);
    };

    const handleScheduleSelect = (scheduleId: string) => {
        setSelectedScheduleId(scheduleId);
        setBookingStep(2);
    };

    const handleTimeSlotSelect = (slot: TimeSlotInterface) => {
        setSelectedTimeSlot(slot);
    };

    const handleBookSlot = (slot: TimeSlotInterface) => {
        setSelectedTimeSlot(slot);
        setShowBookingModal(true);
    };

    const handleBookingConfirm = async (bookingData: { timeSlotId: string; patientId: number; type: 'physical' | 'online'; notes: string }) => {
        try {
            await createAppointment(bookingData).unwrap();
            setShowBookingModal(false);
            setBookingStep(0);
            setSelectedDoctorId(null);
            setSelectedScheduleId(null);
            setSelectedTimeSlot(null);
            setActiveTab(0); // Switch to My Appointments tab
        } catch (error) {
            console.error('Booking failed:', error);
            throw error;
        }
    };

    const resetBookingFlow = () => {
        setBookingStep(0);
        setSelectedDoctorId(null);
        setSelectedScheduleId(null);
        setSelectedTimeSlot(null);
    };

    const handleOnlineAppointmentClick = (appointment: AppointmentResponse) => {
        // Only handle click for online appointments that are scheduled
        if (appointment.type === 'online' && appointment.status === AppointmentStatus.SCHEDULED) {
            const meetingLink = getMeetingLink(appointment);
            if (meetingLink) {
                joinMeeting({
                    appointmentId: appointment.id,
                    meetingLink: meetingLink,
                    patientName: 'Patient', // You might want to get this from user context/state
                    doctorName: appointment.doctor.username,
                    userType: 'patient'
                });
            }
        }
    };

    const getAppointmentStatusConfig = (status: AppointmentStatus) => {
        const configs = {
            [AppointmentStatus.SCHEDULED]: {
                color: '#1976d2',
                backgroundColor: '#e3f2fd',
                icon: <PendingIcon />,
                label: 'Scheduled'
            },
            [AppointmentStatus.IN_PROGRESS]: {
                color: '#ed6c02',
                backgroundColor: '#fff3e0',
                icon: <TimeIcon />,
                label: 'In Progress'
            },
            [AppointmentStatus.COMPLETED]: {
                color: '#2e7d32',
                backgroundColor: '#e8f5e9',
                icon: <CheckCircleIcon />,
                label: 'Completed'
            },
            [AppointmentStatus.CANCELLED]: {
                color: '#d32f2f',
                backgroundColor: '#ffebee',
                icon: <CancelIcon />,
                label: 'Cancelled'
            },
            [AppointmentStatus.NO_SHOW]: {
                color: '#757575',
                backgroundColor: '#f5f5f5',
                icon: <CancelIcon />,
                label: 'No Show'
            }
        };
        return configs[status];
    };

    const formatAppointmentTime = (scheduledAt: string) => {
        try {
            return format(parseISO(scheduledAt), 'MMM dd, yyyy • h:mm a');
        } catch {
            return scheduledAt;
        }
    };

    const selectedDoctor = useMemo(() => {
        return doctors?.find(doc => doc.id.toString() === selectedDoctorId);
    }, [doctors, selectedDoctorId]);

    const selectedSchedule = useMemo(() => {
        return schedules?.find(schedule => schedule.id === selectedScheduleId);
    }, [schedules, selectedScheduleId]);

    const renderMyAppointments = () => {
        if (isLoadingAppointment) {
            return (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress size={48} />
                </Box>
            );
        }

        if (appointmentError) {
            return (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load appointments. Please refresh the page.
                </Alert>
            );
        }

        if (!appointment || !appointment.length) {
            return (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        backgroundColor: '#f8f9fa',
                        border: '2px dashed #dee2e6'
                    }}
                >
                    <CalendarIcon sx={{ fontSize: 64, color: '#6c757d', mb: 3 }} />
                    <Typography variant="h5" fontWeight={600} color="text.secondary" gutterBottom>
                        No Appointments Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        Book your first appointment with one of our doctors
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => setActiveTab(1)}
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Book New Appointment
                    </Button>
                </Paper>
            );
        }

        return (
            <Grid container spacing={3}>
                {Array.isArray(appointment) ? appointment.map((apt: AppointmentResponse) => {
                    const statusConfig = getAppointmentStatusConfig(apt.status);

                    return (
                        <Grid item xs={12} md={6} lg={4} key={apt.id}>
                            <Card
                                onClick={() => handleOnlineAppointmentClick(apt)}
                                sx={{
                                    height: '100%',
                                    border: `2px solid ${statusConfig.backgroundColor}`,
                                    cursor: apt.type === 'online' && apt.status === AppointmentStatus.SCHEDULED ? 'pointer' : 'default',
                                    '&:hover': {
                                        boxShadow: 6,
                                        transform: apt.type === 'online' && apt.status === AppointmentStatus.SCHEDULED ? 'translateY(-2px)' : 'none',
                                    },
                                    transition: 'all 0.3s ease',
                                    ...(apt.type === 'online' && apt.status === AppointmentStatus.SCHEDULED && {
                                        '&:hover': {
                                            boxShadow: 8,
                                            transform: 'translateY(-3px)',
                                            borderColor: '#1976d2',
                                        }
                                    })
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Status and Appointment Number */}
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Chip
                                            icon={statusConfig.icon}
                                            label={statusConfig.label}
                                            sx={{
                                                backgroundColor: statusConfig.backgroundColor,
                                                color: statusConfig.color,
                                                fontWeight: 600
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            #{apt.appointmentNo}
                                        </Typography>
                                    </Box>

                                    {/* Doctor Info */}
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar
                                            sx={{
                                                backgroundColor: '#1976d2',
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                Dr. {apt.doctor.username}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                General Medicine
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Appointment Details */}
                                    <Box mb={3}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {formatAppointmentTime(apt.scheduledAt)}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            {apt.type === 'online' ? (
                                                <VideoCallIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                            ) : (
                                                <LocalHospitalIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                            )}
                                            <Typography variant="body2">
                                                {apt.type === 'online' ? 'Online Consultation' : 'In-Person Visit'}
                                                {apt.type === 'online' && apt.status === AppointmentStatus.SCHEDULED && (
                                                    <Typography component="span" variant="caption" color="primary" fontWeight={600} ml={1}>
                                                        • Click to Join
                                                    </Typography>
                                                )}
                                            </Typography>
                                        </Box>

                                        {apt.timeSlot && (
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {apt.timeSlot.startTime} - {apt.timeSlot.endTime}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Notes */}
                                    {apt.notes && (
                                        <Box mb={2}>
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                &quot;{apt.notes}&quot;
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Action Buttons */}
                                    <Box display="flex" gap={1} onClick={(e) => e.stopPropagation()}>
                                        {apt.status === AppointmentStatus.SCHEDULED && (
                                            <>
                                                {apt.type === 'online' && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<VideoCallIcon />}
                                                        href={getMeetingLink(apt)}
                                                        sx={{ flex: 1 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Join Meeting
                                                    </Button>
                                                )}
                                               
                                            </>
                                        )}
                                        {apt.status === AppointmentStatus.COMPLETED && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Details
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                }) : (
                    <Grid item xs={12}>
                        <Typography>Invalid appointment data format</Typography>
                    </Grid>
                )}
            </Grid>
        );
    };

    const renderBookingFlow = () => {
        return (
            <Box>
                {/* Booking Steps */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
                    <Stepper
                        activeStep={bookingStep}
                        alternativeLabel={!isMobile}
                        orientation={isMobile ? 'vertical' : 'horizontal'}
                    >
                        {bookingSteps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel
                                    onClick={() => {
                                        if (index < bookingStep) {
                                            setBookingStep(index);
                                        }
                                    }}
                                    sx={{
                                        cursor: index < bookingStep ? 'pointer' : 'default',
                                        '&:hover': index < bookingStep ? {
                                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                            borderRadius: 1,
                                            p: 1,
                                            m: -1
                                        } : {}
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {bookingStep > 0 && (
                        <Box mt={2} textAlign="center">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={resetBookingFlow}
                            >
                                Start Over
                            </Button>
                        </Box>
                    )}
                </Paper>

                {/* Step Content */}
                {bookingStep === 0 && (
                    <DoctorSelectionGrid
                        doctors={doctors || []}
                        selectedDoctorId={selectedDoctorId}
                        onDoctorSelect={handleDoctorSelect}
                        isLoading={isLoadingDoctors}
                    />
                )}

                {bookingStep === 1 && selectedDoctorId && (
                    <ScheduleSelectionCalendar
                        schedules={schedules || []}
                        selectedScheduleId={selectedScheduleId}
                        onScheduleSelect={handleScheduleSelect}
                        isLoading={isLoadingSchedules}
                        doctorName={selectedDoctor?.username}
                    />
                )}

                {bookingStep === 2 && selectedScheduleId && (
                    <TimeSlotSelection
                        timeSlots={timeSlots || []}
                        selectedSlotId={selectedTimeSlot?.id || null}
                        onSlotSelect={handleTimeSlotSelect}
                        onBookSlot={handleBookSlot}
                        isLoading={isLoadingTimeSlots}
                        doctorName={selectedDoctor?.username}
                        selectedDate={selectedSchedule?.date}
                    />
                )}

                {/* Error States */}
                {doctorsError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Failed to load doctors. Please refresh the page.
                    </Alert>
                )}
                {schedulesError && selectedDoctorId && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Failed to load schedules for the selected doctor.
                    </Alert>
                )}
                {timeSlotsError && selectedScheduleId && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Failed to load time slots for the selected date.
                    </Alert>
                )}
            </Box>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    My Appointments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your appointments and book new consultations with our doctors
                </Typography>
            </Box>

            {/* Tabs */}
            <Paper elevation={0} sx={{ mb: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant={isMobile ? 'fullWidth' : 'standard'}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            py: 2
                        }
                    }}
                >
                    <Tab
                        icon={<CalendarIcon />}
                        label="My Appointments"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<AddIcon />}
                        label="Book New Appointment"
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            <TabPanel value={activeTab} index={0}>
                {renderMyAppointments()}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                {renderBookingFlow()}
            </TabPanel>

            {/* Floating Action Button for Mobile */}
            {isMobile && activeTab === 0 && (
                <Fab
                    color="primary"
                    aria-label="book appointment"
                    sx={{ position: 'fixed', bottom: 20, right: 20 }}
                    onClick={() => setActiveTab(1)}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Booking Confirmation Modal */}
            <BookingConfirmationModal
                open={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onConfirm={handleBookingConfirm}
                selectedSlot={selectedTimeSlot ? {
                    id: selectedTimeSlot.id,
                    doctorName: selectedDoctor?.username || '',
                    date: selectedSchedule?.date || '',
                    startTime: selectedTimeSlot.startTime,
                    endTime: selectedTimeSlot.endTime,
                    duration: selectedSchedule?.slotDurationMinutes || 30
                } : null}
                isLoading={isCreating}
            />
        </Container>
    );
};

export default AppointmentDashboardUI;

