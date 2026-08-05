# Khushi Finance - Mobile App Design

## Overview
Khushi Finance is a microfinance management application designed for Android with two distinct user roles: **Admin** and **Member**. The app follows Apple Human Interface Guidelines (HIG) adapted for Android Material Design 3, optimized for portrait orientation and one-handed usage.

---

## Screen List

### Authentication Screens
1. **Login Screen** - Role selection (Admin/Member) and credentials entry
2. **Admin Login** - Secure login with email/password
3. **Member Login** - Login with mobile number + OTP or password
4. **OTP Verification** - OTP entry and verification for members

### Admin Screens
5. **Admin Dashboard** - Overview of key metrics
6. **Members List** - Search, view, add, edit, delete members
7. **Member Detail** - View member profile and loan history
8. **Add/Edit Member** - Form to add or edit member information
9. **Loans List** - View all loans with approval status
10. **Loan Detail** - View loan details and approve/reject
11. **EMI Recording** - Record monthly installment payments
12. **Payment History** - View all payments for a specific loan
13. **Reports** - Daily and monthly collection reports
14. **Settings** - Configure loan duration, view app settings

### Member Screens
15. **Member Dashboard** - View current loan status and balance
16. **Loan Details** - View current loan information
17. **Payment History** - View complete payment history
18. **Loan Statement** - Download loan statement as PDF
19. **Member Profile** - View personal information
20. **Settings** - Language selection, logout

---

## Primary Content and Functionality

### Admin Dashboard
**Content:**
- Total Members (card with count)
- Active Loans (card with count)
- Today's Collection (amount in rupees)
- Monthly Collection (amount in rupees)
- Pending Installments (count)
- Total Outstanding (amount in rupees)
- Quick action buttons (Add Member, Record Payment, View Reports)

**Functionality:**
- Tap cards to navigate to detailed views
- Pull-to-refresh to update metrics
- Navigation to all admin modules

### Members List
**Content:**
- Search bar (by name or mobile number)
- List of all members with:
  - Member name
  - Mobile number
  - Current loan status (Active/Inactive)
  - Outstanding balance
- Floating action button to add new member

**Functionality:**
- Search and filter members
- Tap member to view details
- Swipe to delete (with confirmation)
- Long-press to edit member

### Member Detail (Admin View)
**Content:**
- Member profile information (name, mobile, address, etc.)
- Current loan details (if active)
- Total amount paid
- Remaining balance
- Next installment due date
- Payment history (last 5 payments)
- Action buttons (Edit, Delete, View Full History)

**Functionality:**
- View complete payment history
- Record new payment
- Edit member information
- Delete member (with confirmation)

### Add/Edit Member Form
**Content:**
- Text fields for:
  - Full Name
  - Mobile Number
  - Email (optional)
  - Address
  - Occupation
- Save and Cancel buttons

**Functionality:**
- Validate input (mobile number format, required fields)
- Save member to database
- Show success/error messages

### Loans List
**Content:**
- Filter tabs (All, Active, Pending Approval, Completed)
- List of loans with:
  - Member name
  - Loan amount
  - Loan status
  - Approval status
  - Loan start date

**Functionality:**
- Filter by status
- Tap to view loan details
- Approve/reject pending loans

### Loan Detail
**Content:**
- Member information
- Loan amount
- Loan duration (6, 12, 18, or 24 months)
- Interest rate (2% monthly)
- Total payable amount
- Monthly installment (EMI)
- Remaining balance
- Payment schedule
- Approval/rejection buttons (if pending)

**Functionality:**
- Approve or reject loan
- View payment schedule
- Record payment
- Generate PDF receipt

### EMI Recording
**Content:**
- Member selection dropdown
- Loan selection (for member)
- Payment date picker
- Payment amount (auto-calculated)
- Payment method (Cash/Check/Bank Transfer)
- Notes field
- Submit button

**Functionality:**
- Auto-calculate EMI amount
- Validate payment date
- Record payment and update balance
- Generate PDF receipt
- Show success message

### Payment History
**Content:**
- List of all payments for a loan with:
  - Payment date
  - Amount paid
  - Payment method
  - Remaining balance
  - Receipt download button

**Functionality:**
- Download receipt as PDF
- Filter by date range
- View payment details

### Reports
**Content:**
- Date range selector
- Report type selector (Daily/Monthly)
- Report summary:
  - Total collections
  - Number of payments
  - Outstanding amount
- Detailed list of collections
- Export buttons (PDF/Excel)

**Functionality:**
- Generate daily/monthly reports
- Export to PDF
- Export to Excel
- View report details

### Member Dashboard
**Content:**
- Current loan status card with:
  - Loan amount
  - Remaining balance
  - Next installment due date
  - Days until due
- Quick stats:
  - Total amount paid
  - Total amount remaining
- Payment history (last 3 payments)
- Download statement button

**Functionality:**
- View loan details
- Download statement
- View payment history
- See next payment due date

### Member Loan Details
**Content:**
- Loan amount
- Loan duration
- Monthly interest rate (2%)
- Total payable amount
- Monthly installment (EMI)
- Remaining balance
- Payment schedule (all months)
- Overdue amount (if any)

**Functionality:**
- View complete payment schedule
- See which payments are overdue
- Download statement

### Member Payment History
**Content:**
- List of all payments with:
  - Payment date
  - Amount paid
  - Remaining balance
  - Payment method
  - Receipt download button

**Functionality:**
- Download receipt as PDF
- Filter by date range
- View payment details

### Member Loan Statement
**Content:**
- Member information
- Loan details
- Payment schedule
- Payment history
- Summary (total paid, remaining, overdue)

**Functionality:**
- Download as PDF
- Share statement

---

## Key User Flows

### Admin Flow: Record Monthly Payment
1. Admin taps "Record Payment" on dashboard
2. Selects member from dropdown
3. System auto-loads member's active loan
4. Enters payment date and amount (auto-calculated)
5. Selects payment method
6. Taps "Submit Payment"
7. System updates balance and generates receipt
8. Admin can download/print receipt

### Admin Flow: Approve New Loan
1. Admin navigates to Loans List
2. Filters to "Pending Approval"
3. Taps on pending loan
4. Reviews loan details and member information
5. Taps "Approve" or "Reject"
6. Adds notes (optional)
7. Confirms action
8. System updates loan status and notifies member

### Member Flow: View Loan Status
1. Member logs in with mobile number + OTP
2. Dashboard shows current loan status
3. Member can tap to view:
   - Loan details
   - Payment history
   - Next payment due date
   - Overdue amount (if any)
4. Member can download loan statement

### Admin Flow: Generate Report
1. Admin navigates to Reports
2. Selects date range
3. Selects report type (Daily/Monthly)
4. System generates report with:
   - Total collections
   - Payment details
   - Outstanding amounts
5. Admin can export to PDF or Excel

---

## Color Choices

### Primary Colors
- **Primary Tint**: #0a7ea4 (Professional Blue) - Used for buttons, links, and key actions
- **Success**: #22C55E (Green) - Used for approved loans, successful payments
- **Warning**: #F59E0B (Amber) - Used for pending approvals, overdue payments
- **Error**: #EF4444 (Red) - Used for rejected loans, errors

### Neutral Colors
- **Background**: #ffffff (Light) / #151718 (Dark)
- **Surface**: #f5f5f5 (Light) / #1e2022 (Dark)
- **Foreground**: #11181C (Light) / #ECEDEE (Dark)
- **Muted**: #687076 (Light) / #9BA1A6 (Dark)
- **Border**: #E5E7EB (Light) / #334155 (Dark)

### Financial-Specific Colors
- **Paid Amount**: #22C55E (Green)
- **Outstanding Amount**: #0a7ea4 (Blue)
- **Overdue Amount**: #EF4444 (Red)

---

## Typography & Spacing

### Font Sizes
- **Heading 1**: 32px (bold) - Screen titles
- **Heading 2**: 24px (semibold) - Section headers
- **Heading 3**: 18px (semibold) - Card titles
- **Body**: 16px (regular) - Main content
- **Small**: 14px (regular) - Secondary text
- **Tiny**: 12px (regular) - Labels, captions

### Spacing
- **Padding**: 16px (standard), 12px (compact), 24px (generous)
- **Gap**: 8px (tight), 12px (standard), 16px (loose)
- **Border Radius**: 12px (standard), 8px (compact), 16px (generous)

---

## Interaction Patterns

### Buttons
- **Primary Button**: Solid background with primary color, white text, 12px border radius
- **Secondary Button**: Outlined style with primary color border, transparent background
- **Danger Button**: Solid red background with white text (for delete/reject actions)

### Cards
- **Metric Cards**: Rounded corners, subtle shadow, padding 16px
- **List Items**: Full-width, 16px padding, 1px bottom border, tap feedback (opacity 0.7)

### Forms
- **Text Input**: 12px border radius, 12px padding, border color on focus
- **Dropdown**: Similar to text input, chevron icon on right
- **Date Picker**: Native date picker with modal presentation

### Navigation
- **Tab Bar**: Bottom navigation with 5 tabs (Admin) or 4 tabs (Member)
- **Header**: Title with back button, action buttons on right
- **Modals**: Full-screen or half-screen sheet with close button

---

## Accessibility

- **Minimum Touch Target**: 44x44 points
- **Color Contrast**: WCAG AA standard (4.5:1 for text)
- **Text Scaling**: Support up to 200% text scaling
- **Dark Mode**: Full support with automatic color switching
- **Haptic Feedback**: Light haptics on button press

---

## Responsive Layout

- **Portrait Orientation**: Primary layout (9:16 aspect ratio)
- **One-Handed Usage**: Critical buttons positioned in bottom half
- **Safe Area**: Respect notches and home indicators
- **Tablet Support**: Adaptive layout for larger screens (if needed)

---

## Multi-Language Support

- **English**: Default language
- **Hindi (हिंदी)**: Full translation
- **Gujarati (ગુજરાતી)**: Full translation
- **Language Selector**: Available in settings
- **RTL Support**: Not required (all languages are LTR)

---

## Dark Mode

- All screens support automatic dark mode
- Colors automatically adjust based on system preference
- User can override in settings
- No manual "dark:" prefix needed in Tailwind classes (handled by theme provider)

