// src/services/geminiApi.js
// Purpose: Handles calls to the Gemini API.

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || ""; // Directly use the environment variable


export const callGeminiApi = async (prompt, isJsonOutput = false) => {
    const model = 'gemini-2.0-flash';
    console.log("Gemini API Key being used:", GEMINI_API_KEY); // <<< ADD THIS LINE
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    if (isJsonOutput) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: { type: "OBJECT", properties: { suggestions: { type: "ARRAY", items: { type: "STRING" } } } }
        };
    }
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { const errorBody = await response.text(); console.error("Gemini API Error Response:", errorBody); throw new Error(`Gemini API request failed: ${response.status}`); }
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]) {
            const rawText = result.candidates[0].content.parts[0].text;
            if (isJsonOutput) { try { return JSON.parse(rawText); } catch (e) { console.error("Failed to parse JSON from Gemini:", e, "Raw text:", rawText); throw new Error("Invalid JSON response from Gemini."); } }
            return rawText;
        } else { console.error("Unexpected Gemini API response structure:", result); throw new Error("Unexpected response from Gemini API."); }
    } catch (error) { console.error("Error calling Gemini API:", error); throw error; }
};