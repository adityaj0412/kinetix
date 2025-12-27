
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, Goal, AICoachResponse } from "../types";

// Initialize the Google GenAI client using the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFitnessInsights = async (
  activities: Activity[],
  goals: Goal[]
): Promise<AICoachResponse> => {
  // Use gemini-3-flash-preview for basic text tasks like fitness data analysis
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following user fitness data:
    Recent Activities: ${JSON.stringify(activities.slice(-5))}
    Current Goals: ${JSON.stringify(goals)}
    
    Provide a concise motivational insight, 3 specific recommendations for improvement, and an overall status.
  `;

  // Request content generation with a JSON schema for structured output
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insight: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          status: { 
            type: Type.STRING,
            description: "Must be one of: motivating, caution, praising"
          }
        },
        required: ["insight", "recommendations", "status"]
      }
    }
  });

  // Access the .text property directly (not a method) as per the SDK guidelines
  const resultText = response.text;
  
  if (!resultText) {
    throw new Error("The AI model returned an empty response.");
  }

  // Parse the JSON string from the response text
  return JSON.parse(resultText.trim()) as AICoachResponse;
};
