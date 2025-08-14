import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PatientData = {
  patientId?: string;
  name?: string;
  age?: number;
  gender?: string;
};

type PatientStore = {
  data: PatientData;
  setPatientData: (newData: Partial<PatientData>) => void;
  clearPatientData: () => void;
};

export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      data: {},
      setPatientData: (newData) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),
      clearPatientData: () => set({ data: {} }),
    }),
    {
      name: 'patient-storage',
    }
  )
);
