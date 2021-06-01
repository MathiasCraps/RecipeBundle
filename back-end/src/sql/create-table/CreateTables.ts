import { Pool } from "pg";
import { executeQuery } from "../../sql-utils/Database";

export async function createTables(pool: Pool) {
    const initialSetUp = (await executeQuery(pool, `SELECT to_regclass('recipes')`)).rows[0].to_regclass === null;

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS Users (
        id serial PRIMARY KEY,
        name varchar(500) NOT NULL,
        email varchar(500) NOT NULL,
        created_at timestamp DEFAULT current_timestamp
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS Recipes (
        id serial PRIMARY KEY,
        recipe_name varchar(500) NOT NULL,
        steps varchar(10000) NOT NULL,
        image varchar(500) NOT NULL,
        created_at timestamp DEFAULT current_timestamp
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS IngredientQuantityDescription (
        id serial PRIMARY KEY,
        category_name varchar(100) NOT NULL
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS IngredientQuantityDescriptionTranslation (
        quantity_descriptor_id INT NOT NULL,
        language_code varchar(2) NOT NULL,
        localised_name varchar(100) NOT NULL,
        FOREIGN KEY (quantity_descriptor_id) REFERENCES IngredientQuantityDescription (id)
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS IngredientCategory (
        id serial PRIMARY KEY,
        category_name varchar(100) NOT NULL
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS IngredientCategoryTranslation (
        category_id INT NOT NULL,
        language_code varchar(2) NOT NULL,
        localised_name varchar(100) NOT NULL,
        FOREIGN KEY (category_id) REFERENCES IngredientCategory (id)
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS Ingredients (
        id serial PRIMARY KEY,
        ingredient_name varchar(500) NOT NULL,
        ingredient_category_id INT,
        FOREIGN KEY (ingredient_category_id) REFERENCES IngredientCategory (id)
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS RecipesIngredientsMatch (
        recipe_id INT NOT NULL,
        ingredient_id INT NOT NULL,
        quantity_number NUMERIC(10, 2) NOT NULL,
        quantity_name varchar(500) NOT NULL,
        PRIMARY KEY (recipe_id, ingredient_id),
        FOREIGN KEY (recipe_id) REFERENCES Recipes (id),
        FOREIGN KEY (ingredient_id) REFERENCES Ingredients (id)
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS MenuPlanning (
        menu_id serial,
        user_id INT NOT NULL,
        recipe_id INT NOT NULL,
        planned_time NUMERIC NOT NULL,
        ingredients_purchased BOOLEAN NOT NULL DEFAULT false,
        FOREIGN KEY (user_id) REFERENCES Users (id),
        FOREIGN KEY (recipe_id) REFERENCES Recipes (id)
    )`);

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS Inventory (
        ingredient_id INT NOT NULL,
        user_id INT NOT NULL,
        quantity INT NOT NULL,
        desired_quantity INT NOT NULL,
        FOREIGN KEY (ingredient_id) REFERENCES Ingredients (id),
        FOREIGN KEY (user_id) REFERENCES Users (id)
    )`);

    return initialSetUp;
}