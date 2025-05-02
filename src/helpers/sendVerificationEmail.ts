import VerificationEmail from "../../emails/verificationEmail";
import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
     
        const htmlContent = VerificationEmail({ username, otp: verifyCode });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // App password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code',
            html: htmlContent,  
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Verification email not sent",
        };
    }
}
