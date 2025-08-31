# Doctor Appointment Interface

This module provides a comprehensive interface for doctors to interact with their patients during appointments.

## Features

### 🧑‍⚕️ Patient Information Card
- **Patient Overview**: Displays patient name, age, and avatar with initials
- **Appointment Status**: Shows current appointment status with color-coded badges
- **Patient Summary**: Displays the patient's medical summary for quick reference
- **Contact Information**: Email and phone details when available
- **Appointment Details**: Date, time, and appointment type (physical/online)

### 💊 Prescription Management
- **Prescription Gallery**: Visual grid of all patient prescriptions
- **Image Preview**: Click to view full-size prescription images
- **QR Code Generation**: Generate QR codes for easy prescription access
- **Download Functionality**: Direct download of prescription images
- **Creation Modal**: User-friendly interface to create new prescriptions with file upload

### 📚 Condition Books
- **Medical History**: Organized view of patient's condition books
- **Status Tracking**: Active, remission, or closed conditions with visual indicators
- **Severity Levels**: Color-coded severity indicators (mild, moderate, severe)
- **Treatment Goals**: Structured goal tracking and progress monitoring
- **Detailed View**: Complete condition information including allergies and instructions
- **Creation Wizard**: Step-by-step form to create new condition books

## Components Structure

```
src/app/doctor/appointments/[id]/module/
├── components/
│   ├── PatientInfoCard.tsx          # Patient overview component
│   ├── PrescriptionList.tsx         # Prescription management
│   ├── ConditionBooks.tsx          # Condition book management
│   └── index.ts                    # Component exports
├── logic/
│   └── use-appointment.ts          # Hook for appointment data
└── ui/
    └── appointment-ui.tsx          # Main appointment interface
```

## Reusable Components

```
src/components/forms/
├── CreatePrescriptionModal.tsx     # Prescription creation modal
├── CreateConditionBookModal.tsx    # Condition book creation modal
└── index.ts                       # Form exports
```

## Key Features Implementation

### 📱 Responsive Design
- **Desktop**: Two-column layout with prescription and condition books side by side
- **Mobile**: Stacked layout with full-width components
- **Card-based UI**: Clean, modern interface using Material-UI and Tailwind CSS

### 🔄 Real-time Updates
- **Optimistic Updates**: Immediate UI feedback for better user experience
- **Loading States**: Visual indicators during data operations
- **Error Handling**: User-friendly error messages with notification system

### 🎨 Visual Enhancements
- **Color-coded Status**: Different colors for appointment and condition statuses
- **Interactive Elements**: Hover effects and smooth transitions
- **Icon Integration**: Meaningful icons throughout the interface
- **Image Optimization**: Next.js Image component for prescription viewing

### 🔐 Data Validation
- **Form Validation**: Client-side validation for all forms
- **File Upload Validation**: Image type and size restrictions
- **Error Recovery**: Graceful error handling with user guidance

## Usage

The appointment interface is automatically loaded when a doctor navigates to `/doctor/appointments/[id]`. The component:

1. **Fetches Data**: Loads appointment, patient, prescriptions, and condition books
2. **Displays Overview**: Shows patient information prominently
3. **Enables Actions**: Provides creation modals for prescriptions and condition books
4. **Manages State**: Handles loading, success, and error states gracefully

## Technical Stack

- **React 18** with TypeScript
- **Next.js** for routing and image optimization
- **Material-UI** for components and theming
- **Tailwind CSS** for styling
- **Redux Toolkit Query** for data fetching
- **React Hook Form** for form management
- **Date-fns** for date formatting

## API Integration

The interface integrates with the following APIs:
- `useGetAppointmentByIdQuery` - Appointment details
- `useGetUserByIdQuery` - Patient information
- `useGetPrescriptionByUserIdQuery` - Patient prescriptions
- `useGetAllConditionBooksByPatientIdQuery` - Patient condition books
- `useAddPrescriptionMutation` - Create prescriptions
- `useCreateConditionBookMutation` - Create condition books

## Future Enhancements

- 📹 **Video Call Integration**: Direct meeting links for online appointments
- 📊 **Analytics Dashboard**: Treatment progress tracking
- 🔔 **Notification System**: Real-time updates and alerts
- 📄 **PDF Generation**: Export prescriptions and condition books
- 🔍 **Advanced Search**: Filter and search through medical records
