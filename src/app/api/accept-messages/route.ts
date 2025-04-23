import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import auth from "next-auth"

export async function POST(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    //  const session = auth();

    const user: User = session?.user as  User;

    if (!session || !session.user) { 
        return Response.json({
            success: false,
            message: "not authenticated"
        }
            , {
                status: 401
            })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to updated accept status"
            }
                , {
                    status: 500
                })
        }

        return Response.json({
            success: false,
            message: "status updated",
            data: updatedUser
        }
            , {
                status: 200
            })





    } catch (error) {

        console.log("failed to update the status of accept messages");
        return Response.json({
            success: false,
            message: "failde to update messsage status"
        }
            , {
                status: 400
            })

    }

}

export async function GET(request : Request){

    await dbConnect();

    const session = await getServerSession(authOptions);
    //  const session = auth();

    const user: User = session?.user as  User;

    if (!session || !session.user) { 
        return Response.json({
            success: false,
            message: "not authenticated"
        }
            , {
                status: 401
            })
    }

    const userId = user._id;

    try {

        const foundUser= await UserModel.findById(userId);

        if(!foundUser){
            return Response.json({
                success: false,
                message: "user not found"
            }
                , {
                    status: 404
                })
        }

        return Response.json({
            success: false,
            isacceptingMessages : foundUser.isAcceptingMessage
             
        }
            , {
                status: 200
            })


        
    } catch (error) {

        console.log("unable to get message status  ");

        return Response.json({
            success: false,
            message: "failed to get accepting message status"
        }
            , {
                status: 500
            })
        
    }

}

