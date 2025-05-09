import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET( ) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    //  const session = auth();

    const user: User = session?.user as User;
    

   

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }
            , {
                status: 401
            })
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    

    try {

        const user = await UserModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },  
            { $sort: { 'messages.createdAt': -1 } },
            { 
              $group: { 
                _id: '$_id', 
                messages: { $push: '$messages' } 
              } 
            }
        ]);
        
        console.log(user,userId)
        if (!user || user.length === 0) {
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
            messages: user[0].messages
        }
        )



    } catch (error) {

        console.log("all messages not fetched succesfully",error)

        return Response.json({
            success: false,
            message: "failed to get all messages"
        }
            , {
                status: 402
            })

    }

}