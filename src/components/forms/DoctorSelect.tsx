"use client";

import * as React from "react";
import { TextField, MenuItem } from "@mui/material";

export interface Doctor {
  id: string | number;
  username?: string;
  name?: string;
}

export function DoctorSelect({
  value,
  onChange,
  doctors,
  error,
  helperText,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  doctors: Doctor[] | undefined;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}) {
  return (
    <TextField
      select
      fullWidth
      label="Select Doctor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={helperText || " "}
      disabled={disabled}
    >
      <MenuItem value="">-- Select a Doctor --</MenuItem>
      {doctors?.map((d) => (
        <MenuItem key={d.id} value={String(d.id)}>
          {`Dr. ${d.username || d.name || `Doctor ${d.id}`}`}
        </MenuItem>
      ))}
    </TextField>
  );
}
