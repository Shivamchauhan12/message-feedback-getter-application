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

        const {searchParams} = new URL(request.url);

        const queryParam=searchParams.get('username');

        const result = userNameQuerySchema.safeParse(queryParam);

        if(!result.success){
            const usernameErros=result.error.format().username?._errors || [];

          return  Response.json({
                success: false,
                message: "error checking username"
            }
                , {
                    status: 400
                })
            
        }

        const { username }: any = result.data;

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

       return Response.json({
            success: false,
            message: "error checking username"
        }
            , {
                status: 500
            })

    }
}