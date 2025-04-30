import { z } from "zod";

export const signInSchema= z.object({
    identifier : z.string().min(1,"Username can not be empty") ,
    password : z.string().min(1,"Password can not be empty")
})