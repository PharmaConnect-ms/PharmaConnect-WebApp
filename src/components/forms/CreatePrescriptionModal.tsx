"use client";

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Close, 
  CloudUpload, 
  Image as ImageIcon,
  Delete,
  Edit,
  Draw,
  Upload
} from '@mui/icons-material';
import Image from 'next/image';
import AddPrescriptionModal from '../../app/doctor/appointments/[id]/module/components/organisms/add-prescription-modal';
import type { RichTextPayload } from '../../app/doctor/appointments/[id]/module/components/molecules/PrescriptionRichTextEditor';
import type { DrawingPayload } from '../../app/doctor/appointments/[id]/module/components/molecules/PrescriptionCanvas';

interface CreatePrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { file: File; patientName: string; notes?: string }) => void;
  isLoading?: boolean;
  patientName: string;
}

type TabValue = 'upload' | 'create';

const CreatePrescriptionModal: React.FC<CreatePrescriptionModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  patientName
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
    // Clear any existing file/preview when switching tabs
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file only');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setError(null);
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Convert canvas data URL to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    console.log('Converting data URL to file:', { dataUrlLength: dataurl.length, filename });
    
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], filename, { type: mime });
    
    console.log('Created file from data URL:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    return file;
  };

  // Convert HTML to canvas and then to image
  const htmlToImage = (html: string, patientName: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add border
      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Add header
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(20, 20, canvas.width - 40, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('PRESCRIPTION', 40, 55);

      // Add patient name
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Patient: ${patientName}`, 40, 110);

      // Add date
      ctx.font = '14px Arial';
      ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 40, 135);

      // Parse HTML and add content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      ctx.fillStyle = '#333333';
      ctx.font = '16px Arial';
      
      const lines = textContent.split('\n');
      let y = 170;
      const lineHeight = 25;
      const maxWidth = canvas.width - 80;

      lines.forEach(line => {
        if (y > canvas.height - 100) return; // Prevent overflow
        
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && currentLine !== '') {
            ctx.fillText(currentLine.trim(), 40, y);
            currentLine = word + ' ';
            y += lineHeight;
          } else {
            currentLine = testLine;
          }
        });
        
        if (currentLine.trim()) {
          ctx.fillText(currentLine.trim(), 40, y);
          y += lineHeight;
        }
      });

      // Convert canvas to file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `prescription-${patientName}-${Date.now()}.png`, { type: 'image/png' });
          console.log('Created file from HTML canvas:', {
            name: file.name,
            size: file.size,
            type: file.type
          });
          resolve(file);
        } else {
          console.error('Failed to create blob from canvas');
          reject(new Error('Failed to create image from text'));
        }
      }, 'image/png');
    });
  };

  const handleSavePrescription = async (payload: RichTextPayload | DrawingPayload) => {
    try {
      let file: File;

      if (payload.type === 'text') {
        // Convert rich text to image
        file = await htmlToImage(payload.html, patientName);
      } else {
        // Drawing payload
        if (!payload.dataUrl) {
          setError('No drawing data available');
          return;
        }
        file = dataURLtoFile(payload.dataUrl, `prescription-${patientName}-${Date.now()}.png`);
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setError(null);
    } catch (err) {
      console.error('Error processing prescription:', err);
      setError('Failed to process prescription. Please try again.');
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please create or upload a prescription');
      return;
    }

    // Additional validation and logging
    console.log('Submitting prescription with file:', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified
    });

    // Validate file exists and is valid
    if (selectedFile.size === 0) {
      setError('Selected file appears to be empty');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    onSubmit({
      file: selectedFile,
      patientName,
      notes: notes.trim()
    });
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setNotes('');
    setError(null);
    setActiveTab('upload');
    onClose();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px', maxHeight: '90vh' }
      }}
    >
      <DialogTitle className="flex items-center justify-between border-b">
        <Typography variant="h6" className="font-semibold">
          Create New Prescription for {patientName}
        </Typography>
        <IconButton onClick={handleClose} disabled={isLoading}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="p-0">
        <Box>
          {/* Tab Navigation */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            className="border-b"
            variant="fullWidth"
          >
            <Tab 
              label="Upload Image" 
              value="upload" 
              icon={<Upload />}
              iconPosition="start"
              className="min-h-[64px]"
            />
            <Tab 
              label="Create Prescription" 
              value="create" 
              icon={<Edit />}
              iconPosition="start"
              className="min-h-[64px]"
            />
          </Tabs>

          <Box className="p-6">
            {error && (
              <Alert severity="error" onClose={() => setError(null)} className="mb-4">
                {error}
              </Alert>
            )}

            {/* Upload Tab Content */}
            {activeTab === 'upload' && (
              <Box className="space-y-6">
                {!selectedFile ? (
                  <Paper className="p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer transition-all duration-300">
                    <input 
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Box className="text-center" onClick={handleUploadClick}>
                      <CloudUpload 
                        className="mx-auto mb-4 text-gray-400"
                        sx={{ fontSize: 48 }}
                      />
                      <Typography variant="h6" className="mb-2">
                        Click to upload prescription image
                      </Typography>
                      <Typography variant="body2" className="text-gray-500 mb-3">
                        Select an image file from your device
                      </Typography>
                      <Button variant="outlined" className="mt-2">
                        Browse Files
                      </Button>
                      <Typography variant="caption" className="block mt-3 text-gray-400">
                        Supported formats: JPEG, PNG, GIF, BMP (Max 5MB)
                      </Typography>
                    </Box>
                  </Paper>
                ) : (
                  <Paper className="p-4 border">
                    <Box className="flex items-start gap-4">
                      {preview && (
                        <Box className="relative">
                          <Image
                            src={preview}
                            alt="Prescription preview"
                            width={120}
                            height={120}
                            className="rounded object-cover border"
                          />
                        </Box>
                      )}
                      
                      <Box className="flex-1">
                        <Box className="flex items-center gap-2 mb-2">
                          <ImageIcon className="text-blue-500" />
                          <Typography variant="subtitle2" className="font-medium">
                            {selectedFile.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" className="text-gray-500 block">
                          Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 block">
                          Type: {selectedFile.type}
                        </Typography>
                      </Box>
                      
                      <IconButton 
                        onClick={removeFile}
                        color="error"
                        size="small"
                        disabled={isLoading}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                )}
              </Box>
            )}

            {/* Create Tab Content */}
            {activeTab === 'create' && (
              <Box className="space-y-4">
                <Box className="flex items-center gap-2 mb-4">
                  <Draw className="text-blue-500" />
                  <Typography variant="h6" className="font-medium">
                    Create Your Prescription
                  </Typography>
                </Box>
                
                {!selectedFile ? (
                  <Paper className="border rounded-lg overflow-hidden">
                    <AddPrescriptionModal
                      onSavePrescription={handleSavePrescription}
                      onClose={() => {}} // Prevent closing, we handle it here
                    />
                  </Paper>
                ) : (
                  <Box>
                    <Alert severity="success" className="mb-4">
                      Prescription created successfully! You can modify it or proceed to save.
                    </Alert>
                    <Paper className="p-4 border">
                      <Box className="flex items-start gap-4">
                        {preview && (
                          <Box className="relative">
                            <Image
                              src={preview}
                              alt="Created prescription preview"
                              width={200}
                              height={150}
                              className="rounded object-cover border"
                            />
                          </Box>
                        )}
                        
                        <Box className="flex-1">
                          <Box className="flex items-center gap-2 mb-2">
                            <ImageIcon className="text-green-500" />
                            <Typography variant="subtitle2" className="font-medium">
                              {selectedFile.name}
                            </Typography>
                          </Box>
                          <Typography variant="caption" className="text-gray-500 block">
                            Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>
                          <Typography variant="caption" className="text-gray-500 block">
                            Type: {selectedFile.type}
                          </Typography>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={removeFile}
                            startIcon={<Edit />}
                            className="mt-2"
                          >
                            Create New
                          </Button>
                        </Box>
                        
                        <IconButton 
                          onClick={removeFile}
                          color="error"
                          size="small"
                          disabled={isLoading}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Box>
            )}

            {/* Notes Field - Always visible */}
            <Box className="mt-6">
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Notes (Optional)"
                placeholder="Enter any additional notes about the prescription..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                variant="outlined"
              />
            </Box>

            {/* Patient Information */}
            <Paper className="p-4 bg-blue-50 border border-blue-200 mt-6">
              <Typography variant="subtitle2" className="font-medium text-blue-800 mb-1">
                Patient Information
              </Typography>
              <Typography variant="body2" className="text-blue-700">
                This prescription will be created for: <strong>{patientName}</strong>
              </Typography>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      
      <Box className="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <Button 
          variant="outlined" 
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Creating...' : 'Create Prescription'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default CreatePrescriptionModal;
