import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'hi' | 'gu';

interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    common: {
      appName: 'Aalakh Dhani Enterprises',
      login: 'Login',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      download: 'Download',
      share: 'Share',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      noData: 'No data available',
      settings: 'Settings',
      language: 'Language',
      darkMode: 'Dark Mode',
      version: 'Version',
    },
    // Authentication
    auth: {
      selectRole: 'Select Your Role',
      admin: 'Admin',
      member: 'Member',
      adminLogin: 'Admin Login',
      memberLogin: 'Member Login',
      email: 'Email',
      password: 'Password',
      mobileNumber: 'Mobile Number',
      otp: 'OTP',
      enterOTP: 'Enter OTP',
      sendOTP: 'Send OTP',
      verifyOTP: 'Verify OTP',
      resendOTP: 'Resend OTP',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      logoutSuccess: 'Logged out successfully',
      invalidCredentials: 'Invalid credentials',
      otpExpired: 'OTP expired',
      otpVerified: 'OTP verified successfully',
    },
    // Admin Dashboard
    admin: {
      dashboard: 'Dashboard',
      totalMembers: 'Total Members',
      activeLoans: 'Active Loans',
      todaysCollection: "Today's Collection",
      monthlyCollection: 'Monthly Collection',
      pendingInstallments: 'Pending Installments',
      totalOutstanding: 'Total Outstanding',
      members: 'Members',
      loans: 'Loans',
      reports: 'Reports',
      addMember: 'Add Member',
      editMember: 'Edit Member',
      deleteMember: 'Delete Member',
      memberDetails: 'Member Details',
      memberList: 'Members List',
      recordPayment: 'Record Payment',
      viewReports: 'View Reports',
      approveLoans: 'Approve Loans',
      rejectLoan: 'Reject Loan',
      approveLoan: 'Approve Loan',
      loanApproved: 'Loan approved successfully',
      loanRejected: 'Loan rejected',
      memberAdded: 'Member added successfully',
      memberUpdated: 'Member updated successfully',
      memberDeleted: 'Member deleted successfully',
      paymentRecorded: 'Payment recorded successfully',
      confirmDelete: 'Are you sure you want to delete this member?',
    },
    // Member Dashboard
    member: {
      dashboard: 'Dashboard',
      myLoan: 'My Loan',
      loanAmount: 'Loan Amount',
      remainingBalance: 'Remaining Balance',
      nextPaymentDue: 'Next Payment Due',
      daysUntilDue: 'Days Until Due',
      totalPaid: 'Total Paid',
      totalRemaining: 'Total Remaining',
      paymentHistory: 'Payment History',
      loanStatement: 'Loan Statement',
      downloadStatement: 'Download Statement',
      viewDetails: 'View Details',
      myProfile: 'My Profile',
      loanDetails: 'Loan Details',
      loanDuration: 'Loan Duration',
      monthlyEMI: 'Monthly EMI',
      interestRate: 'Interest Rate',
      totalPayable: 'Total Payable',
      paymentSchedule: 'Payment Schedule',
      overdueAmount: 'Overdue Amount',
      noOverdue: 'No overdue payments',
    },
    // Loan Details
    loan: {
      loanId: 'Loan ID',
      memberId: 'Member ID',
      memberName: 'Member Name',
      loanAmount: 'Loan Amount',
      loanDuration: 'Loan Duration',
      interestRate: 'Interest Rate',
      monthlyEMI: 'Monthly EMI',
      totalPayable: 'Total Payable',
      remainingBalance: 'Remaining Balance',
      paidAmount: 'Paid Amount',
      status: 'Status',
      active: 'Active',
      completed: 'Completed',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      startDate: 'Start Date',
      endDate: 'End Date',
      nextPaymentDate: 'Next Payment Date',
      overdueAmount: 'Overdue Amount',
      months: 'Months',
    },
    // Payment
    payment: {
      recordPayment: 'Record Payment',
      paymentDate: 'Payment Date',
      paymentAmount: 'Payment Amount',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      check: 'Check',
      bankTransfer: 'Bank Transfer',
      notes: 'Notes',
      receipt: 'Receipt',
      downloadReceipt: 'Download Receipt',
      generateReceipt: 'Generate Receipt',
      paymentHistory: 'Payment History',
      noPayments: 'No payments recorded',
      paymentDetails: 'Payment Details',
      confirmPayment: 'Confirm Payment',
    },
    // Reports
    report: {
      reports: 'Reports',
      dailyReport: 'Daily Report',
      monthlyReport: 'Monthly Report',
      dateRange: 'Date Range',
      fromDate: 'From Date',
      toDate: 'To Date',
      totalCollections: 'Total Collections',
      numberOfPayments: 'Number of Payments',
      outstandingAmount: 'Outstanding Amount',
      generateReport: 'Generate Report',
      exportPDF: 'Export as PDF',
      exportExcel: 'Export as Excel',
      reportDetails: 'Report Details',
      noReports: 'No reports available',
    },
    // Validation
    validation: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidMobileNumber: 'Invalid mobile number',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      invalidAmount: 'Invalid amount',
      invalidDate: 'Invalid date',
      futureDate: 'Date cannot be in the future',
      pastDate: 'Date cannot be in the past',
    },
  },
  hi: {
    // Common
    common: {
      appName: 'Aalakh Dhani Enterprises',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      add: 'जोड़ें',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      export: 'निर्यात करें',
      download: 'डाउनलोड करें',
      share: 'साझा करें',
      close: 'बंद करें',
      confirm: 'पुष्टि करें',
      back: 'वापस',
      next: 'अगला',
      previous: 'पिछला',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफल',
      warning: 'चेतावनी',
      info: 'जानकारी',
      noData: 'कोई डेटा उपलब्ध नहीं',
      settings: 'सेटिंग्स',
      language: 'भाषा',
      darkMode: 'डार्क मोड',
      version: 'संस्करण',
    },
    // Authentication
    auth: {
      selectRole: 'अपनी भूमिका चुनें',
      admin: 'प्रशासक',
      member: 'सदस्य',
      adminLogin: 'प्रशासक लॉगिन',
      memberLogin: 'सदस्य लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      mobileNumber: 'मोबाइल नंबर',
      otp: 'ओटीपी',
      enterOTP: 'ओटीपी दर्ज करें',
      sendOTP: 'ओटीपी भेजें',
      verifyOTP: 'ओटीपी सत्यापित करें',
      resendOTP: 'ओटीपी फिर से भेजें',
      loginSuccess: 'लॉगिन सफल',
      loginFailed: 'लॉगिन विफल',
      logoutSuccess: 'सफलतापूर्वक लॉगआउट',
      invalidCredentials: 'अमान्य क्रेडेंशियल',
      otpExpired: 'ओटीपी समाप्त',
      otpVerified: 'ओटीपी सफलतापूर्वक सत्यापित',
    },
    // Admin Dashboard
    admin: {
      dashboard: 'डैशबोर्ड',
      totalMembers: 'कुल सदस्य',
      activeLoans: 'सक्रिय ऋण',
      todaysCollection: 'आज का संग्रह',
      monthlyCollection: 'मासिक संग्रह',
      pendingInstallments: 'लंबित किश्तें',
      totalOutstanding: 'कुल बकाया',
      members: 'सदस्य',
      loans: 'ऋण',
      reports: 'रिपोर्ट',
      addMember: 'सदस्य जोड़ें',
      editMember: 'सदस्य संपादित करें',
      deleteMember: 'सदस्य हटाएं',
      memberDetails: 'सदस्य विवरण',
      memberList: 'सदस्य सूची',
      recordPayment: 'भुगतान रिकॉर्ड करें',
      viewReports: 'रिपोर्ट देखें',
      approveLoans: 'ऋण मंजूर करें',
      rejectLoan: 'ऋण अस्वीकार करें',
      approveLoan: 'ऋण मंजूर करें',
      loanApproved: 'ऋण सफलतापूर्वक मंजूर',
      loanRejected: 'ऋण अस्वीकार',
      memberAdded: 'सदस्य सफलतापूर्वक जोड़ा गया',
      memberUpdated: 'सदस्य सफलतापूर्वक अपडेट',
      memberDeleted: 'सदस्य सफलतापूर्वक हटाया गया',
      paymentRecorded: 'भुगतान सफलतापूर्वक रिकॉर्ड',
      confirmDelete: 'क्या आप इस सदस्य को हटाना चाहते हैं?',
    },
    // Member Dashboard
    member: {
      dashboard: 'डैशबोर्ड',
      myLoan: 'मेरा ऋण',
      loanAmount: 'ऋण राशि',
      remainingBalance: 'शेष राशि',
      nextPaymentDue: 'अगला भुगतान देय',
      daysUntilDue: 'देय होने तक दिन',
      totalPaid: 'कुल भुगतान',
      totalRemaining: 'कुल शेष',
      paymentHistory: 'भुगतान इतिहास',
      loanStatement: 'ऋण विवरण',
      downloadStatement: 'विवरण डाउनलोड करें',
      viewDetails: 'विवरण देखें',
      myProfile: 'मेरी प्रोफ़ाइल',
      loanDetails: 'ऋण विवरण',
      loanDuration: 'ऋण अवधि',
      monthlyEMI: 'मासिक ईएमआई',
      interestRate: 'ब्याज दर',
      totalPayable: 'कुल देय',
      paymentSchedule: 'भुगतान अनुसूची',
      overdueAmount: 'बकाया राशि',
      noOverdue: 'कोई बकाया भुगतान नहीं',
    },
    // Loan Details
    loan: {
      loanId: 'ऋण आईडी',
      memberId: 'सदस्य आईडी',
      memberName: 'सदस्य का नाम',
      loanAmount: 'ऋण राशि',
      loanDuration: 'ऋण अवधि',
      interestRate: 'ब्याज दर',
      monthlyEMI: 'मासिक ईएमआई',
      totalPayable: 'कुल देय',
      remainingBalance: 'शेष राशि',
      paidAmount: 'भुगतान की गई राशि',
      status: 'स्थिति',
      active: 'सक्रिय',
      completed: 'पूर्ण',
      pending: 'लंबित',
      approved: 'मंजूर',
      rejected: 'अस्वीकार',
      startDate: 'शुरुआत की तारीख',
      endDate: 'समाप्ति तारीख',
      nextPaymentDate: 'अगली भुगतान तारीख',
      overdueAmount: 'बकाया राशि',
      months: 'महीने',
    },
    // Payment
    payment: {
      recordPayment: 'भुगतान रिकॉर्ड करें',
      paymentDate: 'भुगतान की तारीख',
      paymentAmount: 'भुगतान राशि',
      paymentMethod: 'भुगतान विधि',
      cash: 'नकद',
      check: 'चेक',
      bankTransfer: 'बैंक हस्तांतरण',
      notes: 'नोट्स',
      receipt: 'रसीद',
      downloadReceipt: 'रसीद डाउनलोड करें',
      generateReceipt: 'रसीद जेनरेट करें',
      paymentHistory: 'भुगतान इतिहास',
      noPayments: 'कोई भुगतान रिकॉर्ड नहीं',
      paymentDetails: 'भुगतान विवरण',
      confirmPayment: 'भुगतान की पुष्टि करें',
    },
    // Reports
    report: {
      reports: 'रिपोर्ट',
      dailyReport: 'दैनिक रिपोर्ट',
      monthlyReport: 'मासिक रिपोर्ट',
      dateRange: 'तारीख की रेंज',
      fromDate: 'शुरुआत की तारीख',
      toDate: 'समाप्ति तारीख',
      totalCollections: 'कुल संग्रह',
      numberOfPayments: 'भुगतान की संख्या',
      outstandingAmount: 'बकाया राशि',
      generateReport: 'रिपोर्ट जेनरेट करें',
      exportPDF: 'पीडीएफ के रूप में निर्यात करें',
      exportExcel: 'एक्सेल के रूप में निर्यात करें',
      reportDetails: 'रिपोर्ट विवरण',
      noReports: 'कोई रिपोर्ट उपलब्ध नहीं',
    },
    // Validation
    validation: {
      required: 'यह क्षेत्र आवश्यक है',
      invalidEmail: 'अमान्य ईमेल पता',
      invalidMobileNumber: 'अमान्य मोबाइल नंबर',
      passwordTooShort: 'पासवर्ड कम से कम 6 वर्ण का होना चाहिए',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      invalidAmount: 'अमान्य राशि',
      invalidDate: 'अमान्य तारीख',
      futureDate: 'तारीख भविष्य में नहीं हो सकती',
      pastDate: 'तारीख अतीत में नहीं हो सकती',
    },
  },
  gu: {
    // Common
    common: {
      appName: 'Aalakh Dhani Enterprises',
      login: 'લૉગિન',
      logout: 'લૉગઆઉટ',
      save: 'સાચવો',
      cancel: 'રદ્દ કરો',
      delete: 'કાઢી નાખો',
      edit: 'સંપાદિત કરો',
      add: 'ઉમેરો',
      search: 'શોધો',
      filter: 'ફિલ્ટર',
      export: 'નિકાસ કરો',
      download: 'ડાઉનલોડ કરો',
      share: 'શેર કરો',
      close: 'બંધ કરો',
      confirm: 'પુષ્ટિ કરો',
      back: 'પાછળ',
      next: 'આગલું',
      previous: 'પાછલું',
      loading: 'લોડ થઇ રહ્યું છે...',
      error: 'ભૂલ',
      success: 'સફલ',
      warning: 'ચેતવણી',
      info: 'માહિતી',
      noData: 'કોઈ ડેટા ઉપલબ્ધ નથી',
      settings: 'સેટિંગ્સ',
      language: 'ભાષા',
      darkMode: 'ડાર્ક મોડ',
      version: 'આવૃત્તિ',
    },
    // Authentication
    auth: {
      selectRole: 'તમારી ભૂમિકા પસંદ કરો',
      admin: 'વ્યવસ્થાપક',
      member: 'સભ્ય',
      adminLogin: 'વ્યવસ્થાપક લૉગિન',
      memberLogin: 'સભ્ય લૉગિન',
      email: 'ઈમેલ',
      password: 'પાસવર્ડ',
      mobileNumber: 'મોબાઇલ નંબર',
      otp: 'OTP',
      enterOTP: 'OTP દાખલ કરો',
      sendOTP: 'OTP મોકલો',
      verifyOTP: 'OTP ચકાસો',
      resendOTP: 'OTP ફરીથી મોકલો',
      loginSuccess: 'લૉગિન સફળ',
      loginFailed: 'લૉગિન નિષ્ફળ',
      logoutSuccess: 'સફળતાપૂર્વક લૉગઆઉટ',
      invalidCredentials: 'અમાન્ય ક્રેડેન્શિયલ્સ',
      otpExpired: 'OTP સમાપ્ત',
      otpVerified: 'OTP સફળતાપૂર્વક ચકાસાયું',
    },
    // Admin Dashboard
    admin: {
      dashboard: 'ડેશબોર્ડ',
      totalMembers: 'કુલ સભ્યો',
      activeLoans: 'સક્રિય ऋણ',
      todaysCollection: 'આજનો સંગ્રહ',
      monthlyCollection: 'માસિક સંગ્રહ',
      pendingInstallments: 'બાકી હપ્તાઓ',
      totalOutstanding: 'કુલ બાકી',
      members: 'સભ્યો',
      loans: 'ऋણ',
      reports: 'અહેવાલો',
      addMember: 'સભ્ય ઉમેરો',
      editMember: 'સભ્ય સંપાદિત કરો',
      deleteMember: 'સભ્ય કાઢી નાખો',
      memberDetails: 'સભ્યની વિગતો',
      memberList: 'સભ્યોની સૂચી',
      recordPayment: 'ચુકવણી રેકોર્ડ કરો',
      viewReports: 'અહેવાલો જુઓ',
      approveLoans: 'ऋણ મંજૂર કરો',
      rejectLoan: 'ऋણ નકારો',
      approveLoan: 'ऋણ મંજૂર કરો',
      loanApproved: 'ऋણ સફળતાપૂર્વક મંજૂર',
      loanRejected: 'ऋણ નકારાયું',
      memberAdded: 'સભ્ય સફળતાપૂર્વક ઉમેરાયો',
      memberUpdated: 'સભ્ય સફળતાપૂર્વક અપડેટ',
      memberDeleted: 'સભ્ય સફળતાપૂર્વક કાઢી નાખાયો',
      paymentRecorded: 'ચુકવણી સફળતાપૂર્વક રેકોર્ડ',
      confirmDelete: 'શું તમે આ સભ્યને કાઢી નાખવા માંગો છો?',
    },
    // Member Dashboard
    member: {
      dashboard: 'ડેશબોર્ડ',
      myLoan: 'મારું ऋણ',
      loanAmount: 'ऋણ રકમ',
      remainingBalance: 'બાકી બેલેન્સ',
      nextPaymentDue: 'આગલી ચુકવણી બાકી',
      daysUntilDue: 'બાકી દિવસો',
      totalPaid: 'કુલ ચુકવણી',
      totalRemaining: 'કુલ બાકી',
      paymentHistory: 'ચુકવણીનો ઇતિહાસ',
      loanStatement: 'ऋણ વિગતો',
      downloadStatement: 'વિગતો ડાઉનલોડ કરો',
      viewDetails: 'વિગતો જુઓ',
      myProfile: 'મારી પ્રોફાઇલ',
      loanDetails: 'ऋણ વિગતો',
      loanDuration: 'ऋણ અવધિ',
      monthlyEMI: 'માસિક EMI',
      interestRate: 'વ્યાજ દર',
      totalPayable: 'કુલ ચુકવણી',
      paymentSchedule: 'ચુકવણી શેડ્યુલ',
      overdueAmount: 'બાકી રકમ',
      noOverdue: 'કોઈ બાકી ચુકવણી નથી',
    },
    // Loan Details
    loan: {
      loanId: 'ऋણ ID',
      memberId: 'સભ્ય ID',
      memberName: 'સભ્યનું નામ',
      loanAmount: 'ऋણ રકમ',
      loanDuration: 'ऋણ અવધિ',
      interestRate: 'વ્યાજ દર',
      monthlyEMI: 'માસિક EMI',
      totalPayable: 'કુલ ચુકવણી',
      remainingBalance: 'બાકી બેલેન્સ',
      paidAmount: 'ચુકવણી કરેલ રકમ',
      status: 'સ્થિતિ',
      active: 'સક્રિય',
      completed: 'પૂર્ણ',
      pending: 'બાકી',
      approved: 'મંજૂર',
      rejected: 'નકારાયું',
      startDate: 'શરૂઆતની તારીખ',
      endDate: 'સમાપ્તિની તારીખ',
      nextPaymentDate: 'આગલી ચુકવણીની તારીખ',
      overdueAmount: 'બાકી રકમ',
      months: 'મહિનાઓ',
    },
    // Payment
    payment: {
      recordPayment: 'ચુકવણી રેકોર્ડ કરો',
      paymentDate: 'ચુકવણીની તારીખ',
      paymentAmount: 'ચુકવણીની રકમ',
      paymentMethod: 'ચુકવણીની રીત',
      cash: 'રોકડ',
      check: 'ચેક',
      bankTransfer: 'બેંક ટ્રાન્સફર',
      notes: 'નોટ્સ',
      receipt: 'રસીદ',
      downloadReceipt: 'રસીદ ડાઉનલોડ કરો',
      generateReceipt: 'રસીદ જનરેટ કરો',
      paymentHistory: 'ચુકવણીનો ઇતિહાસ',
      noPayments: 'કોઈ ચુકવણી રેકોર્ડ નથી',
      paymentDetails: 'ચુકવણીની વિગતો',
      confirmPayment: 'ચુકવણીની પુષ્ટિ કરો',
    },
    // Reports
    report: {
      reports: 'અહેવાલો',
      dailyReport: 'દૈનિક અહેવાલ',
      monthlyReport: 'માસિક અહેવાલ',
      dateRange: 'તારીખની શ્રેણી',
      fromDate: 'શરૂઆતની તારીખ',
      toDate: 'સમાપ્તિની તારીખ',
      totalCollections: 'કુલ સંગ્રહ',
      numberOfPayments: 'ચુકવણીની સંખ્યા',
      outstandingAmount: 'બાકી રકમ',
      generateReport: 'અહેવાલ જનરેટ કરો',
      exportPDF: 'PDF તરીકે નિકાસ કરો',
      exportExcel: 'Excel તરીકે નિકાસ કરો',
      reportDetails: 'અહેવાલની વિગતો',
      noReports: 'કોઈ અહેવાલ ઉપલબ્ધ નથી',
    },
    // Validation
    validation: {
      required: 'આ ક્ષેત્ર આવશ્યક છે',
      invalidEmail: 'અમાન્ય ઈમેલ સરનામું',
      invalidMobileNumber: 'અમાન્ય મોબાઇલ નંબર',
      passwordTooShort: 'પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ',
      passwordMismatch: 'પાસવર્ડ મેળ ખાતા નથી',
      invalidAmount: 'અમાન્ય રકમ',
      invalidDate: 'અમાન્ય તારીખ',
      futureDate: 'તારીખ ભવિષ્યમાં હોઈ શકતી નથી',
      pastDate: 'તારીખ ભૂતકાળમાં હોઈ શકતી નથી',
    },
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && ['en', 'hi', 'gu'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return path; // Return path if translation not found
      }
    }

    return typeof value === 'string' ? value : path;
  };

  if (isLoading) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
