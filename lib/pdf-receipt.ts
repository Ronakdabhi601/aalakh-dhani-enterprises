import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  memberName: string;
  memberId: number;
  loanId: number;
  amount: number;
  paymentMethod: string;
  remainingBalance: number;
  nextDueDate: string;
  notes?: string;
}

export async function generatePDFReceipt(data: ReceiptData): Promise<string | null> {
  try {
    // Create HTML content for receipt
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
          }
          .receipt {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2d5016;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #2d5016;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0;
            color: #666;
            font-size: 12px;
          }
          .receipt-number {
            text-align: right;
            color: #2d5016;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            background-color: #f0f0f0;
            padding: 10px;
            font-weight: bold;
            color: #2d5016;
            margin-bottom: 10px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .row.total {
            background-color: #f9f9f9;
            font-weight: bold;
            font-size: 16px;
            padding: 12px 0;
            border-bottom: 2px solid #2d5016;
          }
          .label {
            color: #666;
          }
          .value {
            font-weight: bold;
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
          }
          .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="success-message">
            ✓ Payment Received Successfully
          </div>
          
          <div class="header">
            <h1>Aalakh Dhani Enterprises</h1>
            <p>Microfinance Payment Receipt</p>
            <p>Trusted Finance, Simplified</p>
          </div>

          <div class="receipt-number">
            Receipt #${data.receiptNumber}
          </div>

          <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${data.date}</span>
            </div>
            <div class="row">
              <span class="label">Payment Method:</span>
              <span class="value">${data.paymentMethod}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Member Details</div>
            <div class="row">
              <span class="label">Member Name:</span>
              <span class="value">${data.memberName}</span>
            </div>
            <div class="row">
              <span class="label">Member ID:</span>
              <span class="value">${data.memberId}</span>
            </div>
            <div class="row">
              <span class="label">Loan ID:</span>
              <span class="value">${data.loanId}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Payment Details</div>
            <div class="row">
              <span class="label">Amount Paid:</span>
              <span class="value">₹${data.amount.toFixed(2)}</span>
            </div>
            <div class="row">
              <span class="label">Remaining Balance:</span>
              <span class="value">₹${data.remainingBalance.toFixed(2)}</span>
            </div>
            <div class="row">
              <span class="label">Next Due Date:</span>
              <span class="value">${data.nextDueDate}</span>
            </div>
          </div>

          ${data.notes ? `
            <div class="section">
              <div class="section-title">Notes</div>
              <div class="row">
                <span>${data.notes}</span>
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p>This is an electronically generated receipt. No signature required.</p>
            <p>For any queries, please contact Aalakh Dhani Enterprises</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Save HTML to file
    const fileName = `receipt_${data.receiptNumber}.html`;
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, htmlContent);

    // File saved successfully
    console.log('Receipt saved to:', filePath);

    return filePath;
  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    return null;
  }
}

export function formatReceiptData(
  receiptNumber: string,
  memberName: string,
  memberId: number,
  loanId: number,
  amount: number,
  paymentMethod: string,
  remainingBalance: number,
  notes?: string
): ReceiptData {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() + 1);

  return {
    receiptNumber,
    date: today.toLocaleDateString('en-IN'),
    memberName,
    memberId,
    loanId,
    amount,
    paymentMethod,
    remainingBalance,
    nextDueDate: nextMonth.toLocaleDateString('en-IN'),
    notes,
  };
}
