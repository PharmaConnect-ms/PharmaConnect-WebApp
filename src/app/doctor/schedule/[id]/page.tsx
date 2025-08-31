'use client';
import DoctorSchedulePageUI from "./module/ui/doctor-schedule-page-ui";

interface DoctorSchedulePageProps {
  params: {
    id: string;
  };
}

export default function DoctorSchedulePage({ params }: DoctorSchedulePageProps) {
  const { id } = params;

  return (
    <DoctorSchedulePageUI scheduleId={id} />
  );
}
