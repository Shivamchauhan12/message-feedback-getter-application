import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }
                , {
                    status: 404
                })
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "user isnot accepting the messages"
            }
                , {
                    status: 403
                })
        }

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message);

        await user.save();

        return Response.json({
            success: true,
            messages: user.messages
        } , {
                status: 200
            })



    } catch (error) {

        console.log("an unexpected error occured");

        return Response.json({
            success: false,
            message: "not authenticated"
        }
            , {
                status: 500
            })

    }

}