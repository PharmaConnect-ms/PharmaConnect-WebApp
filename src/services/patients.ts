// src/services/patients.ts
import api from './api';

export const getAllPatients = async () => {
  const res = await api.get('/patients');
  return res.data;
};

export const getPatientById = async (id: number | string) => {
  const res = await api.get(`/patients/${id}`);
  return res.data;
};

export const createPatient = async (data: {
  name: string;
  email: string;
  phone: string;
  dob?: string;
}) => {
  const res = await api.post('/patients', data);
  return res.data;
};

export const updatePatient = async (id: number | string, data: Partial<{
  name: string;
  email: string;
  phone: string;
  dob: string;
}>) => {
  const res = await api.put(`/patients/${id}`, data);
  return res.data;
};

export const deletePatient = async (id: number | string) => {
  const res = await api.delete(`/patients/${id}`);
  return res.data;
};
