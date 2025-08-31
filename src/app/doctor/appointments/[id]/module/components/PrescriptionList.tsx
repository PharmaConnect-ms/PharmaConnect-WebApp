"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card as MuiCard,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Skeleton,
  Badge
} from "@mui/material";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Medication,
  Add,
  Visibility,
  Download,
  QrCode2,
  Close,
} from "@mui/icons-material";
import { format } from "date-fns";
import { PrescriptionResponse } from "@/types/prescription-types";
import { QRCodeCanvas } from "qrcode.react";

interface PrescriptionListProps {
  prescriptions: PrescriptionResponse[];
  isLoading: boolean;
  onCreatePrescription: () => void;
  isCreating?: boolean;
}

const FALLBACK_IMG = "/fallback-prescription.svg";

// ---------- Utilities ----------
const safeDate = (value: string | number | Date) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

const formatDate = (value: string | number | Date, fmt = "MMM dd, yyyy") =>
  format(safeDate(value), fmt);

const getBaseUrl = () => {
  // Prefer explicit env if provided (useful in SSR)
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
};

const createPrescriptionUrl = (image?: string | null): string => {
  const base = getBaseUrl();
  if (!image) return `${base}/prescription-not-found`;

  try {
    // Absolute HTTP(S)
    if (/^https?:\/\//i.test(image)) return image;

    // Absolute path
    if (image.startsWith("/")) return `${base}${image}`;

    // Filename or relative path
    return `${base}/${image.replace(/^\.?\/*/, "")}`;
  } catch {
    return `${base}/prescription-not-found`;
  }
};

const downloadByLink = (href: string, filename: string) => {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// ---------- Subcomponents ----------
type CardProps = {
  prescription: PrescriptionResponse;
  onView: (p: PrescriptionResponse) => void;
  onShowQR: (p: PrescriptionResponse) => void;
  onDownload: (p: PrescriptionResponse) => void;
};

const PrescriptionCard = React.memo<CardProps>(
  ({ prescription, onView, onShowQR, onDownload }) => {
    const issued = useMemo(
      () => formatDate(prescription.createdAt),
      [prescription.createdAt]
    );

    const imageSrc =
      prescription.prescriptionImage || FALLBACK_IMG;

    return (
      <MuiCard
        className="h-full hover:shadow-lg transition-shadow duration-300"
        sx={{ cursor: "pointer" }}
        aria-label={`Prescription card for ${prescription.patientName}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onView(prescription);
          }
        }}
        tabIndex={0}
      >
        <CardMedia
          component="img"
          height="200"
          image={imageSrc}
          alt={`Prescription image for ${prescription.patientName}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
          }}
          onClick={() => onView(prescription)}
          style={{ objectFit: "cover" }}
        />

        <CardContent>
          <Box className="mb-3">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-1"
              title={prescription.patientName}
            >
              {prescription.patientName}
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-600 mb-2"
              title={`Doctor ${prescription.doctor?.username ?? ""}`}
            >
              Dr. {prescription.doctor?.username}
            </Typography>
            <Chip
              label={issued}
              size="small"
              variant="outlined"
              color="primary"
              aria-label={`Issued on ${issued}`}
            />
          </Box>

          <Box className="flex gap-1">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onView(prescription)}
              title="View prescription"
              aria-label="View prescription"
            >
              <Visibility fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="secondary"
              onClick={() => onShowQR(prescription)}
              title="Show QR code"
              aria-label="Show QR code"
            >
              <QrCode2 fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="success"
              onClick={() => onDownload(prescription)}
              title="Download prescription"
              aria-label="Download prescription"
            >
              <Download fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </MuiCard>
    );
  }
);
PrescriptionCard.displayName = "PrescriptionCard";

type ViewerDialogProps = {
  open: boolean;
  prescription: PrescriptionResponse | null;
  onClose: () => void;
};

const ViewerDialog: React.FC<ViewerDialogProps> = ({ open, prescription, onClose }) => {
  if (!prescription) return null;

  const issued = formatDate(prescription.createdAt, "PPP p");
  const imageSrc = prescription.prescriptionImage || FALLBACK_IMG;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { minHeight: "400px" } }}
      aria-labelledby="prescription-viewer-title"
    >
      <DialogTitle
        id="prescription-viewer-title"
        className="flex items-center justify-between"
      >
        <span>Prescription — {prescription.patientName}</span>
        <IconButton onClick={onClose} aria-label="Close viewer">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="flex flex-col items-center justify-center">
        {!prescription.prescriptionImage ? (
          <Box className="text-center p-8">
            <Typography variant="h6" className="text-gray-500 mb-2">
              No Image Available
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              This prescription doesn&apos;t have an associated image.
            </Typography>
          </Box>
        ) : (
          <Box className="text-center w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={`Prescription image for ${prescription.patientName}`}
              style={{ maxWidth: "100%", height: "auto", maxHeight: "70vh" }}
              className="rounded-lg shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
            <Typography variant="caption" className="block mt-2 text-gray-600">
              Issued on {issued}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

type QrDialogProps = {
  open: boolean;
  prescription: PrescriptionResponse | null;
  onClose: () => void;
};

const QrDialog: React.FC<QrDialogProps> = ({ open, prescription, onClose }) => {
  if (!prescription) return null;

  const url = createPrescriptionUrl(prescription.prescriptionImage);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="qr-title">
      <DialogTitle id="qr-title" className="text-center">
        QR Code — Quick Access
      </DialogTitle>
      <DialogContent className="text-center pb-6">
        <Box className="flex flex-col items-center gap-4">
          <QRCodeCanvas
            value={url}
            size={200}
            className="border rounded-lg p-2"
            aria-label="QR code to open prescription"
          />
          <Typography variant="body2" className="text-gray-600">
            Scan to view prescription online
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            Patient: {prescription.patientName}
          </Typography>

          <Box className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 break-all">
            <Typography variant="caption">URL: {url}</Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => window.open(url, "_blank", "noopener")}
            className="mt-2"
          >
            Open link
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ---------- Main ----------
const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  isLoading,
  onCreatePrescription,
  isCreating = false,
}) => {
  const [selected, setSelected] = useState<PrescriptionResponse | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const handleView = useCallback((p: PrescriptionResponse) => {
    setQrOpen(false);
    setSelected(p);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setSelected(null);
    setQrOpen(false);
  }, []);

  const handleShowQR = useCallback((p: PrescriptionResponse) => {
    setSelected(p);
    setQrOpen(true);
  }, []);

  const handleCloseQR = useCallback(() => {
    setQrOpen(false);
    setSelected(null);
  }, []);

  const handleDownload = useCallback((p: PrescriptionResponse) => {
    const url = createPrescriptionUrl(p.prescriptionImage);
    const filename = `prescription-${p.patientName}-${formatDate(
      p.createdAt,
      "yyyy-MM-dd"
    )}.jpg`;
    downloadByLink(url, filename);
  }, []);

  const loadingSkeletons = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${i}`}>
          <MuiCard className="h-full">
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rounded" width={90} height={28} />
              <Box className="flex gap-1 mt-2">
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
              </Box>
            </CardContent>
          </MuiCard>
        </Grid>
      )),
    []
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
                <Badge
                color="success"
                badgeContent={<span className="text-xs">{prescriptions?.length || 0}</span>}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                <Medication className="text-green-600" />
                </Badge>
              Patient Prescriptions
            </CardTitle>

            <Button
              variant="contained"
              startIcon={
                isCreating ? <CircularProgress size={16} /> : <Add />
              }
              onClick={onCreatePrescription}
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700"
              aria-label="Create new prescription"
            >
              {isCreating ? "Creating..." : "New Prescription"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <Grid container spacing={3}>
              {loadingSkeletons}
            </Grid>
          ) : !prescriptions || prescriptions.length === 0 ? (
            <Box className="text-center py-12">
              <Medication className="text-gray-300 mb-4" sx={{ fontSize: 64 }} />
              <Typography variant="h6" className="text-gray-500 mb-2">
                No prescriptions found
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                Create the first prescription for this patient
              </Typography>
              <Button
                variant="contained"
                onClick={onCreatePrescription}
                className="bg-green-600 hover:bg-green-700"
                startIcon={<Add />}
              >
                New Prescription
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {prescriptions.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p.id}>
                  <PrescriptionCard
                    prescription={p}
                    onView={handleView}
                    onShowQR={handleShowQR}
                    onDownload={handleDownload}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <ViewerDialog
        open={Boolean(selected) && !qrOpen}
        prescription={selected}
        onClose={handleCloseViewer}
      />

      <QrDialog open={qrOpen} prescription={selected} onClose={handleCloseQR} />
    </>
  );
};

export default PrescriptionList;
