# Khushi Finance - Project TODO

## Phase 1: Core App Structure & Authentication
- [x] Set up app navigation structure (Auth Stack, Admin Stack, Member Stack)
- [x] Create authentication context and hooks
- [x] Build role-based routing logic
- [x] Implement Admin Login screen (email/password)
- [x] Implement Member Login screen (mobile number + OTP/password)
- [x] Implement OTP verification flow
- [x] Create logout functionality
- [x] Fix logout so auth session storage is cleared and navigation returns to login
- [x] Diagnose why buttons across the app do not respond to taps
- [x] Restore shared button interaction and navigation behavior
- [x] Add focused interaction validation for representative buttons
- [x] Add focused logout-flow validation
- [x] Fix logout redirect from Expo development route list to role-selection/login screen
- [x] Validate logout navigation in the native development flow
- [x] Set up secure token storage (AsyncStorage + SecureStore)

## Phase 2: Multi-Language Support
- [x] Create i18n configuration (English, Hindi, Gujarati)
- [ ] Build language selection screen
- [x] Implement language context and hooks
- [x] Translate all UI strings to Hindi and Gujarati
- [x] Add language persistence to AsyncStorage
- [ ] Test language switching across all screens

## Phase 3: Admin Module - Dashboard & Members
- [x] Build Admin Dashboard screen with metrics cards
- [x] Implement pull-to-refresh functionality
- [x] Build Members List screen with search functionality
- [x] Implement member search by name and mobile number
- [x] Build Member Detail screen (Admin view)
- [x] Create Add Member form with validation
- [x] Create Edit Member form
- [x] Implement delete member functionality with confirmation
- [x] Build member profile view

## Phase 4: Admin Module - Loans & EMI
- [x] Build Loans List screen with status filters
- [x] Create Loan Detail screen
- [x] Implement loan approval/rejection functionality
- [x] Build EMI Recording screen
- [x] Implement automatic EMI calculation logic
- [x] Create payment method selection
- [x] Build payment history view
- [x] Implement payment date validation
- [x] Create receipt generation (PDF)

## Phase 5: Admin Module - Reports & Settings
- [ ] Build Reports screen with date range selector
- [ ] Implement daily report generation
- [ ] Implement monthly report generation
- [ ] Create PDF export functionality for reports
- [ ] Create Excel export functionality for reports
- [ ] Build Admin Settings screen
- [ ] Implement loan duration configuration (6, 12, 18, 24 months)
- [ ] Create app settings management

## Phase 6: Member Module - Dashboard & Profile
- [ ] Build Member Dashboard screen
- [ ] Display current loan status and balance
- [ ] Show next installment due date
- [ ] Create Member Profile screen
- [ ] Build Member Loan Details screen
- [ ] Display payment schedule
- [ ] Show overdue amount calculation
- [ ] Create Member Settings screen

## Phase 7: Member Module - Payment History & Statements
- [ ] Build Member Payment History screen
- [ ] Implement payment history filtering by date
- [ ] Create Loan Statement download functionality
- [ ] Implement PDF statement generation
- [ ] Add receipt download for individual payments
- [ ] Create statement sharing functionality

## Phase 8: Finance Logic & Calculations
- [x] Implement interest calculation (2% monthly)
- [x] Create EMI calculation logic
- [x] Implement total payable amount calculation
- [x] Build remaining balance calculation
- [x] Implement overdue amount calculation
- [x] Create payment schedule generator
- [x] Build automatic balance update on payment
- [x] Implement interest accrual logic

## Phase 9: Database & Backend Integration
- [ ] Set up Firestore collections (Admins, Members, Loans, Payments, Reports)
- [ ] Create admin authentication with Firebase Auth
- [ ] Create member authentication with Firebase Auth
- [ ] Implement member OTP verification
- [ ] Build data models for all collections
- [ ] Create CRUD operations for members
- [ ] Create CRUD operations for loans
- [ ] Create CRUD operations for payments
- [ ] Implement data validation on backend

## Phase 10: PDF & Report Generation
- [x] Set up PDF generation library
- [x] Create receipt template
- [x] Implement receipt PDF generation
- [ ] Create loan statement template
- [ ] Implement loan statement PDF generation
- [ ] Create daily report template
- [ ] Create monthly report template
- [ ] Implement Excel export for reports
- [ ] Test PDF generation on different devices

## Phase 11: UI Polish & Material Design 3
- [ ] Apply Material Design 3 color scheme
- [ ] Implement consistent typography
- [ ] Add proper spacing and padding
- [ ] Create reusable UI components (buttons, cards, inputs)
- [ ] Implement proper error handling UI
- [ ] Add loading states to all screens
- [ ] Create empty state screens
- [ ] Implement proper form validation messages
- [ ] Add success/error toast notifications

## Phase 12: Dark Mode & Accessibility
- [ ] Test dark mode on all screens
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Implement proper touch target sizes (44x44 minimum)
- [ ] Add haptic feedback to button presses
- [ ] Test text scaling up to 200%
- [ ] Verify keyboard navigation
- [ ] Add screen reader support labels
- [ ] Test on different device sizes

## Phase 13: App Branding & Icons
- [x] Generate custom app logo
- [x] Create app icon (square, no rounded corners)
- [x] Create splash screen icon
- [x] Create Android adaptive icon
- [x] Update app.config.ts with branding
- [x] Set app name to "Khushi Finance"
- [x] Configure app slug and bundle ID
- [x] Upload logo to S3 and update logoUrl

## Phase 14: Testing & Bug Fixes
- [ ] Test admin login flow
- [x] Identify configured Admin and Member login credentials or account-creation steps
- [ ] Test member login flow
- [ ] Test OTP verification
- [ ] Test member CRUD operations
- [ ] Test loan creation and approval
- [ ] Test EMI recording and calculations
- [ ] Test payment history display
- [ ] Test report generation
- [ ] Test PDF generation
- [ ] Test language switching
- [ ] Test dark mode
- [ ] Test on different screen sizes
- [ ] Test on different Android versions

## Phase 15: Final Delivery & Documentation
- [ ] Create comprehensive README
- [ ] Document API endpoints
- [ ] Document data models
- [ ] Create user guide for admin
- [ ] Create user guide for member
- [ ] Document installation steps
- [ ] Create troubleshooting guide
- [ ] Final code review
- [ ] Generate APK build
- [ ] Create release notes

## Extra Features (Future)
- [ ] WhatsApp payment reminders integration
- [ ] Push notifications for due dates
- [ ] Backup and restore functionality
- [ ] Member portal (web version)
- [ ] Advanced analytics dashboard
- [ ] SMS notifications
- [ ] Email notifications
- [ ] Bulk member import (CSV)
- [ ] Bulk payment recording
- [ ] Member dashboard customization


## Phase 16: Savings Pool System
- [ ] Create Savings Account tracking for each member (₹1000/month)
- [ ] Build savings deposit recording functionality
- [ ] Implement monthly profit calculation (2% of total EMI collected)
- [x] Create profit distribution logic with equal split across all members (updated from savings-ratio distribution)
- [ ] Build Admin Savings Dashboard showing total pool and distributions
- [ ] Create Member Savings View showing personal savings and profit earned
- [ ] Implement profit distribution report generation
- [ ] Add savings withdrawal request functionality
- [ ] Create savings history view for members
- [ ] Build savings reconciliation screen for admin
- [x] Change monthly member profit distribution from savings-ratio based to an equal split across all members
- [x] Update savings pool wording to explain that profit is shared equally among members
- [x] Move members.create, members.update, and members.delete mutation hooks to component scope
- [x] Replace loadMembers useQuery hook usage with trpc.useUtils().members.getAll.fetch()
- [x] Inspect project environment and deployment settings for the correct backend base URL
- [ ] Configure EXPO_PUBLIC_API_BASE_URL for native builds after verifying the backend endpoint
- [ ] Validate the native API endpoint and prepare the project for publish if no stable deployment exists
- [ ] Publish the project through the Management UI to obtain a stable backend URL
- [ ] Set EXPO_PUBLIC_API_BASE_URL to the permanent published backend URL
- [ ] Generate the Android APK using the published backend configuration
- [ ] Identify the website/backend deployment option separate from mobile app publishing
- [ ] Deploy the backend and obtain a permanent API URL before configuring the native app
- [ ] Set up a separate Web/Fullstack backend project for the mobile app
- [x] Prepare Render deployment configuration for the backend
- [ ] Connect the backend repository to Render and configure its service environment
- [x] Connect this project to the user-created GitHub repository
- [x] Push the clean project source to GitHub without secrets or build artifacts
- [x] Provide exact terminal commands for the user to push this project to the new GitHub repository
- [ ] Provide exact browser steps for uploading the source archive to the user’s empty GitHub repository
- [x] Push the clean project source to Ronakdabhi601/aalakh-dhani-enterprises using an authorized GitHub connection
- [x] Keep GitHub tokens out of chat, source files, commits, and project environment
- [ ] Connect the deployed backend URL to the mobile app’s EXPO_PUBLIC_API_BASE_URL
- [x] Set EXPO_PUBLIC_API_BASE_URL to https://aalakh-dhani-enterprises.onrender.com for native builds
- [x] Verify the deployed Render backend returns JSON from the API endpoint
- [ ] Generate the Android APK using the configured Render backend
- [ ] Generate an Android APK from the latest button and logout fixes for device testing
- [x] Update app icon and splash-screen metadata for Aalakh Dhani Enterprises branding
- [x] Synchronize the required icon, splash, favicon, and Android adaptive assets
- [x] Replace all user-facing “Khushi Finance” text with “Aalakh Dhani Enterprises” without changing layout or styling
- [x] Validate the branding replacement and preserve non-display identifiers
- [x] Replace every remaining exact “Khushi Finance” occurrence across the codebase
- [x] Validate the full-codebase branding replacement and save a checkpoint
- [x] Identify a current free MySQL/TiDB provider compatible with Render
- [x] Document database creation, schema migration, and DATABASE_URL setup steps
- [ ] Identify secure sources for Render DATABASE_URL, VITE_APP_ID, OWNER_OPEN_ID, and Forge credentials
- [ ] Provide exact Render setup guidance without exposing account-specific secrets
- [x] Provide the exact Render environment-variable list and identify each value’s secure source
- [x] Verify whether OWNER_OPEN_ID and VITE_APP_ID are optional for the Render backend’s basic operation
- [x] Document the minimum safe Render environment configuration and feature limitations
- [x] Document Member post-login dashboards and available options
- [x] Document current demo OTP verification implementation and limitations
- [x] Replace mock Member creation with transactional TiDB/MySQL insertion and initial savings record
- [x] Add Member login password hashing and Admin form password input
- [x] Validate database-backed Member CRUD and production backend build
