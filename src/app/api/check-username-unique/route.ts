import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';

const userNameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();

    try {
        

        const {searchParams} = new URL(decodeURIComponent(request.url));
       
        const queryParam={ username: searchParams.get('username') ?? ''}

     

        const result = userNameQuerySchema.safeParse(queryParam);
     

        if(!result.success){
            
            const usernameErrors = result.error.format().username?._errors || [];
           

          return  Response.json({
                success: false,
                message:   usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Invalid query parameters', 
            }
                , {
                    status: 400
                })
            
        }

        const { username }= result.data;

        const existingVerifiedUser= await UserModel.findOne({
            username,isVerified:true
        })

        if(existingVerifiedUser){
           return Response.json({
                success: false,
                message: "username already exist"
            }
                , {
                    status: 400
                })
        }


       return Response.json({
            success: true,
            message: "username is unique"
        }
            , {
                status: 200
            })
        




    } catch (error) {
       console.log("Unique username check error ",error)
       return Response.json({
            success: false,
            message: "error checking username"
        }
            , {
                status: 500
            })

    }
}