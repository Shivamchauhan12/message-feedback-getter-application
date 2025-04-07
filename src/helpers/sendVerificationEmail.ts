import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        const { data, error } = await resend.emails.send({
            from: '  <onboarding@resend.dev>',
            to: email,
            subject: 'verification code',
            react: VerificationEmail({ username, otp:verifyCode }),
        });

        return {
            success:true,
            message:"verification email send succesfully"

        }
        
    } catch (error) {

        console.log("email not snet",error)

        return {
            success:false,
            message:"verification email not sent"
        }
        
    }

  


}