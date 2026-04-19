const fetch = require("node-fetch");

// ✅ Validation Layer
function validateAndNormalize(data, query) {
    return {
        diet_type:
            data.diet_type === "non-veg" ? "non-veg" : "veg",

        max_calories:
            typeof data.max_calories === "number"
                ? data.max_calories
                : 500,

        goal:
            ["protein", "weight_loss"].includes(data.goal)
                ? data.goal
                : "general"
    };
}

// ✅ MAIN AI FUNCTION
async function parseQuery(query) {
    const prompt = `
You are a JSON generator.

Extract data from this query:
"${query}"

Return ONLY JSON in this EXACT format:

{
  "diet_type": "veg or non-veg",
  "max_calories": number,
  "goal": "protein or weight_loss or general"
}

Rules:
- Do NOT change keys
- Do NOT add new fields
- Do NOT explain anything
- Output ONLY valid JSON
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

    console.log("RAW AI RESPONSE:", text);

    // 🔥 Extract JSON safely
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    let cleanJson = "";

    if (start !== -1 && end !== -1) {
        cleanJson = text.substring(start, end + 1);
    } else {
        throw new Error("No JSON found in AI response");
    }

    // 🔥 Parse + Validate + Fallback
    try {
        const parsed = JSON.parse(cleanJson);
        return validateAndNormalize(parsed, query);
    } catch (err) {
        console.error("AI failed, fallback used");

        return {
            diet_type: query.includes("nonveg") ? "non-veg" : "veg",
            max_calories: 500,
            goal: query.includes("protein") ? "protein" : "general"
        };
    }
}

module.exports = { parseQuery };