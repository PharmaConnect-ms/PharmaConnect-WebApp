'use client';

import { useEffect, useState } from "react";   
import { usePatientStore } from "./patient-store";
import { useGetPatientByUserIdQuery} from "@/redux/api/UserApi";


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

  return {
    isPatientDataLoaded, setIsPatientDataLoaded,
    onSelectPatient, clearPatientData, onAddPrescription,
    isAddPrescriptionModalOpen, setIsAddPrescriptionModalOpen
  };
};
