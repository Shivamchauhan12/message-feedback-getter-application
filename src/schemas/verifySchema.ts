import { z } from "zod";

export const verifyCodeSchema= z.object({
    code: z.coerce.number().min(100000, "Code must be at least 6 digits"),
})