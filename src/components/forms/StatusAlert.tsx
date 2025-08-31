"use client";

import * as React from "react";
import { Alert } from "@mui/material";

export function StatusAlert({
  status,
}: {
  status: "idle" | "success" | "error";
}) {
  if (status === "success") {
    return <Alert severity="success">Schedule created successfully!</Alert>;
  }
  if (status === "error") {
    return <Alert severity="error">Failed to create schedule. Please try again.</Alert>;
  }
  return null;
}
