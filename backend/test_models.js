import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key:', apiKey ? 'FOUND' : 'MISSING');

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const testModel = async (modelName) => {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      console.log(`Success with ${modelName}:`, response.text());
      return true;
    }

    const models = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.5-flash-lite', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    for (const m of models) {
      try {
        await testModel(m);
        break; // Stop at first working model
      } catch (err) {
        console.error(`Error with ${m}:`, err.message);
      }
    }
  } catch (err) {
    console.error('General error:', err);
  }
}
