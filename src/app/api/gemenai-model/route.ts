// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { streamText } from "ai";
 

// const genAI = new GoogleGenerativeAI(process.env.SECRET_OPENAI || "");
// const model =  genAI.getGenerativeModel({
//   model: "gemini-2.0-flash-001",
//   tools: [
//     {
//       codeExecution: {},
//     },
//   ],
// });
  
// export async function POST(req: Request): Promise<Response> {
   
//   const data = await req.json();
 
  
//   const prompt = data.text !== ""  ? data.text : "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment just give mesages noa a single word extra.";
 

 
//   if(!model){
//     return Response.json({
//       success: false,
//       message: "Modal not loaded",
//   }
//       , {
//           status: 500
//       })
//   }
 
//   const result = await model.generateContent(prompt);
//   const text =   result.response.text();

//         return Response.json({
//           success: true,
//           message: "Messages fetched succesfully",
//           data:text
//       }
//           , {
//               status: 200
//           })
 
// //   return new Response(
// //     JSON.stringify({
// //       summary: result.response.text(),
// //     }),
// //   );
// }



import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamText } from "ai";
 

const genAI = new GoogleGenerativeAI(process.env.SECRET_OPENAI || "");
const model =  genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  tools: [
    {
      codeExecution: {},
    },
  ],
});
  
export async function POST(req: Request): Promise<Response> {
   
  const data = await req.json();
 
  
  const prompt = data.text !== ""  ? data.text : "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment just give mesages noa a single word extra.";
 

 
  if(!model){
    return Response.json({
      success: false,
      message: "Modal not loaded",
  }
      , {
          status: 500
      })
  }

  try {

    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {

          console.log(chunk,"from chunk");
          const parts = chunk.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            controller.enqueue(encoder.encode(part.text));
          }
        }
        controller.close();
      },
    });
console.log(stream,"from stream")
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
    
  } catch (error) {
    console.log("geeting issue fetching ai response",error)
    return Response.json({
      message:"INternal server error",
      success:false
    },
    {
      status:500
    }
  )
  }
 
  // const result = await model.generateContent(prompt);

 
 
//   return new Response(
//     JSON.stringify({
//       summary: result.response.text(),
//     }),
//   );
}