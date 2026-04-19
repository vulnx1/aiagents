const supabase = require("../config/supabaseClient");

async function getRecipes(filters) {
    let query = supabase.from("recipes").select("*");

    if (filters.diet_type) {
        query = query.eq("diet_type", filters.diet_type);
    }

    if (filters.max_calories) {
        query = query.lte("calories", filters.max_calories);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
}

module.exports = { getRecipes };