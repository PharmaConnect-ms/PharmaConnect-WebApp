"use client";

import * as React from "react";
import { Grid2 as Grid } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import  { Dayjs } from "dayjs";

export function TimeRangeField({
  start,
  end,
  onChange,
  startError,
  endError,
  startHelperText,
  endHelperText,
  disabled,
  labelStart = "Start Time",
  labelEnd = "End Time",
}: {
  start: Dayjs | null;
  end: Dayjs | null;
  onChange: (next: { start: Dayjs | null; end: Dayjs | null }) => void;
  startError?: boolean;
  endError?: boolean;
  startHelperText?: string;
  endHelperText?: string;
  disabled?: boolean;
  labelStart?: string;
  labelEnd?: string;
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TimePicker
          label={labelStart}
          value={start}
          onChange={(v) => onChange({ start: v, end })}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!startError,
              helperText: startHelperText || " ",
              disabled,
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TimePicker
          label={labelEnd}
          value={end}
          onChange={(v) => onChange({ start, end: v })}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!endError,
              helperText: endHelperText || " ",
              disabled,
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
