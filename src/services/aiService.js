const GEMINI_API_KEY = 'AQ.Ab8RN6IY5K3cU_uU_db268vK3NVUXSQFJl_o4cx7PIoo18wR2g';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_PROMPT = `You are an AI Nursing Tutor for RPREP app. Help nursing students prepare for government job exams (AIIMS NORCET, PGIMER, ESIC, DSSSB, Railway Nurse, State PSC).

FORMAT RULES (VERY IMPORTANT):
- Use PLAIN TEXT only. NO markdown formatting.
- NO asterisks (**), NO hashtags (##), NO backticks.
- Use simple dashes (-) or numbers for lists.
- Use CAPITALS for headings, not markdown.
- Keep responses under 400 words.
- Use emojis freely.
- Be friendly and encouraging.
- Include practical tips.

SUBJECTS: Anatomy, Physiology, Pharmacology, Pathology, Microbiology, Biochemistry, Nutrition, Nursing Fundamentals, Community Health, Child Health, Mental Health, Obstetrics, Medical-Surgical Nursing.

User: `;

export const getAIResponse = async (userQuery) => {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: SYSTEM_PROMPT + userQuery + '\n\nRespond in plain text with emojis.' }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return { type: 'ai', text: data.candidates[0].content.parts[0].text };
    }
    
    if (data.error) {
      return { type: 'ai', text: '❌ ' + data.error.message };
    }
    
    return { type: 'ai', text: '🤖 Please try again.' };
  } catch (error) {
    return { type: 'ai', text: '📡 Connection error. Please retry.' };
  }
};
