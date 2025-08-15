import { ChatGroq } from "@langchain/groq";

export const createGroqModel = () => {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL;
  if (!apiKey) {
    console.warn("GROQ_API_KEY is not set; ChatGroq will likely fail.");
  }
  return new ChatGroq({
    model: `${model}`,
    temperature: 0.2,
    apiKey,
  });
};


