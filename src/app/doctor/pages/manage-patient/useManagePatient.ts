'use client';

import { useEffect, useState } from "react";   
import { usePatientStore } from "./patient-store";
import { useGetPatientByUserIdQuery} from "@/redux/api/UserApi";
import { RichTextPayload } from "./components/molecules/PrescriptionRichTextEditor";
import { DrawingPayload } from "./components/molecules/PrescriptionCanvas";
import { savePrescription } from "./logic/savePrescription";

export const useManagePatient = () => {
    const [isPatientDataLoaded, setIsPatientDataLoaded] = useState(false);
    const [isAddPrescriptionModalOpen, setIsAddPrescriptionModalOpen] = useState(false);
    const { data , setPatientData, clearPatientData } = usePatientStore();
    const [patientId, setPatientId] = useState<string | null>(null);
    const { data: userData , isLoading: isUserLoading, isError: isUserError } = useGetPatientByUserIdQuery(patientId || '', { skip: !patientId });

    useEffect(() => {
        setIsPatientDataLoaded(!!data.patientId);
    }, [data.patientId]); 

    useEffect(() => {
        if (userData && !isUserLoading && !isUserError) {
            console.log("User Data:", userData);
            setPatientData({
                patientId: userData.id,
                name: userData.username,
                age: userData?.age,
            })
        }
        
    }, [userData, isUserLoading, isUserError, setPatientData]);

    const onSelectPatient = (id: string | null) => {
        if(id){
            setPatientId(id);
        }
    };

    const onAddPrescription = () => {
        setIsAddPrescriptionModalOpen(true);
    }

    const onSavePrescription = async (payload: RichTextPayload | DrawingPayload) => {
        console.log("Saving prescription:", payload);
        if(payload.type === 'text') {
          const result = await savePrescription(payload as RichTextPayload);
          console.log("Downloaded prescription as PNG:", result);
        }
    };

  return {
    isPatientDataLoaded, setIsPatientDataLoaded,
    onSelectPatient, clearPatientData, onAddPrescription,
    isAddPrescriptionModalOpen, setIsAddPrescriptionModalOpen,
    onSavePrescription
  };
};
