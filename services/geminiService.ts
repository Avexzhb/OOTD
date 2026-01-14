import { GoogleGenAI } from "@google/genai";
import { Gender } from "../App";

/**
 * Initialize the Gemini client once for reuse across the application.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePersonaImage = async (city: string, age: number, gender: Gender): Promise<string> => {
  // Prompt kept exactly as requested by user
  const prompt = `Create a Hybrid Fashion Editorial Sytle illustration depicting a suitable outfit of a ${age}-year-old ${gender} for today's weather in ${city}, incorporating temperature and local characteristics.In the center of the image, showcase a model wearing the complete outfit standing on the local street.In the four corners of the image, show the corresponding and the detailed descriptions in local language of the following: 1.left up corner shows upper garment: Include information on the material, color, and any unique local design elements.2.lest bottom cover shows Lower garment: Describe the fabric, color, and how it complements the upper garment.3.right up corner shows accessories: Detail the type of accessories used, their materials, colors, and relevance to local fashion trends.4.right bottom corner shows footwear: Specify the type of shoes, their materials, colors, and how they fit the overall outfit. Ensure the outfit is visually appealing and appropriate for a day out in the city, reflecting the fasiong style, local culture and climate. The corresponding and the detailed descriptions do not cover the model in the middle. --ar3:4.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "1K"
        }
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find(part => part.inlineData);

    if (imagePart?.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    
    throw new Error("Generation failed to produce an image. Please try again.");
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("Requested entity was not found. Please ensure your API key is valid and linked to a project with billing.");
    }
    throw error;
  }
};
