const IngredientCategoryMap = {
    "oils": "Olie",
    "vegetables": "Groente",
    "tins": "Geblikt voedsel",
    "legumes": "Peulvruchten",
    "spices": "Kruid",
    "grains": "Graan",
    "spreads": "Beleg",
    "sauces": "Saus",
    "nuts": "Noot",
    "misc": "Divers",
    "drinks": "Drinken",
    "fruits": "Fruit"
}

export function translateCategory(text: keyof typeof IngredientCategoryMap): string {
    return IngredientCategoryMap[text] || text;
}