import { z } from "zod";

export const usernameValidation= z.string().min(2,"Username must be two character").max(20,"Username must be no more than 20 character").regex(/^[A-Za-z0-9]*$/,"Usename must not containg special characters")

export const signUpSchema= z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be st least 6 characters"})
})