import Groq from "groq-sdk";
import * as dotenv from "dotenv";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is missing in .env");
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY }) 

const currentDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });


const message = [
      {
        role: "system",
        content: `
          You are a helpful AI chatbot running in a terminal.
          - Today's date and time: ${currentDate}.
          - You can answer questions concisely for terminal display.
          - If the user asks something requiring web search, respond with:
             "I cannot browse the internet in this mode."
          - If the question is about code, explain clearly and give examples.
          - Keep answers short and clear unless the user asks for details.
        `,
      },
    ]

async function getGroqChatCompletion(userPrompt: string) {
  return groq.chat.completions.create({
    messages: [
        ...message,
        {
            role:"user",
            content: userPrompt
        }
    ] as unknown as any,
    model: "openai/gpt-oss-20b",
  });
}


export async function main() {
  const rl = readline.createInterface({ input, output });

  console.log("💬 Ask me anything (type 'exit' to quit):");

  const cleanExit = () => {
    console.log("\n👋 Exiting gracefully...");
    rl.close();
    process.exit(0);
  };

  while (true) {
    const question = await rl.question("> ");
    if (question.toLowerCase() === "exit") {
      cleanExit();
      break;
    }

    process.on("SIGINT", cleanExit);
    process.on("SIGTERM", cleanExit);
    
    try {
      const chatCompletion = await getGroqChatCompletion(question);
      console.log("\n🤖 Answer:");
      console.log(chatCompletion.choices[0]?.message?.content || "No response");
      console.log();
    } catch (error) {
      console.error("❌ Error fetching response:", error);
    }
  }
}

process.on("unhandledRejection", (reason: any) => {
  if (reason.name === "AbortError") return; // Ignore AbortError
  console.error("Unhandled Rejection:", reason);
});

main();
