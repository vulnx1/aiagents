async function parseQuery(query) {
    const prompt = `
Extract structured JSON from this query:
"${query}"

Return ONLY valid JSON.
No explanation.
No extra text.
Output must strictly start with { and end with }.
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
    let text = data.response;

    console.log("RAW AI RESPONSE:", text); // 👈 VERY IMPORTANT

    // 🔥 STRONG JSON CLEANING
    try {
        // Try direct parse first
        return JSON.parse(text);
    } catch (e) {
        // Extract JSON manually
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start !== -1 && end !== -1) {
            const cleanJson = text.substring(start, end + 1);
            return JSON.parse(cleanJson);
        } else {
            throw new Error("No valid JSON found in AI response");
        }
    }
}

module.exports = { parseQuery };