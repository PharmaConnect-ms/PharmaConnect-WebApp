"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Fade,
  Grow,
  Slide,
  useTheme,
  alpha
} from "@mui/material";
import {
  LocalHospital,
  People,
  Assignment,
  Security,
  Timeline,
  HealthAndSafety
} from "@mui/icons-material";

const features = [
  {
    icon: <LocalHospital sx={{ fontSize: 40 }} />,
    title: "Digital Prescriptions",
    description: "Secure digital prescription management for modern healthcare"
  },
  {
    icon: <People sx={{ fontSize: 40 }} />,
    title: "Patient Management",
    description: "Comprehensive patient records and appointment scheduling"
  },
  {
    icon: <Assignment sx={{ fontSize: 40 }} />,
    title: "Medical Records",
    description: "Centralized medical history and treatment tracking"
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: "Secure Platform",
    description: "HIPAA-compliant security for all medical data"
  },
  {
    icon: <Timeline sx={{ fontSize: 40 }} />,
    title: "Analytics",
    description: "Advanced reporting and healthcare analytics"
  },
  {
    icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
    title: "Care Coordination",
    description: "Seamless communication between all healthcare providers"
  }
];

export default function Home() {
  const theme = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowFeatures(true), 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Header */}
      <Slide direction="down" in={true} timeout={800}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'transparent',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <LocalHospital sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                PharmaConnect
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                href="/login"
                variant="contained"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                href="/signup"
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Fade in={showContent} timeout={1000}>
            <Box>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'pulse 2s ease-in-out infinite alternate',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.8 },
                    '100%': { opacity: 1 }
                  }
                }}
              >
                Welcome to PharmaConnect
              </Typography>
            </Box>
          </Fade>
          
          <Grow in={showContent} timeout={1200}>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                maxWidth: 600, 
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              A comprehensive digital healthcare platform connecting patients, doctors, and administrators through secure, modern technology.
            </Typography>
          </Grow>

          <Fade in={showContent} timeout={1500}>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              size="large"
              sx={{ 
                px: 6, 
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Today
            </Button>
          </Fade>
        </Box>

        {/* Features Section */}
        <Box sx={{ mt: 12 }}>
          <Fade in={showFeatures} timeout={1000}>
            <Typography 
              variant="h4" 
              textAlign="center" 
              sx={{ 
                mb: 6, 
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              Why Choose PharmaConnect?
            </Typography>
          </Fade>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Grow 
                  in={showFeatures} 
                  timeout={1000 + (index * 200)}
                  style={{ transformOrigin: '0 0 0' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 0 }}>
                      <Box 
                        sx={{ 
                          color: 'primary.main', 
                          mb: 2,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 2,
                          color: 'text.primary'
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Slide direction="up" in={showFeatures} timeout={1000}>
        <Box sx={{ 
          bgcolor: alpha(theme.palette.grey[900], 0.95), 
          color: 'white', 
          py: 4, 
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          mt: 8
        }}>
          <Typography sx={{ fontSize: '1.3rem', mb: 1, fontWeight: 600 }}>
            PharmaConnect
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            &copy; {new Date().getFullYear()} PharmaConnect. All rights reserved.
          </Typography>
        </Box>
      </Slide>
    </Box>
  );
}
