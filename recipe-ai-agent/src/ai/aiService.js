async function parseQuery(query) {
    const prompt = `
Extract structured JSON from this food query:
"${query}"

Return ONLY JSON:
{
  "diet_type": "veg or non-veg",
  "max_calories": number,
  "goal": "protein / weight loss / etc"
}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3",
            prompt: prompt,
            stream: false
        })
    });

    const data = await response.json();

    // Ollama returns text in 'response'
    const text = data.response;

    return JSON.parse(text);
}

module.exports = { parseQuery };