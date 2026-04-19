require("dotenv").config();

const express = require("express");
const cors = require("cors");

const aiService = require("./ai/aiService");
const recipeService = require("./services/recipeService");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MAIN AI AGENT ROUTE
app.post("/recipe-agent", async (req, res) => {
    try {
        const { query } = req.body;

        // 🔹 Step 1: AI → filters
        const filters = await aiService.parseQuery(query);
        console.log("FINAL FILTERS:", filters);

        // 🔹 Step 2: DB → recipes
        let recipes = await recipeService.getRecipes(filters);

        // 🔥 Step 3: Smart ranking
        if (filters.goal === "protein") {
            recipes = recipes.sort((a, b) => b.protein - a.protein);
        }

        // 🔹 Step 4: Limit results
        recipes = recipes.slice(0, 3);

        // 🔹 Step 5: Fallback message
        if (!recipes.length) {
            return res.json({
                message: "No recipes found. Try different query.",
                filters
            });
        }

        res.json({
            query,
            filters,
            recipes
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ TEST ROUTES
app.get("/test-ai", async (req, res) => {
    const result = await aiService.parseQuery(
        "high protein veg dinner under 500 calories"
    );
    res.json(result);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});