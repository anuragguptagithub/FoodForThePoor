
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMealIdea = async (foodItems: string[]): Promise<string> => {
  if (foodItems.length === 0) {
    return "Please select some food items to get a meal idea.";
  }

  const prompt = `
    You are a helpful assistant for a food charity.
    Given the following leftover food items from a restaurant: ${foodItems.join(', ')}.
    Suggest a simple, nutritious, and easy-to-prepare meal idea that combines them.
    Provide a creative name for the meal and a short, step-by-step recipe.
    The recipe should require minimal additional ingredients, assuming the user has basic staples like salt, pepper, and oil.
    Format the output in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating meal idea:", error);
    return "Sorry, I couldn't generate a meal idea at the moment. Please try again later.";
  }
};
