import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";




export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const id = params.messageId;

  
    const session = await getServerSession(authOptions);   
    const _user = session?.user;
  
    if (!session || !_user) {
      return Response.json(
        {
          message: "User not found please login again",
          success: false,
        },
        {
          status: 500,
        }
      );
    }
    await dbConnect();
  try {

    const messageId=params.messageId

    const res=await UserModel.updateOne({
        _id:_user._id
    },{
        $pull:{messages :{_id: messageId }}
    })


    if (res.modifiedCount === 0) {
        return Response.json(
          { message: 'Message not found or already deleted', success: false },
          { status: 404 }
        );
      }
  
      return Response.json(
        { message: 'Message deleted', success: true },
        { status: 200 }
      );


    
    } catch (error) {

        console.error('Error deleting message:', error);
        return Response.json(
          { message: 'Error deleting message', success: false },
          { status: 500 }
        );
        
    }
  }
  