const express = require("express");
const cors = require("cors");
require("dotenv").config();

const aiService = require("./ai/aiService");
const recipeService = require("./services/recipeService");

const app = express();
app.use(cors());
app.use(express.json());

// app.post("/recipe-agent", async (req, res) => {
//     try {
//         const { query } = req.body;

//         // Step 1: AI extracts intent
//         const filters = await aiService.parseQuery(query);

//         // Step 2: Fetch recipes
//         const recipes = await recipeService.getRecipes(filters);

//         res.json({ filters, recipes });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

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