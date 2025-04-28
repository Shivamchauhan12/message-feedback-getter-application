'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';
import UserModel from '@/model/User';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import { Message } from '@/model/User';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const deleteMessage = async () => {
    try {
      const res = await axios.delete<ApiResponse>(`api/delete-message/${message._id}`);
      toast(res.data.message);
   //   onMessageDelete(message._id); // Notify parent component to update the UI
    } catch (error) {
      console.log('Unable to delete message');
      toast('Error deleting message');
    }
  };

  return (
    <Card className="bg-black text-white shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger className="text-red-500 hover:text-red-300">Delete</AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 text-white rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and
                remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteMessage}
                className="bg-red-600 text-white hover:bg-red-500"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
