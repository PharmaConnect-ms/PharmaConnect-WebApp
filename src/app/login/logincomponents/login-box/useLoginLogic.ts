'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/redux/api/authApi';
import { useDispatch } from 'react-redux';
import { authLogin, type AuthUser } from '@/redux/features/authSlice';
import type { AppDispatch } from '@/redux/store';
import { LoginInterface } from '@/utils/interfaces';

export const useLoginLogic = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res: LoginInterface = await loginUser({
        usernameOrEmail: emailOrUsername,
        password,
      }).unwrap();


      const user: AuthUser = {
        role: res.role,
        name: res.username,
        userID: String(res.id),
        token: res.token.access_token,
        age: res.age || '',
        phone: res.phone || '',
        address: res.address || '',
        email: res.email || '',
      };

      console.log(user);

      dispatch(authLogin(user));

      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'doctor') router.push('/doctor');
      else router.push('/user');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSignUp = async({ email, password }: { email: string, password: string }) => {
      try {
      const res: LoginInterface = await loginUser({
        usernameOrEmail: email,
        password,
      }).unwrap();


      const user: AuthUser = {
        role: res.role,
        name: res.username,
        userID: String(res.id),
        token: res.token.access_token,
        age: res.age || '',
        phone: res.phone || '',
        address: res.address || '',
        email: res.email || '',
      };


      dispatch(authLogin(user));

      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'doctor') router.push('/doctor');
      else router.push('/user');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return {
    emailOrUsername, setEmailOrUsername,
    password, setPassword,
    error, isLoading,
    handleLogin,
    handleSignUp
  };
};
