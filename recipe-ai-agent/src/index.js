const express = require("express");
const cors = require("cors");
require("dotenv").config();

const aiService = require("./ai/aiService");
const recipeService = require("./services/recipeService");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recipe-agent", async (req, res) => {
    try {
        const { query } = req.body;

        // 🔹 Step 1: AI extracts filters
        const filters = await aiService.parseQuery(query);

        console.log("AI Filters:", filters);

        // 🔹 Step 2: Fetch recipes from DB
        let recipes = await recipeService.getRecipes(filters);

        // 🔥 Step 3: Smart filtering (protein goal)
        if (filters.goal === "protein") {
            recipes = recipes.sort((a, b) => b.protein - a.protein);
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

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
app.get("/test-ai", async (req, res) => {
    try {
        const result = await aiService.parseQuery(
            "high protein veg dinner under 500 calories"
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});