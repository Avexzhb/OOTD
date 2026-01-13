import { GoogleGenAI } from "@google/genai";
import { Gender } from "../types";

export const generatePersonaImage = async (city: string, age: number, gender: Gender): Promise<string> => {
  // Uses process.env.API_KEY which is standard for Vercel deployment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prompt kept exactly as requested by user
  const prompt = `Create a Hybrid Fashion Editorial Sytle illustration depicting a suitable outfit of a ${age}-year-old ${gender} for today's weather in ${city}, incorporating temperature and local characteristics.In the center of the image, showcase a model wearing the complete outfit standing on the local street.In the four corners of the image, show the corresponding and the detailed descriptions in local language of the following: 1.left up corner shows upper garment: Include information on the material, color, and any unique local design elements.2.lest bottom cover shows Lower garment: Describe the fabric, color, and how it complements the upper garment.3.right up corner shows accessories: Detail the type of accessories used, their materials, colors, and relevance to local fashion trends.4.right bottom corner shows footwear: Specify the type of shoes, their materials, colors, and how they fit the overall outfit. Ensure the outfit is visually appealing and appropriate for a day out in the city, reflecting the fasiong style, local culture and climate. The corresponding and the detailed descriptions do not cover the model in the middle. --ar3:4.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64Data = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64Data}`;
    } else {
      throw new Error("Style curation currently unavailable. Please try again in a moment.");
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
