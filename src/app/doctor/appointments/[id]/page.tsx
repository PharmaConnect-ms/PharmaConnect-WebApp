"use client";

import AppointmentUI from "./module/ui/appointment-ui";


export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
 
  return (
    <div>
      <AppointmentUI appointmentId={id} />
    </div>
  );
}
