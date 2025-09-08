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
      - If a user asks for exercises, send data in this format:
        [
          {
            "exercise": { ...CreateExerciseDto fields },
            "contents": [ ...CreateExerciseContentDto entries for this exercise ]
          }
        ]
        It can also be a single entry.
      - The "exercise" object holds the main information (e.g., Squats, Push Ups, Surya Namaskar).
      - The "contents" array should include steps or media related to that exercise. 
        For example, Surya Namaskar may have 5-6 steps, each as a separate content entry.
      - Keep answers concise unless more details are requested.
    `,
  },
];

async function getGroqChatCompletion(userPrompt: string) {
  message.push({
    role: "user",
    content: userPrompt,
  });

  return groq.chat.completions.create({
    messages: message as unknown as any,
    model: "openai/gpt-oss-20b",
    // tools: [
    //   {
    //     type: "browser_search",
    //   },
    // ],
  });
}

const MAX_TRIES = 10;

async function main() {
  const rl = readline.createInterface({ input, output });
  console.log(
    `💬 Ask me anything (type 'exit' to quit, max ${MAX_TRIES} questions):`
  );

  let tries = 0;

  while (true) {
    const question = await rl.question("> ");
    if (question.toLowerCase() === "exit") break;

    tries++;

    if (tries > MAX_TRIES) break;
    try {
      const chatCompletion = await getGroqChatCompletion(question);
      const answer =
        chatCompletion.choices[0]?.message?.content || "No response";
      console.log("\n🤖 Answer:");
      console.log(answer, "\n");

      message.push({ role: "assistant", content: answer });
      tries = 0;
    } catch (error) {
      console.error("❌ Error fetching response:", error);
      break;
    }
  }

  console.log(`\n👋 Max tries reached or exit requested. Goodbye!`);
  rl.close();
  process.exit(0);
}
process.on("unhandledRejection", (reason: any) => {
  if (reason.name === "AbortError") return; // Ignore AbortError
  console.error("Unhandled Rejection:", reason);
});

main();
