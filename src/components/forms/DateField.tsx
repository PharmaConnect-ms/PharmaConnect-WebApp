"use client";

import * as React from "react";
import  { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextFieldProps } from "@mui/material";

export function DateField({
  value,
  onChange,
  error,
  helperText,
  minDate,
  label = "Date",
  disabled,
}: {
  value: Dayjs | null;
  onChange: (v: Dayjs | null) => void;
  error?: boolean;
  helperText?: string;
  minDate?: Dayjs;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      minDate={minDate}
      slotProps={{
        textField: {
          fullWidth: true,
          error: !!error,
          helperText: helperText || " ",
          disabled,
        } as TextFieldProps,
      }}
    />
  );
}
