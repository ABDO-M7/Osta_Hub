import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log("Starting test...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key");
        return;
    }
    const ai = new GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hello this is a test prompt',
            config: {
                temperature: 0.3,
            }
        });
        console.log("Success:", response.text);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
