"use client";

import * as React from "react";
import { TextField, MenuItem } from "@mui/material";

const OPTIONS = [15, 20, 30, 45, 60, 90, 120];

export function SlotDurationSelect({
  value,
  onChange,
  error,
  helperText,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}) {
  return (
    <TextField
      select
      fullWidth
      label="Slot Duration (minutes)"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      error={!!error}
      helperText={helperText || "Time between individual appointment slots"}
      disabled={disabled}
    >
      {OPTIONS.map((v) => (
        <MenuItem key={v} value={v}>
          {v < 60 ? `${v} minutes` : v === 60 ? "1 hour" : `${v / 60} hours`}
        </MenuItem>
      ))}
    </TextField>
  );
}
