'use client';

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', res.data.isAcceptingMessages || false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError?.response?.data.message ?? 'Failed to fetch settings');
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(res.data.messages || []);
      if (refresh) {
        toast('Showing latest messages');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError?.response?.data.message ?? 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError?.response?.data.message ?? 'Failed to update settings');
    }
  };

  if (!session?.user) return <div></div>;

  const { username } = session.user as User;
  const baseUrl = `${typeof window !== 'undefined' && window.location.protocol}//${typeof window !== 'undefined' && window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast('Profile URL has been copied to clipboard.');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 my-8 bg-black text-white rounded-3xl shadow-xl">
      <h1 className="text-4xl font-bold mb-6">User Dashboard</h1>

      {/* Profile URL Copy Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Copy Your Unique Link</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-md border border-gray-700 p-3 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button onClick={copyToClipboard} className="w-full md:w-auto bg-white text-black hover:bg-gray-200 transition duration-300">
            Copy
          </Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="flex items-center mb-6 gap-3">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages ?? false}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-lg">
          Accept Messages: <span className="font-semibold">{acceptMessages ? 'On' : 'Off'}</span>
        </span>
      </div>

      <Separator className="my-6 border-gray-700" />

      {/* Refresh Messages Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="flex items-center gap-2 bg-gray-700 text-white hover:bg-gray-600 transition duration-200"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span>Refresh</span>
        </Button>
      </div>

      {/* Messages */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-center text-gray-400">No messages to display.</p>
        )}
      </div>
    </div>
  );
}
