import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
interface Credentials {  
        redirect: string,
        identifier: string,
        password: string,
        csrfToken: string,
        callbackUrl: string,
        json: string,
      }
  


export const authOptions : NextAuthOptions = {

    providers: [
        CredentialsProvider({
            name: "Credentials",
            id:"credentials",
            credentials: {
                username: { label: "Email or username", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any ) : Promise<any>{

                console.log(credentials)


                await dbConnect();

                try {
                    const user= await UserModel.findOne({
                        $or:[{email:credentials.identifier},{username:credentials.identifier}]
                    })
    
                    if(!user){
                        throw new Error("User not found")
                    }

                    if(!user.isVerified){
                        throw new Error("User not verified")
                    }

                    const ispasswordMatch=await bcrypt.compare(credentials.password,user.password);

                    if(ispasswordMatch){
                        return user;
                    }else{
                        throw new Error("Password is incorrect");
                    }

                } catch (error:any) {
                    throw new Error(error?.message || "Authentication failed");
                 }   
              }
        })
    ],
    callbacks:{ 
    async session({ session, token }) {
        if(token){
            session.user._id=token._id;
            session.user.isVerified=token.isVerified;
            session.user.isAcceptingMessages=token.isAcceptingMessages;
            session.user.username=token.username;
        }
      return session
    },
    async jwt({ token, user}) {
        if(user){
            token._id=user._id;
            token.isVerified=user.isVerified;
            token.isAcceptingMessages=user.isAcceptingMessages;
            token.username=user.username;
        }

      return token
    }
 
    },
    pages : {
        signIn:"/sign-in"
    },
   session : {
    strategy : "jwt"
   },
   secret:process.env.AUTH_SECRET
     
}