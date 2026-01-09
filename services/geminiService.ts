
import { GoogleGenAI, Type } from "@google/genai";
import { VivaFact } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getVivaExplanation = async (topic: string): Promise<VivaFact> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Provide a detailed technical explanation for a Viva exam on: ${topic}. 
    Focus on:
    1. The Trigonometry of a Sphere: How sin() and cos() are used to position rings in 3D space.
    2. CSS 3D Projection: The role of 'perspective', 'preserve-3d', and 'translateZ'.
    3. Performance: Why DOM-based 3D is efficient for simple objects vs WebGL.
    Format as JSON with keys: topic, explanation, codeSnippet.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          codeSnippet: { type: Type.STRING },
        },
        required: ["topic", "explanation"],
      },
    },
  });

  try {
    return JSON.parse(response.text || '{}') as VivaFact;
  } catch (e) {
    return {
      topic,
      explanation: "Failed to generate explanation. Please try again.",
    };
  }
};

export const chatWithAssistant = async (message: string, history: { role: string; text: string }[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are Aura, an expert in Computer Graphics and Mathematical Visualization. 
      You help students understand 3D concepts using only HTML/CSS/JS. 
      Your tone is technical, clear, and encouraging. 
      Focus on spherical trigonometry, CSS 3D matrices, and performance optimization.`,
    },
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
