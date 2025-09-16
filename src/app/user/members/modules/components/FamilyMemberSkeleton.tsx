"use client";

import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  Grid2 as Grid,
} from "@mui/material";

interface FamilyMemberSkeletonProps {
  count?: number;
}

const FamilyMemberSkeleton: React.FC<FamilyMemberSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
          >
            <CardContent sx={{ padding: 3 }}>
              {/* Header with avatar and name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Skeleton
                    variant="circular"
                    width={56}
                    height={56}
                    sx={{ marginRight: 2 }}
                  />
                  <Box>
                    <Skeleton variant="text" width={120} height={28} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                </Box>
                <Skeleton variant="circular" width={32} height={32} />
              </Box>

              {/* Chips */}
              <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={100} height={24} />
              </Box>

              {/* Medical info */}
              <Box sx={{ marginBottom: 2 }}>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>

              {/* Care profiles */}
              <Skeleton variant="text" width="60%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FamilyMemberSkeleton;
