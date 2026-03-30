// utils/emailService.js (add this function)
import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });
};

// Helper: Format time to 12-hour
const formatTime = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

// Helper: Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


export const sendBookingConfirmationEmail = async (email, bookingDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  const {
    userName,
    therapyType,
    sessionType,
    date,
    timeSlot,
    isPaidViaWallet,
    sessionPrice,
    bookingId,
  } = bookingDetails;

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time to 12-hour
  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const formattedTime = formatTime(timeSlot);
  const isOnline = sessionType === "online";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3F2965 0%, #DD1764 100%); border-radius: 20px 20px 0 0; padding: 40px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Your therapy session has been scheduled</p>
        </div>
        
        <!-- Body -->
        <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Great news! Your therapy session has been successfully booked. Here are your booking details:
          </p>
          
          <!-- Booking Details Card -->
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px;">
            
            <!-- Booking ID -->
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ccc;">
              <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Booking ID</p>
              <p style="color: #3F2965; font-size: 14px; font-weight: bold; margin: 5px 0 0 0; font-family: 'Courier New', monospace;">${bookingId}</p>
            </div>
            
            <!-- Details Grid -->
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📋 Therapy Type</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <span style="color: #3F2965; font-size: 14px; font-weight: 600;">${therapyType}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">${isOnline ? "💻" : "🏥"} Session Type</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <span style="color: #3F2965; font-size: 14px; font-weight: 600;">${isOnline ? "Online Session" : "In-Person Visit"}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📅 Date</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <span style="color: #3F2965; font-size: 14px; font-weight: 600;">${formattedDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">⏰ Time</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <span style="color: #3F2965; font-size: 14px; font-weight: 600;">${formattedTime}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">⏱️ Duration</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">
                  <span style="color: #3F2965; font-size: 14px; font-weight: 600;">60 Minutes</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">💰 Payment</span>
                </td>
                <td style="padding: 12px 0; text-align: right;">
                  <span style="color: ${isPaidViaWallet ? "#10b981" : "#f59e0b"}; font-size: 14px; font-weight: 600;">
                    ${isPaidViaWallet ? `₹${sessionPrice} (Paid via Wallet)` : `₹${sessionPrice} (Pay at Clinic)`}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          ${!isPaidViaWallet ? `
          <!-- Cash Payment Notice -->
          <div style="background: linear-gradient(135deg, #fef3cd 0%, #ffeeba 100%); border: 1px solid #ffc107; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;">
            <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
              💵 <strong>Payment Reminder:</strong> Please pay ₹${sessionPrice} in cash at the clinic before your session.
            </p>
          </div>
          ` : ""}
          
          ${isOnline ? `
          <!-- Online Session Info -->
          <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border: 1px solid #0ea5e9; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;">
            <p style="color: #0369a1; font-size: 14px; margin: 0;">
              💻 <strong>Online Session:</strong> You will receive a video call link 30 minutes before your session.
            </p>
          </div>
          ` : `
          <!-- In-Person Visit Info -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #22c55e; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;">
            <p style="color: #166534; font-size: 14px; margin: 0 0 10px 0;">
              🏥 <strong>Clinic Address:</strong>
            </p>
            <p style="color: #166534; font-size: 14px; margin: 0;">
              MindSettler Wellness Center<br>
              123 Healing Street, Wellness District<br>
              City - 123456
            </p>
          </div>
          `}
          
          <!-- What to Expect -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #3F2965; font-size: 16px; margin: 0 0 15px 0;">📝 What to Expect:</h3>
            <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li>Please be ready 5 minutes before your scheduled time</li>
              <li>Find a quiet, private space for your session</li>
              <li>Keep a notebook handy if you'd like to take notes</li>
              <li>Feel free to prepare any topics you'd like to discuss</li>
            </ul>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/profile#My%20Bookings" 
               style="display: inline-block; background: linear-gradient(135deg, #3F2965 0%, #DD1764 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(63, 41, 101, 0.3);">
              View My Bookings
            </a>
          </div>
          
          <!-- Cancellation Policy -->
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
              <strong>Cancellation Policy:</strong> You can reschedule or cancel your appointment up to 24 hours before the scheduled time. 
              For any assistance, please contact us at support@mindsettler.com
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
            Need help? Contact us at <a href="mailto:support@mindsettler.com" style="color: #DD1764;">support@mindsettler.com</a>
          </p>
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} MindSettler. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Booking Confirmed!
    
    Hi ${userName},
    
    Your therapy session has been successfully booked.
    
    Booking Details:
    - Booking ID: ${bookingId}
    - Therapy Type: ${therapyType}
    - Session Type: ${isOnline ? "Online Session" : "In-Person Visit"}
    - Date: ${formattedDate}
    - Time: ${formattedTime}
    - Duration: 60 Minutes
    - Payment: ${isPaidViaWallet ? `₹${sessionPrice} (Paid via Wallet)` : `₹${sessionPrice} (Pay at Clinic)`}
    
    ${!isPaidViaWallet ? `Payment Reminder: Please pay ₹${sessionPrice} in cash at the clinic before your session.` : ""}
    
    ${isOnline ? "You will receive a video call link 30 minutes before your session." : "Clinic Address: MindSettler Wellness Center, 123 Healing Street, Wellness District, City - 123456"}
    
    For any assistance, contact us at support@mindsettler.com
    
    © ${new Date().getFullYear()} MindSettler
  `;

  await transporter.sendMail({
    from: `"MindSettler" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: `🎉 Booking Confirmed - ${formattedDate} at ${formattedTime}`,
    html: htmlContent,
    text: textContent,
  });
};


export const sendSessionRejectedEmail = async (email, bookingDetails) => {
  const transporter = createTransporter();

  const {
    userName,
    therapyType,
    sessionType,
    date,
    timeSlot,
    bookingId,
    isPaid,
    refundAmount,
    rejectionReason,
  } = bookingDetails;

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(timeSlot);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Cancelled</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 20px 20px 0 0; padding: 40px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">😔</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">Session Cancelled</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">We're sorry for the inconvenience</p>
        </div>
        
        <!-- Body -->
        <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            We regret to inform you that your scheduled therapy session has been cancelled. We sincerely apologize for any inconvenience this may cause.
          </p>
          
          <!-- Cancelled Booking Details -->
          <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px solid #fecaca; border-radius: 16px; padding: 25px; margin-bottom: 25px;">
            
            <!-- Booking ID -->
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #fca5a5;">
              <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Cancelled Booking</p>
              <p style="color: #dc2626; font-size: 14px; font-weight: bold; margin: 5px 0 0 0; font-family: 'Courier New', monospace;">${bookingId}</p>
            </div>
            
            <!-- Details -->
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📋 Therapy</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca; text-align: right;">
                  <span style="color: #7f1d1d; font-size: 14px; font-weight: 600;">${therapyType}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">${sessionType === "online" ? "💻" : "🏥"} Type</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca; text-align: right;">
                  <span style="color: #7f1d1d; font-size: 14px; font-weight: 600;">${sessionType === "online" ? "Online Session" : "In-Person Visit"}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📅 Date</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca; text-align: right;">
                  <span style="color: #7f1d1d; font-size: 14px; font-weight: 600; text-decoration: line-through;">${formattedDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">⏰ Time</span>
                </td>
                <td style="padding: 10px 0; text-align: right;">
                  <span style="color: #7f1d1d; font-size: 14px; font-weight: 600; text-decoration: line-through;">${formattedTime}</span>
                </td>
              </tr>
            </table>
          </div>
          
          ${rejectionReason ? `
          <!-- Rejection Reason -->
          <div style="background: #f8f9fa; border-left: 4px solid #ef4444; padding: 15px 20px; border-radius: 0 12px 12px 0; margin-bottom: 25px;">
            <p style="color: #666; font-size: 13px; margin: 0 0 5px 0; font-weight: bold;">Reason for Cancellation:</p>
            <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">${rejectionReason}</p>
          </div>
          ` : ""}
          
          ${isPaid ? `
          <!-- Refund Notice -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #86efac; border-radius: 16px; padding: 25px; margin-bottom: 25px; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 10px;">💰</div>
            <h3 style="color: #166534; font-size: 18px; margin: 0 0 10px 0;">Refund Processed!</h3>
            <p style="color: #166534; font-size: 14px; margin: 0 0 15px 0;">
              Your payment has been refunded to your wallet.
            </p>
            <div style="background: white; border-radius: 12px; padding: 15px; display: inline-block;">
              <p style="color: #999; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase;">Refund Amount</p>
              <p style="color: #166534; font-size: 28px; font-weight: bold; margin: 0;">₹${refundAmount}</p>
            </div>
            <p style="color: #166534; font-size: 12px; margin: 15px 0 0 0;">
              ✅ Amount credited to your MindSettler Wallet
            </p>
          </div>
          ` : `
          <!-- No Payment Notice -->
          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 25px; text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              💡 Since you had selected <strong>Cash Payment at Clinic</strong>, no refund is required.
            </p>
          </div>
          `}
          
          <!-- Apology Message -->
          <div style="background: linear-gradient(135deg, #fef3cd 0%, #ffeeba 100%); border: 1px solid #ffc107; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
              🙏 <strong>We apologize</strong> for any inconvenience caused. Our therapist may have had an unavoidable conflict. 
              We encourage you to book another session at your earliest convenience.
            </p>
          </div>
          
          <!-- CTA Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/book-session" 
               style="display: inline-block; background: linear-gradient(135deg, #3F2965 0%, #DD1764 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(63, 41, 101, 0.3); margin: 5px;">
              Book Another Session
            </a>
          </div>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${process.env.FRONTEND_URL}/profile#My%20Bookings" 
               style="color: #3F2965; font-size: 14px; font-weight: 600; text-decoration: none;">
              View My Bookings →
            </a>
          </div>
          
          <!-- Support Info -->
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 13px; line-height: 1.6; margin: 0;">
              <strong>Need assistance?</strong> If you have any questions or concerns about this cancellation, 
              please don't hesitate to reach out to our support team at 
              <a href="mailto:support@mindsettler.com" style="color: #DD1764;">support@mindsettler.com</a>
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
            We value your mental wellness journey with us 💜
          </p>
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} MindSettler. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Session Cancelled
    
    Hi ${userName},
    
    We regret to inform you that your scheduled therapy session has been cancelled.
    
    Cancelled Booking Details:
    - Booking ID: ${bookingId}
    - Therapy: ${therapyType}
    - Type: ${sessionType === "online" ? "Online Session" : "In-Person Visit"}
    - Date: ${formattedDate}
    - Time: ${formattedTime}
    
    ${rejectionReason ? `Reason: ${rejectionReason}` : ""}
    
    ${isPaid ? `
    REFUND PROCESSED:
    ₹${refundAmount} has been credited to your MindSettler Wallet.
    ` : "Since you selected Cash Payment at Clinic, no refund is required."}
    
    We apologize for any inconvenience caused. Please book another session at your convenience.
    
    Book Another Session: ${process.env.FRONTEND_URL}/book-session
    
    Need help? Contact us at support@mindsettler.com
    
    © ${new Date().getFullYear()} MindSettler
  `;

  await transporter.sendMail({
    from: `"MindSettler" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: `❌ Session Cancelled - ${formattedDate} | ${isPaid ? "Refund Processed" : "No Action Required"}`,
    html: htmlContent,
    text: textContent,
  });
};

/**
 * Email sent when user submits a session payment via UTR
 */
export const sendSessionPaymentConfirmationEmail = async (email, paymentDetails) => {
  const transporter = createTransporter();

  const {
    userName,
    appointmentId,
    sessionPrice,
    utrNumber,
    date,
    timeSlot,
  } = paymentDetails;

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(timeSlot);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Submitted</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 20px 20px 0 0; padding: 40px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">⏳</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">Payment Submitted</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Pending admin verification</p>
        </div>
        
        <!-- Body -->
        <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Thank you for submitting your payment via UTR. We have received your payment details and it is currently pending verification by our admin team.
          </p>
          
          <!-- Payment Details Card -->
          <div style="background: linear-gradient(135deg, #fef3cd 0%, #ffeeba 100%); border: 1px solid #ffc107; border-radius: 16px; padding: 25px; margin-bottom: 25px;">
            
            <!-- Amount -->
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ffc107;">
              <p style="color: #856404; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Payment Amount</p>
              <p style="color: #856404; font-size: 32px; font-weight: bold; margin: 10px 0 0 0;">₹${sessionPrice}</p>
            </div>
            
            <!-- Details -->
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ffc107;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📍 UTR Number</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ffc107; text-align: right;">
                  <span style="color: #856404; font-size: 14px; font-weight: 600; font-family: 'Courier New', monospace;">${utrNumber}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ffc107;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📅 Session Date</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ffc107; text-align: right;">
                  <span style="color: #856404; font-size: 14px; font-weight: 600;">${formattedDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">⏰ Session Time</span>
                </td>
                <td style="padding: 10px 0; text-align: right;">
                  <span style="color: #856404; font-size: 14px; font-weight: 600;">${formattedTime}</span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Status Info -->
          <div style="background: #f8f9fa; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 25px;">
            <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
              <strong>✓ Status:</strong> Pending Verification
            </p>
            <p style="color: #666; font-size: 14px; margin: 0;">
              You will receive a confirmation email once our admin team verifies your payment. This typically takes 24-48 hours.
            </p>
          </div>
          
          <!-- What Happens Next -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #3F2965; font-size: 16px; margin: 0 0 15px 0;">📋 What Happens Next:</h3>
            <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li><strong>Within 24-48 hours:</strong> Admin will verify your UTR number</li>
              <li><strong>Once approved:</strong> You'll receive a confirmation email</li>
              <li><strong>Before session:</strong> You'll receive session details and meeting link (if online)</li>
              <li><strong>Important:</strong> Your session is only confirmed after payment approval</li>
            </ul>
          </div>
          
          <!-- Important Notice -->
          <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 1px solid #f87171; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <p style="color: #991b1b; font-size: 13px; margin: 0;">
              <strong>⚠️ Important:</strong> Please ensure the UTR number you provided is correct. You can contact our support team if you need to make any corrections.
            </p>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/profile#My%20Bookings" 
               style="display: inline-block; background: linear-gradient(135deg, #3F2965 0%, #DD1764 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(63, 41, 101, 0.3);">
              View My Bookings
            </a>
          </div>
          
          <!-- Contact Info -->
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
              <strong>Questions?</strong> If you have any concerns about your payment, please contact our support team at 
              <a href="mailto:support@mindsettler.com" style="color: #DD1764;">support@mindsettler.com</a>
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
            Thank you for choosing MindSettler 💜
          </p>
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} MindSettler. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Payment Submitted for Verification
    
    Hi ${userName},
    
    Thank you for submitting your session payment via UTR. We have received your payment details.
    
    Payment Details:
    - Amount: ₹${sessionPrice}
    - UTR Number: ${utrNumber}
    - Session Date: ${formattedDate}
    - Session Time: ${formattedTime}
    
    Status: Pending Verification
    
    Our admin team will verify your UTR number within 24-48 hours. You will receive a confirmation email once your payment is approved.
    
    Important: Your session is only confirmed after payment approval.
    
    View My Bookings: ${process.env.FRONTEND_URL}/profile#My%20Bookings
    
    If you have any questions, please contact us at support@mindsettler.com
    
    © ${new Date().getFullYear()} MindSettler
  `;

  await transporter.sendMail({
    from: `"MindSettler" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: `💰 Payment Submitted - ₹${sessionPrice} via UTR (Pending Verification)`,
    html: htmlContent,
    text: textContent,
  });
};

/**
 * Email sent when admin approves the session payment
 */
export const sendSessionPaymentApprovedEmail = async (email, paymentDetails) => {
  const transporter = createTransporter();

  const {
    userName,
    appointmentId,
    sessionPrice,
    date,
    timeSlot,
  } = paymentDetails;

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(timeSlot);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Approved</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px 20px 0 0; padding: 40px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">Payment Approved!</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Your session is now confirmed</p>
        </div>
        
        <!-- Body -->
        <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Great news! Your payment has been verified and approved by our admin team. Your therapy session is now officially confirmed!
          </p>
          
          <!-- Confirmation Details Card -->
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border: 1px solid #86efac; border-radius: 16px; padding: 25px; margin-bottom: 25px;">
            
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #86efac;">
              <p style="color: #059669; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">✓ Payment Confirmed</p>
              <p style="color: #059669; font-size: 28px; font-weight: bold; margin: 10px 0 0 0;">₹${sessionPrice}</p>
            </div>
            
            <!-- Session Details -->
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #86efac;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📅 Session Date</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #86efac; text-align: right;">
                  <span style="color: #059669; font-size: 14px; font-weight: 600;">${formattedDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">⏰ Session Time</span>
                </td>
                <td style="padding: 10px 0; text-align: right;">
                  <span style="color: #059669; font-size: 14px; font-weight: 600;">${formattedTime}</span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Next Steps -->
          <div style="background: #f8f9fa; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 25px;">
            <p style="color: #333; font-size: 14px; margin: 0 0 10px 0;">
              <strong>📝 Next Steps:</strong>
            </p>
            <p style="color: #666; font-size: 13px; margin: 0; line-height: 1.6;">
              You will receive additional session details 24 hours before your appointment. 
              For online sessions, a video call link will be shared. For in-person sessions, please visit our clinic.
            </p>
          </div>
          
          <!-- Important Reminders -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #3F2965; font-size: 16px; margin: 0 0 15px 0;">📋 Important Reminders:</h3>
            <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li>Please be ready 5 minutes before your scheduled time</li>
              <li>For online sessions, ensure you have a stable internet connection</li>
              <li>Find a quiet, private space for your session</li>
              <li>You can reschedule or cancel up to 24 hours before your session</li>
            </ul>
          </div>
          
          <!-- CTA Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/profile#My%20Bookings" 
               style="display: inline-block; background: linear-gradient(135deg, #3F2965 0%, #DD1764 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(63, 41, 101, 0.3);">
              View My Session
            </a>
          </div>
          
          <!-- Contact Info -->
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
              <strong>Questions or need to reschedule?</strong> Contact us at 
              <a href="mailto:support@mindsettler.com" style="color: #DD1764;">support@mindsettler.com</a>
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
            We're excited to help you on your wellness journey 💜
          </p>
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} MindSettler. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Payment Approved - Session Confirmed! ✅
    
    Hi ${userName},
    
    Excellent news! Your payment has been approved and your therapy session is now officially confirmed.
    
    Session Details:
    - Amount: ₹${sessionPrice}
    - Date: ${formattedDate}
    - Time: ${formattedTime}
    - Status: ✓ CONFIRMED
    
    You will receive session details 24 hours before your appointment. For online sessions, you'll get a video call link.
    
    Important Reminders:
    - Be ready 5 minutes before your session
    - For online sessions, ensure stable internet connection
    - Find a quiet, private space
    - You can reschedule or cancel up to 24 hours before
    
    View My Session: ${process.env.FRONTEND_URL}/profile#My%20Bookings
    
    Need help? Contact us at support@mindsettler.com
    
    © ${new Date().getFullYear()} MindSettler
  `;

  await transporter.sendMail({
    from: `"MindSettler" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: `✅ Payment Approved - Your Session is Confirmed for ${formattedDate}`,
    html: htmlContent,
    text: textContent,
  });
};

/**
 * Email sent when admin rejects the session payment
 */
export const sendSessionPaymentRejectedEmail = async (email, paymentDetails) => {
  const transporter = createTransporter();

  const {
    userName,
    appointmentId,
    sessionPrice,
    rejectionReason,
    date,
    timeSlot,
  } = paymentDetails;

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(timeSlot);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Rejected</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 20px 20px 0 0; padding: 40px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">❌</div>
          <h1 style="color: white; margin: 0; font-size: 24px;">Payment Rejected</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Please submit a valid UTR</p>
        </div>
        
        <!-- Body -->
        <div style="background: white; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Unfortunately, your payment submission has been rejected by our admin team. This could be due to an invalid or incorrect UTR number.
          </p>
          
          <!-- Rejection Details -->
          <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px solid #fecaca; border-radius: 16px; padding: 25px; margin-bottom: 25px;">
            
            <!-- Session Info -->
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #fecaca;">
              <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Amount Required</p>
              <p style="color: #dc2626; font-size: 28px; font-weight: bold; margin: 10px 0 0 0;">₹${sessionPrice}</p>
            </div>
            
            <!-- Details -->
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">📅 Session Date</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #fecaca; text-align: right;">
                  <span style="color: #7f1d1d; font-size: 14px; font-weight: 600;">${formattedDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <span style="color: #999; font-size: 12px; text-transform: uppercase;">⏰ Session Time</span>
                </td>
                <td style="padding: 10px 0; text-align: right;">
                  <span style="color: #7f1d1d; font-size: 14px; font-weight: 600;">${formattedTime}</span>
                </td>
              </tr>
            </table>
          </div>
          
          ${rejectionReason ? `
          <!-- Rejection Reason -->
          <div style="background: #f8f9fa; border-left: 4px solid #ef4444; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 25px;">
            <p style="color: #666; font-size: 13px; margin: 0 0 10px 0; font-weight: bold;">Reason for Rejection:</p>
            <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">${rejectionReason}</p>
          </div>
          ` : ""}
          
          <!-- What to Do -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #3F2965; font-size: 16px; margin: 0 0 15px 0;">📋 What You Can Do:</h3>
            <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li><strong>Check the UTR number:</strong> Ensure it matches your actual bank transaction receipt</li>
              <li><strong>UTR format:</strong> Must be 12-20 alphanumeric characters (capital letters and numbers)</li>
              <li><strong>Resubmit payment:</strong> Once corrected, you can submit your payment again</li>
              <li><strong>Contact support:</strong> If you're unsure about your UTR, reach out to our team</li>
            </ul>
          </div>
          
          <!-- Important Notice -->
          <div style="background: linear-gradient(135deg, #fef3cd 0%, #ffeeba 100%); border: 1px solid #ffc107; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <p style="color: #856404; font-size: 13px; margin: 0;">
              <strong>⚠️ Important:</strong> Your session is currently on hold. Please resubmit your payment with the correct UTR number as soon as possible. 
              You can reschedule if needed.
            </p>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/profile#My%20Bookings" 
               style="display: inline-block; background: linear-gradient(135deg, #3F2965 0%, #DD1764 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(63, 41, 101, 0.3); margin-bottom: 15px;">
              Resubmit Payment
            </a>
          </div>
          
          <!-- Reschedule Option -->
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/book-session" 
               style="color: #3F2965; font-size: 14px; font-weight: 600; text-decoration: none;">
              Or book a different time slot →
            </a>
          </div>
          
          <!-- Contact Info -->
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
              <strong>Need help?</strong> Our support team is here to assist. Contact us at 
              <a href="mailto:support@mindsettler.com" style="color: #DD1764;">support@mindsettler.com</a>
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
            We're here to help make this process smooth for you 💜
          </p>
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} MindSettler. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Payment Rejected - Please Resubmit ❌
    
    Hi ${userName},
    
    Unfortunately, your payment submission has been rejected by our admin team.
    
    Session Details:
    - Amount: ₹${sessionPrice}
    - Date: ${formattedDate}
    - Time: ${formattedTime}
    
    Reason for Rejection:
    ${rejectionReason || "Invalid or incorrect UTR number"}
    
    What You Can Do:
    1. Check your UTR number against your bank transaction receipt
    2. Ensure the UTR is 12-20 alphanumeric characters (capital letters and numbers)
    3. Resubmit your payment with the correct information
    4. Contact support if you need assistance
    
    Resubmit Payment: ${process.env.FRONTEND_URL}/profile#My%20Bookings
    
    Important: Your session is on hold. Please resubmit as soon as possible.
    
    Need help? Contact us at support@mindsettler.com
    
    © ${new Date().getFullYear()} MindSettler
  `;

  await transporter.sendMail({
    from: `"MindSettler" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: `❌ Payment Rejected - Please Resubmit Your UTR for ₹${sessionPrice}`,
    html: htmlContent,
    text: textContent,
  });
};