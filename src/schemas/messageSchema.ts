import { z } from "zod";

export const messageSchema= z.object({
    content : z.string().min(10,"Username must be ten character").max(300,"Username must be no more than 300 character") 
  
})