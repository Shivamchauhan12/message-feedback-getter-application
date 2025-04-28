'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import messsage from "../message.json"

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-12 px-4 space-y-10">
      {/* Heading Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Featured Highlights
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-lg">
          Discover some of the key moments that define excellence.
        </p>
      </div>

      {/* Carousel Section */}
      <Carousel
        plugins={[Autoplay({ delay: 2500 })]}
        className="w-full max-w-md md:max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6"
      >
        <CarouselContent>
          {messsage.map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition duration-300">
                  <CardContent className="flex aspect-square items-center justify-center p-10">
                    <div className="text-center">
                      <span className="text-5xl font-bold text-black">{_.title}</span>
                      <p className="text-gray-600 mt-4"> {_.content}</p>
                      <p>  
                     <div className="text-center">{_.received}</div>
                   </p>
                    </div>
                  </CardContent>
                 
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="bg-black text-white hover:bg-gray-800 rounded-full transition" />
        <CarouselNext className="bg-black text-white hover:bg-gray-800 rounded-full transition" />
      </Carousel>
    </div>
  );
};

export default Page;
