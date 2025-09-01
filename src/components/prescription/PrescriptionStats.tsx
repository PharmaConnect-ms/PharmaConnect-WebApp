'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { PrescriptionResponse } from '@/types/prescription-types';

interface PrescriptionStatsProps {
  prescriptions: PrescriptionResponse[] | undefined;
}

const PrescriptionStats: React.FC<PrescriptionStatsProps> = ({ prescriptions }) => {
  if (!prescriptions) return null;

  // Calculate simple statistics
  const totalPrescriptions = prescriptions.length;
  const uniqueDoctors = new Set(prescriptions.map(p => p.doctor.id)).size;
  
  // Recent prescriptions (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentPrescriptions = prescriptions.filter(p => 
    new Date(p.createdAt) > sevenDaysAgo
  ).length;

  const stats = [
    {
      title: 'Total Prescriptions',
      value: totalPrescriptions,
      icon: <AssignmentIcon />,
      color: '#56AAF0',
      bgColor: 'rgba(86, 170, 240, 0.1)',
    },
    {
      title: 'Unique Doctors',
      value: uniqueDoctors,
      icon: <HospitalIcon />,
      color: '#42C5E7',
      bgColor: 'rgba(66, 197, 231, 0.1)',
    },
    {
      title: 'Recent (7 days)',
      value: recentPrescriptions,
      icon: <ScheduleIcon />,
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
  ];

  return (
    <Paper
      sx={{
        mb: 4,
        p: 4,
        background: 'linear-gradient(135deg, rgba(86, 170, 240, 0.02) 0%, rgba(66, 197, 231, 0.02) 100%)',
        border: '1px solid rgba(86, 170, 240, 0.08)',
        borderRadius: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 1
          }}
        >
          Prescription Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your prescription statistics at a glance
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: stat.bgColor,
                border: `1px solid ${stat.color}20`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${stat.color}20`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    width: 56,
                    height: 56,
                    boxShadow: `0 4px 12px ${stat.color}30`,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: stat.color,
                      lineHeight: 1,
                      mb: 0.5
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 'medium'
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PrescriptionStats;

// const PrescriptionStats: React.FC<PrescriptionStatsProps> = ({ prescriptions }) => {
//   const stats = React.useMemo(() => {
//     if (!prescriptions || prescriptions.length === 0) {
//       return {
//         totalPrescriptions: 0,
//         uniqueDoctors: 0,
//         recentPrescriptions: 0,
//         thisMonthCount: 0,
//         lastMonthCount: 0,
//       };
//     }

//     const now = new Date();
//     const thisMonth = now.getMonth();
//     const thisYear = now.getFullYear();
//     const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
//     const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

//     const uniqueDoctors = new Set(prescriptions.map(p => p.doctor.id)).size;
//     const recentPrescriptions = prescriptions.filter(p => {
//       const prescriptionDate = new Date(p.createdAt);
//       const daysAgo = (now.getTime() - prescriptionDate.getTime()) / (1000 * 3600 * 24);
//       return daysAgo <= 30;
//     }).length;

//     const thisMonthCount = prescriptions.filter(p => {
//       const prescriptionDate = new Date(p.createdAt);
//       return prescriptionDate.getMonth() === thisMonth && prescriptionDate.getFullYear() === thisYear;
//     }).length;

//     const lastMonthCount = prescriptions.filter(p => {
//       const prescriptionDate = new Date(p.createdAt);
//       return prescriptionDate.getMonth() === lastMonth && prescriptionDate.getFullYear() === lastMonthYear;
//     }).length;

//     return {
//       totalPrescriptions: prescriptions.length,
//       uniqueDoctors,
//       recentPrescriptions,
//       thisMonthCount,
//       lastMonthCount,
//     };
//   }, [prescriptions]);

//   const growthPercentage = React.useMemo(() => {
//     if (stats.lastMonthCount === 0) return stats.thisMonthCount > 0 ? 100 : 0;
//     return Math.round(((stats.thisMonthCount - stats.lastMonthCount) / stats.lastMonthCount) * 100);
//   }, [stats.thisMonthCount, stats.lastMonthCount]);

//   const statCards = [
//     {
//       title: 'Total Prescriptions',
//       value: stats.totalPrescriptions,
//       icon: AssignmentIcon,
//       color: '#56AAF0',
//       description: 'All time prescriptions',
//     },
//     {
//       title: 'Unique Doctors',
//       value: stats.uniqueDoctors,
//       icon: HospitalIcon,
//       color: '#42C5E7',
//       description: 'Different doctors consulted',
//     },
//     {
//       title: 'Recent Prescriptions',
//       value: stats.recentPrescriptions,
//       icon: PersonIcon,
//       color: '#FF6B6B',
//       description: 'Last 30 days',
//     },
//     {
//       title: 'Monthly Growth',
//       value: `${growthPercentage > 0 ? '+' : ''}${growthPercentage}%`,
//       icon: TrendingUpIcon,
//       color: growthPercentage >= 0 ? '#4CAF50' : '#FF5722',
//       description: 'Compared to last month',
//     },
//   ];

//   return (
//     <Box sx={{ mb: 4 }}>
//       <Typography
//         variant="h5"
//         sx={{
//           mb: 3,
//           fontWeight: 'bold',
//           color: 'text.primary',
//         }}
//       >
//         Prescription Overview
//       </Typography>
      
//       <Grid container spacing={3}>
//         {statCards.map((stat, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card
//               sx={{
//                 transition: 'all 0.3s ease-in-out',
//                 '&:hover': {
//                   transform: 'translateY(-4px)',
//                   boxShadow: (theme) => theme.shadows[8],
//                 },
//               }}
//             >
//               <CardContent sx={{ p: 3 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                   <Avatar
//                     sx={{
//                       bgcolor: `${stat.color}20`,
//                       color: stat.color,
//                       width: 48,
//                       height: 48,
//                     }}
//                   >
//                     <stat.icon />
//                   </Avatar>
//                   <Box sx={{ textAlign: 'right' }}>
//                     <Typography
//                       variant="h4"
//                       sx={{
//                         fontWeight: 'bold',
//                         color: stat.color,
//                         lineHeight: 1,
//                       }}
//                     >
//                       {stat.value}
//                     </Typography>
//                   </Box>
//                 </Box>
                
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     fontWeight: 'medium',
//                     mb: 0.5,
//                     color: 'text.primary',
//                   }}
//                 >
//                   {stat.title}
//                 </Typography>
                
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: 'text.secondary',
//                     fontSize: '0.85rem',
//                   }}
//                 >
//                   {stat.description}
//                 </Typography>

//                 {/* Progress bar for visual appeal */}
//                 <Box sx={{ mt: 2 }}>
//                   <LinearProgress
//                     variant="determinate"
//                     value={Math.min((typeof stat.value === 'number' ? stat.value : 0) * 10, 100)}
//                     sx={{
//                       height: 4,
//                       borderRadius: 2,
//                       backgroundColor: `${stat.color}20`,
//                       '& .MuiLinearProgress-bar': {
//                         backgroundColor: stat.color,
//                         borderRadius: 2,
//                       },
//                     }}
//                   />
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Monthly comparison */}
//       {stats.totalPrescriptions > 0 && (
//         <Paper sx={{ p: 3, mt: 3, backgroundColor: 'grey.50' }}>
//           <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
//             Monthly Activity
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={6}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                   {stats.thisMonthCount}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   This Month
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={6}>
//               <Box sx={{ textAlign: 'center' }}>
//                 <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
//                   {stats.lastMonthCount}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Last Month
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default PrescriptionStats;
