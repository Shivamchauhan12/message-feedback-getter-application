import { z } from "zod";

export const messageSchema= z.object({
    content : z.string().min(10,"Text at least of ten character").max(300,"Text must be no more than 300 character") 
  
})