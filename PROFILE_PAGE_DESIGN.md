# Profile Page Design

## Overview
The profile page provides users with a comprehensive view of their account information and quick access to account management features.

## Features

### 1. **Profile Overview (Left Sidebar)**
- **Avatar**: Displays user initials in a gradient circle
- **User Information**: Name, username, and role badge
- **Quick Actions**:
  - Edit Profile
  - Change Password
  - Logout

### 2. **Personal Information Card**
Displays user's personal details:
- Full Name
- Username (read-only)
- Email Address

### 3. **Account Information Card**
Shows role and permissions:
- **Role Badge**: Color-coded based on role level
  - Super Admin / Admin: Red (destructive)
  - Faculty/Department Admin: Blue (default)
  - Office Manager: Gray (secondary)
  - Viewer/User: Outlined
- **Office**: Assigned office name
- **Permissions**: List of user permissions as badges

### 4. **System Information Card**
Technical details:
- User ID
- Office ID (if assigned)

## Interactive Features

### Edit Profile Dialog
- Update Full Name
- Update Email Address
- Username is read-only
- Form validation
- Success/error toast notifications

### Change Password Dialog
- Current password verification
- New password with confirmation
- Password visibility toggle
- Form validation:
  - Minimum 6 characters
  - Password match verification
- Success/error toast notifications

## Role-Based Badge Colors

| Role | Variant | Color |
|------|---------|-------|
| SUPER_ADMIN | destructive | Red |
| ADMIN | destructive | Red |
| FACULTY_ADMIN | default | Blue |
| DEPARTMENT_ADMIN | default | Blue |
| OFFICE_MANAGER | secondary | Gray |
| VIEWER | outline | Border only |
| USER | outline | Border only |

## Design System

### Components Used
- **Card**: Main container for sections
- **Badge**: Role and permission tags
- **Button**: Actions and navigation
- **AlertDialog**: Edit profile and change password modals
- **Input**: Form fields
- **Label**: Form labels
- **Icons**: Lucide React icons

### Layout
- **Responsive Design**: 
  - Mobile: Single column
  - Desktop: 3-column grid (1/3 sidebar, 2/3 content)
- **Sticky Sidebar**: Profile card stays visible while scrolling
- **Max Width**: 7xl container for optimal reading

### Color Scheme
- Primary: Blue gradient (avatar)
- Background: Slate-50 for input fields
- Text: Slate-900 (primary), Slate-600 (secondary)
- Accent: Role-specific colors

## Routes

- `/profile` - Redirects to current user's profile
- `/profile/[id]` - Displays user profile by ID

## Future Enhancements

### TODO: API Integration
1. **Update Profile**: `PUT /api/users/{id}`
2. **Change Password**: `POST /api/users/{id}/change-password`
3. **Get User Details**: `GET /api/users/{id}`

### Potential Features
- Profile photo upload
- Activity history
- Connected devices/sessions
- Two-factor authentication
- Email preferences
- Notification settings
- Export user data
- Account deletion

## Usage

Users can access their profile by:
1. Clicking on their name/avatar in the header
2. Navigating to `/profile` route
3. Clicking profile link in the sidebar

## Security Considerations

- Current password required for password changes
- Password validation (minimum length)
- User can only edit their own profile
- Role and permissions are read-only (admin-managed)
- Authentication required to access profile

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Clear visual hierarchy
- Color-blind friendly design
- Screen reader compatible

## Responsive Breakpoints

- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - 2 columns
- **Desktop**: > 1024px - 3 columns with sticky sidebar
