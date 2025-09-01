# Prescription Dashboard UI

A beautiful and comprehensive prescription management UI built with Material-UI and React. This implementation provides a modern, responsive interface for viewing and managing medical prescriptions.

## Features

### 🔍 **Advanced Search & Filtering**
- Real-time search across patient names, doctor names, and prescription IDs
- Sort by date (newest first), doctor name, or patient name
- Dynamic result counter with live filtering

### 📊 **Prescription Statistics Dashboard**
- Total prescriptions count
- Unique doctors consulted
- Recent prescriptions (last 30 days)
- Monthly growth comparison with visual indicators
- Interactive progress bars and trend visualization

### 📱 **Responsive Card Layout**
- Beautiful gradient-themed prescription cards
- Hover animations and elevation effects
- Quick actions: View Details and Download
- Fallback image support for missing prescription images

### 🔍 **Detailed Modal View**
- Full-screen responsive modal on mobile
- High-quality prescription image viewer
- Complete patient and doctor information
- Prescription metadata (ID, creation date)
- Download functionality

### 🎨 **Modern UI Design**
- Material-UI components with custom theming
- Gradient backgrounds and smooth animations
- Consistent PharmaConnect branding colors
- Mobile-first responsive design
- Accessibility-compliant interfaces

## Components

### 1. PrescriptionList
Main container component that orchestrates the entire prescription dashboard.

**Props:**
- `prescriptions`: Array of prescription data
- `loading`: Loading state boolean
- `error`: Optional error message

**Features:**
- Statistics overview
- Search and filter controls
- Grid layout for prescription cards
- Empty state handling
- Loading state with spinner
- Floating action button for quick actions

### 2. PrescriptionCard
Individual prescription display card with essential information and actions.

**Props:**
- `prescription`: Single prescription object
- `onView`: Callback for viewing prescription details
- `onDownload`: Callback for downloading prescription image

**Features:**
- Gradient header with patient info
- Prescription image preview
- Doctor information badge
- Prescription ID chip
- Action buttons with icons

### 3. PrescriptionViewModal
Detailed view modal for comprehensive prescription information.

**Props:**
- `prescription`: Prescription object to display
- `open`: Modal visibility state
- `onClose`: Callback for closing modal

**Features:**
- Full-screen on mobile devices
- High-quality image display with Next.js optimization
- Structured information layout
- Patient and doctor details
- Download functionality

### 4. PrescriptionStats
Statistics overview component showing prescription analytics.

**Props:**
- `prescriptions`: Array of prescription data for analysis

**Features:**
- Total prescription count
- Unique doctors statistics
- Recent activity tracking
- Monthly growth comparison
- Visual progress indicators
- Responsive grid layout

## Installation & Usage

1. **Import the components:**
```tsx
import { PrescriptionList } from '@/components/prescription';
// or
import PrescriptionList from '@/components/prescription/PrescriptionList';
```

2. **Use in your component:**
```tsx
const YourComponent = () => {
  const { prescriptions, loading } = usePrescriptionDashboard();
  
  return (
    <PrescriptionList
      prescriptions={prescriptions}
      loading={loading}
    />
  );
};
```

## Data Structure

The components expect prescription data in the following format:

```typescript
interface PrescriptionResponse {
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
```

## Styling

The components use the PharmaConnect theme colors:
- Primary: `#56AAF0`
- Secondary: `#42C5E7`

All components are fully responsive and follow Material Design principles with custom enhancements for the healthcare domain.

## File Structure

```
src/components/prescription/
├── PrescriptionCard.tsx      # Individual prescription card
├── PrescriptionList.tsx      # Main list container
├── PrescriptionStats.tsx     # Statistics dashboard
├── PrescriptionViewModal.tsx # Detailed view modal
└── index.ts                  # Exports
```

## Key Features Implementation

### Image Handling
- Next.js Image component for optimization
- Fallback image support for missing prescriptions
- Error handling for broken image links

### Performance
- React.useMemo for filtering and sorting
- Optimized re-renders
- Efficient search implementation

### User Experience
- Smooth animations and transitions
- Loading states with descriptive text
- Empty states with helpful messaging
- Intuitive search and filter controls

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

This implementation provides a professional, healthcare-focused prescription management interface that enhances user experience while maintaining functionality and performance.
