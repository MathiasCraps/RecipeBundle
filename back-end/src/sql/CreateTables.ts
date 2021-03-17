import { Pool } from "pg";
import { executeQuery } from "../sql-utils/Database";

export async function createTables(pool: Pool) {
    const hasAlreadyBeenSetUp = (await executeQuery(pool, `SELECT to_regclass('recipes')`)).rows[0].to_regclass !== null;
    if (hasAlreadyBeenSetUp) {
        return false;
    }

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

    await executeQuery(pool, `CREATE TABLE IF NOT EXISTS Ingredients (
        id serial PRIMARY KEY,
        ingredient_name varchar(500) NOT NULL
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

    return true;
}