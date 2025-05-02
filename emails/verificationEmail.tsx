interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return `
    <html lang="en" dir="ltr">
      <head>
        <title>Verification Code</title>
        <style>
          body { font-family: 'Roboto', Verdana, sans-serif; }
        </style>
      </head>
      <body>
        <h2>Hello ${username},</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <h3>${otp}</h3>
        <p>If you did not request this code, please ignore this email.</p>
      </body>
    </html>
  `;
}
