import Groq from "groq-sdk";
import * as dotenv from "dotenv";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { ExercsieResponse } from "./exercises.js";
dotenv.config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY is missing in .env");
    process.exit(1);
}
const groq = new Groq({ apiKey: GROQ_API_KEY });
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
      You are a pro fitness AI chatbot running in a terminal.
      - Today's date and time: ${currentDate}.
      - You specialize in all aspects of fitness: exercises, yoga, workouts, nutrition tips, and wellness.
      - You can search online for the latest exercises.
      - When returning exercises, always format them according to the CreateExerciseDto and CreateExerciseContentDto structure.
      - Each exercise can have multiple contents, including text, images, or videos, with position and optional metadata.
      - Keep answers concise for terminal display unless more details are requested.
      - If user asks for exercsises then send data in this format
       ${ExercsieResponse} it can also be a single entery

    `,
    },
];
async function getGroqChatCompletion(userPrompt) {
    message.push({
        role: "user",
        content: userPrompt,
    });
    return groq.chat.completions.create({
        messages: message,
        model: "openai/gpt-oss-20b",
        tools: [
            {
                type: "browser_search",
            },
        ],
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
            message.push({
                role: "assistant",
                content: chatCompletion.choices[0]?.message?.content || "No response",
            });
        }
        catch (error) {
            console.error("❌ Error fetching response:", error);
        }
    }
}
process.on("unhandledRejection", (reason) => {
    if (reason.name === "AbortError")
        return; // Ignore AbortError
    console.error("Unhandled Rejection:", reason);
});
main();
