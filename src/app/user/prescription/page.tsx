'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Breadcrumbs,
  Link as MUILink,
} from '@mui/material';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react'; // ✅ Import QR

interface Prescription {
  id: string;
  prescriptionImage: string;
  patientName: string;
  createdAt: string;
  doctor: {
    id: number;
    username: string;
  };
  patient: {
    id: number;
    username: string;
  };
}

const PrescriptionPage = () => {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/prescription/user/${userId}`);

        if (!res.ok) {
          if (res.status === 404) {
            console.warn('No prescriptions found.');
            setPrescriptions([]);
            return;
          } else {
            throw new Error(`HTTP ${res.status} - ${res.statusText}`);
          }
        }

        const data = await res.json();
        setPrescriptions(data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs aria-label="breadcrumb">
          <MUILink
            underline="hover"
            color="inherit"
            onClick={() => router.push('/user')}
            style={{ cursor: 'pointer' }}
          >
            Home
          </MUILink>
          <Typography color="text.primary">Prescriptions</Typography>
        </Breadcrumbs>
      </div>

      <Typography variant="h4" gutterBottom>
        My Prescriptions
      </Typography>

      {loading ? (
        <div className="flex justify-center mt-12">
          <CircularProgress />
        </div>
      ) : prescriptions.length === 0 ? (
        <Typography variant="body1" className="text-gray-500 text-center mt-8">
          You don’t have any prescriptions yet.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {prescriptions.map((prescription) => {
            const qrUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg/500px-2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg`; // 🔗 Customize this base URL
            return (
              <Grid item xs={12} sm={6} md={4} key={prescription.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={prescription.prescriptionImage || '/fallback.png'}
                    alt="Prescription"
                    onError={(e) => {
                      e.currentTarget.src = '/fallback.png';
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Patient: {prescription.patientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Doctor: {prescription.doctor.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Issued: {format(new Date(prescription.createdAt), 'PPP p')}
                    </Typography>

                    {/* QR Code */}
                    <div className="mt-4 text-center">
                      <QRCodeCanvas value={qrUrl} size={100} />
                      <Typography variant="caption" display="block" mt={1}>
                        Scan to view
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default PrescriptionPage;
