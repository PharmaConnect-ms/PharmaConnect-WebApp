// src/services/auth.ts
import api from './api';

// User credentials format
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  username: string;
}

interface LoginPayload2 {
    usernameOrEmail: string;
    password: string;
  }
  

export const login = async (payload: LoginPayload2) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

export const register = async (payload: RegisterPayload) => {
  const res = await api.post('/users/register', payload);
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};
