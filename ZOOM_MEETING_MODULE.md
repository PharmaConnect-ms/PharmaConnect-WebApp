# Zoom Meeting Integration Module

This module provides comprehensive Zoom meeting integration for the PharmaConnect application, allowing both doctors and patients to join online appointments through embedded Zoom meetings.

## Features

- **Embedded Zoom Meetings**: Full Zoom Web SDK integration for in-browser meetings
- **Role-based Access**: Separate interfaces for doctors and patients
- **Reusable Components**: Modular design for easy integration across the app
- **Error Handling**: Comprehensive error handling and loading states
- **Meeting Link Parsing**: Support for various Zoom URL formats
- **Responsive Design**: Works on desktop and mobile devices

## File Structure

```
src/
├── components/
│   ├── ZoomMeetingComponent.tsx      # Core Zoom SDK integration
│   ├── JoinMeetingButton.tsx         # Reusable join meeting button
│   └── UserAppointmentCard.tsx       # User appointment card with meeting button
├── hooks/
│   └── useZoomMeeting.ts             # Reusable meeting logic
├── app/
│   ├── doctor/
│   │   └── appointments/
│   │       └── zoom-meeting/
│   │           └── page.tsx          # Doctor meeting page
│   ├── user/
│   │   └── zoom-meeting/
│   │       └── page.tsx              # Patient meeting page
│   ├── test/
│   │   └── zoom-meeting/
│   │       └── page.tsx              # Test page for development
│   └── api/
│       └── zoom/
│           └── signature/
│               └── route.ts          # Zoom signature generation API
```

## Setup

### Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
```

### Zoom App Configuration

1. Create a Zoom App in the [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Choose "Web SDK" as the app type
3. Get your Client ID and Client Secret
4. Configure your domains in the Zoom app settings

## Usage

### For Appointments with Meeting Links

Any appointment with `type: "online"` and a `meetingLink` field will automatically show a "Join Meeting" button when using the provided components.

### Using the JoinMeetingButton Component

```tsx
import JoinMeetingButton from '@/components/JoinMeetingButton';

<JoinMeetingButton
  appointment={appointment}
  patientName={patient.username}
  userType="doctor" // or "patient"
  variant="contained"
  size="small"
/>
```

### Using the useZoomMeeting Hook

```tsx
import { useZoomMeeting } from '@/hooks/useZoomMeeting';

const { joinMeeting } = useZoomMeeting();

const handleJoinMeeting = () => {
  joinMeeting({
    appointmentId: appointment.id,
    meetingLink: appointment.meetingLink,
    patientName: patient.username,
    doctorName: doctor.username,
    userType: 'doctor' // or 'patient'
  });
};
```

### Direct Navigation to Meeting Pages

#### For Doctors:
```
/doctor/appointments/zoom-meeting?appointmentId=123&meetingLink=https://zoom.us/j/123456789&patientName=John&doctorName=Smith
```

#### For Patients:
```
/user/zoom-meeting?appointmentId=123&meetingLink=https://zoom.us/j/123456789&patientName=John&doctorName=Smith
```

## Supported Zoom URL Formats

The module can parse various Zoom meeting link formats:

1. **Standard Zoom URLs**: `https://zoom.us/j/123456789?pwd=password123`
2. **Direct Meeting Numbers**: `123456789`
3. **Custom Zoom URLs**: Any URL containing `/j/[meeting_number]`

## API Endpoints

### POST /api/zoom/signature

Generates Zoom Web SDK signatures for meeting authentication.

**Request:**
```json
{
  "meetingNumber": "123456789",
  "role": 0
}
```

**Response:**
```json
{
  "signature": "generated_signature",
  "sdkKey": "client_id",
  "timestamp": 1640995200000
}
```

## Components

### ZoomMeetingComponent

Core component that handles Zoom Web SDK integration.

**Props:**
- `meetingNumber`: string - Zoom meeting number
- `meetingPassword`: string - Meeting password (optional)
- `signature`: string - Generated signature for authentication
- `userName`: string - Display name for the user
- `userEmail`: string - User email
- `onMeetingEnd`: () => void - Callback when meeting ends
- `onError`: (error: string) => void - Error callback

### JoinMeetingButton

Reusable button component for joining meetings.

**Props:**
- `appointment`: AppointmentResponse - Appointment object
- `patientName`: string - Patient display name
- `userType`: 'doctor' | 'patient' - User role
- `variant`: 'contained' | 'outlined' | 'text' - Button style
- `size`: 'small' | 'medium' | 'large' - Button size
- `className`: string - Additional CSS classes

## Integration with Existing Appointment System

The module integrates seamlessly with the existing appointment system:

1. **PatientInfoCard**: Automatically shows join meeting button for online appointments
2. **Appointment Lists**: Use `UserAppointmentCard` or add `JoinMeetingButton` to existing cards
3. **Appointment Details**: Meeting functionality is available wherever appointment data is displayed

## Testing

Visit `/test/zoom-meeting` to test the integration with sample data.

## Error Handling

The module handles various error scenarios:

- Invalid meeting links
- Network connectivity issues
- Zoom SDK loading failures
- Meeting authentication errors
- Missing environment variables

## Security Considerations

- Meeting signatures are generated server-side to protect the client secret
- Meeting links are validated before processing
- User authentication should be verified before allowing meeting access
- Consider implementing meeting room access controls based on appointment status

## Browser Compatibility

The Zoom Web SDK requires modern browsers with WebRTC support:
- Chrome 58+
- Firefox 60+
- Safari 12+
- Edge 79+

## Future Enhancements

Potential improvements for the module:

1. **Meeting Recording**: Add recording capabilities for consultations
2. **Screen Sharing**: Enhanced screen sharing controls for medical consultations
3. **Meeting Analytics**: Track meeting duration and participation
4. **Calendar Integration**: Sync with calendar systems
5. **Breakout Rooms**: Support for group consultations
6. **Mobile App Integration**: Deep linking to Zoom mobile app
7. **Meeting Scheduling**: Direct integration with Zoom's scheduling API

## Troubleshooting

### Common Issues:

1. **"Failed to load Zoom SDK"**
   - Check internet connectivity
   - Verify domain is whitelisted in Zoom app settings

2. **"Invalid meeting link format"**
   - Ensure meeting link follows supported formats
   - Check for typos in the meeting URL

3. **"Failed to generate meeting signature"**
   - Verify environment variables are set correctly
   - Check Zoom app credentials

4. **Meeting doesn't start**
   - Check browser compatibility
   - Ensure WebRTC is enabled
   - Try refreshing the page
