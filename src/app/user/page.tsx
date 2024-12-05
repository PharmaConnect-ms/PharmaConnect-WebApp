"use client";
import { useRole } from "@/hooks/useRole";

export default function UserProfile() {
  useRole("user");


  return (
    <div>
      <h1>Welcome, User</h1>
      <p>This is your profile page.</p>
    </div>
  );
}
