"use client";

import Loading from "@/components/ui/loading";
import { useAppointmentPage } from "../logic/use-appointment";

interface AppointmentUIProps {
  appointmentId: string;
}

export default function AppointmentUI({ appointmentId }: AppointmentUIProps) {

    const { appointment, isAppointmentLoading,
    patient, isPatientLoading,
    prescriptions, isPrescriptionsLoading,
    addPrescription, isAddingPrescription,
    conditionBooks, isConditionBooksLoading,
    createConditionBook, isCreatingConditionBook  } = useAppointmentPage({ appointmentId: appointmentId });


  if (isAppointmentLoading) {
    return <Loading />;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }


  if (isAppointmentLoading) {
    return <Loading />;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <div>
     
    </div>
  );
}
