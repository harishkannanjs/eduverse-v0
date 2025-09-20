// lib/gemini-client.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateText(prompt: string): Promise<string> {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Failed to generate text:", error);
        throw new Error(`Failed to generate text: ${error}`);
    }
}

export async function streamChat(messages: any[], systemMessage: string): Promise<string> {
    try {
        const fullPrompt = `${systemMessage}\n\nConversation:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Failed to stream chat:", error);
        throw new Error(`Failed to stream chat: ${error}`);
    }
}


export async function generateInsight(type: string, userData: any): Promise<string> {
    let prompt = "";

    switch (type) {
        case "study_plan":
            prompt = `Based on this student's progress data: ${JSON.stringify(userData)}, create a personalized study plan with specific recommendations for improvement. Focus on concrete actionable steps.`;
            break;
        case "performance_analysis":
            prompt = `Analyze this student's performance data: ${JSON.stringify(userData)} and provide insights about strengths, weaknesses, and areas for improvement. Be specific and encouraging.`;
            break;
        case "motivation":
            prompt = `Based on this student's recent activity: ${JSON.stringify(userData)}, provide encouraging and motivational feedback to help them stay engaged. Keep it positive and inspiring.`;
            break;
        default:
            prompt = `Provide general educational insights for this student based on their data: ${JSON.stringify(userData)}. Focus on helpful and actionable advice.`;
    }

    return generateText(prompt);
                      }
