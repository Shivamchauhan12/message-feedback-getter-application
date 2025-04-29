import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
    console.log(email)
        const {error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'verification code',
            react: VerificationEmail({ username, otp:verifyCode }),
        });

        if(error){
            return {
                success:false,
                message:"Verification email not sent"
            }
        }

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