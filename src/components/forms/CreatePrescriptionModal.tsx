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
  Alert
} from '@mui/material';
import { 
  Close, 
  CloudUpload, 
  Image as ImageIcon,
  Delete 
} from '@mui/icons-material';
import Image from 'next/image';

interface CreatePrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { file: File; patientName: string; notes?: string }) => void;
  isLoading?: boolean;
  patientName: string;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please select a prescription image');
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
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
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
      
      <DialogContent className="p-6">
        <Box className="space-y-6">
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* File Upload Area */}
          <Box>
            <Typography variant="subtitle1" className="font-medium mb-3">
              Upload Prescription Image *
            </Typography>
            
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

          {/* Notes Field */}
          <Box>
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
          <Paper className="p-4 bg-blue-50 border border-blue-200">
            <Typography variant="subtitle2" className="font-medium text-blue-800 mb-1">
              Patient Information
            </Typography>
            <Typography variant="body2" className="text-blue-700">
              This prescription will be created for: <strong>{patientName}</strong>
            </Typography>
          </Paper>
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
