"use client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch } from '@/redux/store';
import { authLogout } from "@/redux/features/authSlice";

export default function useLogout() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    return () => {
    dispatch(authLogout());
    router.push('/login');
    };
}
