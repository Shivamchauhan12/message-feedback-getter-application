"use client";

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import UserModel from '@/model/User';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner'
import { Message } from '@/model/User';

type MessageCardProps={
    message:Message ,
    onMessageDelete : (messageId : string)=>void
}
  
  

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    

    const deleteMessage= async()=>{
        try {
             console.log("sdsfdsfdsf")
            const res = await axios.delete<ApiResponse>(`api/delete-message/${message._id}`)
            console.log(res)
           // toast(res.data.message)
            
        } catch (error) {

            console.log("unable to delete message")
            
        }
    }


  return (
    <Card>
  <CardHeader>
    <CardTitle>{message.content}</CardTitle>
    <AlertDialog>
    <AlertDialogTrigger>Delete</AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={()=>{deleteMessage()}}>Continue</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
 
  </CardHeader>
</Card>

  )
}

export default MessageCard
