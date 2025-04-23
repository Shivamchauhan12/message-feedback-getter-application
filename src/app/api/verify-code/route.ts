 
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
 


export  async  function POST (request : Request){

    await dbConnect();

    try {

        const {username,code} = await request.json();

        const decodeduserName= decodeURIComponent(username)

        const User=await UserModel.findOne({
            username:decodeduserName
        });

        if(!User){
          return   Response.json({
                success: false,
                message: "user not exist"
            }
                , {
                    status: 404
                })
        }

        const isCodeValid= User.verifyCode == code;
        const isCodeNotExpired=  new Date(User?.verifyCodeExpiry) > new Date();

        if(isCodeNotExpired && isCodeValid){
            User.isVerified =true;
            await User.save();

            return Response.json({
                success: false,
                message: "user verified successfully"
            }
                , {
                    status: 200
                })
        }else if (!isCodeNotExpired){

          return   Response.json({
                success: false,
                message: "verification code expired please signup again"
            }
                , {
                    status: 500
                })

        }else{
            return Response.json({
                success: false,
                message: "incorret verifcation code"
            }
                , {
                    status: 500
                })
        }



        
    } catch (error) {

        Response.json({
            success: false,
            message: "error verifying code"
        }
            , {
                status: 500
            })
        
    }

}