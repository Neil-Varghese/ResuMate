import Openai from "openai";

console.log('OpenAI Config:');
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('API Key length:', process.env.OPENAI_API_KEY?.length);
console.log('Base URL:', process.env.OPENAI_BASE_URL);
console.log('Model:', process.env.OPENAI_MODEL);

const ai = new Openai({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export default ai;