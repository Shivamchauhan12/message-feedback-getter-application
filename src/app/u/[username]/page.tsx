'use client'

import React, { useEffect, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { messageSchema } from '@/schemas/messageSchema'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'

const Page = () => {
  const params = useParams();
  const myParam = params.username;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [issendingMessage, setIsSendingMessage] = useState(false)
  const [issendingChatQuery, setIsSendingChatQuery] = useState(false)
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [suggestedMessages, setSuggestedMessages] = useState([
    "What's a skill you'd love to learn if you had the time?",
    "If you could instantly master any musical instrument, which would you choose?",
    "What's a small act of kindness you've witnessed or performed recently?"
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const { reset, setValue } = form

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    setIsSendingMessage(true);
    try {
      if (myParam && data.content) {
        const res = await axios.post("/api/send-messages", {
          username: myParam, content: data.content
        })
        if (!res.data.success) {
          toast(res.data.message)
          return
        }
        reset({ content: "" });
        toast("Message sent successfully")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message)
    } finally {
      setIsSendingMessage(false);
    }
  }

  // async function getSuggestedMessages(prompt: string="") {
  //   try {
  //     const res = await axios.post("/api/gemenai-model", { text: prompt })
  //     console.log(res)
  //     return res;
  //   } catch (error) {
  //     toast("Internal Server Error");
  //   } 
  // }


  async function getSuggestedMessages(prompt: string = "") {
    try {
      const res = await fetch("/api/gemenai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();

      return reader;

      // const decoder = new TextDecoder();
      // let result = "";

      // while (true) {
      //   const { value, done } = await reader.read();
      //   if (done) break;

      //   result += decoder.decode(value, { stream: true });
      // }
      // return result;
    } catch (error) {
      toast("Internal Server Error");
      console.error("Streaming error:", error);
    }
  }


  async function getMessages() {
    setIsGeneratingSuggestions(true)
    const data = await getSuggestedMessages();
    const decoder = new TextDecoder();
    let result = "";
    var newMessages;
    while (true && data) {
      const { value, done } = await data.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
    if (result) {
      newMessages = result.split("||")
      setSuggestedMessages(newMessages);
    }
    setIsGeneratingSuggestions(false)
  }

  const selectMessage = async (msg: string) => {
    if (msg) {
      setValue("content", msg);
    }
  }


  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    setIsSendingChatQuery(true);
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, `You: ${userMsg}`]);
    setChatInput(""); // Clear the input field
  
    try {
      // Call API to get the suggested messages stream
      const res = await getSuggestedMessages(userMsg);
  
      // Initialize a decoder for streaming the data
      const decoder = new TextDecoder();
      let result = "";
      const botMessageIndex = chatMessages.length;
      // Loop to process chunks of data as they come in
      while (true && res) {
        const { value, done } = await res.read();
  
        if (done) break;  // Exit loop if no more data
  
        // Decode the chunk and append it to the current result
        result += decoder.decode(value, { stream: true });
        // Update chat messages with real-time data
        setChatMessages((prev) => {
           const updatedMessages = [...prev];
          updatedMessages[botMessageIndex] = `Bot: ${result}`; // Update the bot's message
          return updatedMessages; // Return updated messages array
        });
  
        // Optionally, you can log the current result for debugging
        console.log(result);
      }
    } catch (error) {
      // In case of error, show error message
      setChatMessages((prev) => [...prev, "Bot: Error retrieving response."]);
    } finally {
      setIsSendingChatQuery(false);
    }
  };
  

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      {(issendingMessage || isGeneratingSuggestions || issendingChatQuery) && (
        <div className="fixed inset-0 bg-black/10 z-[9999]" />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Form Section */}
        <div className="bg-neutral-900 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Send a Message</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        className="resize-none bg-neutral-800 text-white border border-neutral-700 focus:ring-white focus:border-white min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
              >
                {issendingMessage ? "Sending Message..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Suggested Messages Section */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center mb-2">Suggested Messages</h2>
          <div className="flex flex-col gap-3 overflow-auto max-h-[400px]">
            {suggestedMessages.map((item, index) => (
              <div
                onClick={() => { selectMessage(item) }}
                key={index}
                className="bg-white/5 border border-neutral-700 px-4 py-3 rounded-lg text-sm hover:bg-white/10 transition"
              >
                {item}
              </div>
            ))}
          </div>
          <Button
            onClick={getMessages}
            className="mt-4 bg-white text-black hover:bg-gray-200 font-semibold"
          >
            {isGeneratingSuggestions ? "Generating Suggestions..." : "Generate Suggestion"}

          </Button>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-200 transition"
        >
          💬
        </button>

        {/* Chatbot Window */}
        {showChatbot && (
          <div className="mt-4 w-80 bg-neutral-900 text-white rounded-2xl shadow-2xl p-4">
            <h2 className="text-lg font-semibold mb-2">Chatbot</h2>
            <div className="max-h-64 overflow-y-auto flex flex-col gap-2 mb-3 text-sm">
              {chatMessages.length === 0 ? (
                <p className="text-neutral-400">Start the conversation...</p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className={`p-2 rounded-md ${msg.startsWith("You:") ? "bg-white/10 self-end" : "bg-white/5 self-start"}`}>
                    {msg}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              />
              <button
                onClick={handleSendChat}
                className="bg-white text-black px-3 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold"
              >
                {issendingChatQuery ? "Getting Response..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default Page
