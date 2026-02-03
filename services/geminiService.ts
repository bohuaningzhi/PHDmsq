import { GoogleGenAI } from "@google/genai";
import { FoodItem, City, MealTime } from "../types";

export const getPhDFortune = async (food: FoodItem, city: City, mealTime: MealTime): Promise<string> => {
  try {
    // 动态实例化，防止全局初始化失败导致整个应用崩溃
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const prompt = `
      我正在为一款给博士生选择饭点的APP设计文案。
      当前背景：
      城市：${city}
      餐点：${mealTime}
      推荐食物：${food.name}
      食物描述：${food.description}
      
      请结合该食物的特点，给这位正在苦读的博士生写一段简短、幽默、充满鼓励的“博士灵签”评语。
      字数控制在50字以内，语言要接地气，包含一些科研术语（如：SCI、建模、调参、组会、降重、盲审等）。
      只需要返回文案内容。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "乾坤未定，你我皆是黑马。吃完这顿，数据必出！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "天降大任于博也，必先丰其肠胃。此乃上上之选，吃它！";
  }
};