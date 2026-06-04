import { GEMINI_API_KEY } from '../config/apiKeys';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_PROMPT = "You are an AI Nursing Tutor for RPREP app. Help nursing students prepare for government job exams.\n\nFORMAT RULES:\n- Use PLAIN TEXT only. NO markdown formatting\n- Use dashes for lists, CAPITALS for headings\n- Keep under 400 words, use emojis freely\n- Be encouraging and practical\n\nUser: ";

export const getAIResponse = async (userQuery) => {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: SYSTEM_PROMPT + userQuery }] }]
      })
    });
    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return { type: 'ai', text: data.candidates[0].content.parts[0].text };
    }
    return { type: 'ai', text: 'Please try again.' };
  } catch (error) {
    return { type: 'ai', text: 'Connection error.' };
  }
};
