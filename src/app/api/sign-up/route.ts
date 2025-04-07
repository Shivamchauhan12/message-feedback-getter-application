import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {

    try {
        await dbConnect();

        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                message: "Username already taken",
                success: false
            },
                { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 100000).toString()

        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return Response.json({
                    message: "User already Registered",
                    success: false
                }, {
                    status: 500
                })
            } else {
                const hassedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hassedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000).toString();
                await existingUserByEmail.save();


            }

        } else {
            const hassedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hassedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                message: emailResponse.message,
                success: false
            }, {
                status: 500
            })
        }


        return Response.json({
            message: "User Registered Successfully",
            success: false
        }, {
            status: 500
        })

    } catch (error) {

        console.log("Error regerting user", error)
        Response.json({
            message: "Error Registering user",
            success: false
        },
            {
                status: 500
            }
        )

    }

}