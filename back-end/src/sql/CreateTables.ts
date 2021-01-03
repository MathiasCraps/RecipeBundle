import { PoolClient } from "pg";
import { executeQuery } from "../sql-utils/Database";

export async function createTables(client: PoolClient) {
    const hasAlreadyBeenSetUp = (await executeQuery(client, `SELECT to_regclass('recipes')`)).rows[0].to_regclass !== null;
    if (hasAlreadyBeenSetUp) {
        return false;
    }

    await executeQuery(client, `CREATE TABLE IF NOT EXISTS Users (
        id serial PRIMARY KEY,
        name varchar(500) NOT NULL,
        email varchar(500) NOT NULL
    )`);

    await executeQuery(client, `CREATE TABLE IF NOT EXISTS Recipes (
        id serial PRIMARY KEY,
        recipe_name varchar(500) NOT NULL,
        steps varchar(10000) NOT NULL,
        image varchar(500) NOT NULL
    )`);

    await executeQuery(client, `CREATE TABLE IF NOT EXISTS Ingredients (
        id serial PRIMARY KEY,
        ingredient_name varchar(500) NOT NULL
    )`);

    await executeQuery(client, `CREATE TABLE IF NOT EXISTS RecipesIngredientsMatch (
        recipe_id INT NOT NULL,
        ingredient_id INT NOT NULL,
        quantity varchar(500) NOT NULL,
        PRIMARY KEY (recipe_id, ingredient_id),
        FOREIGN KEY (recipe_id) REFERENCES Recipes (id),
        FOREIGN KEY (ingredient_id) REFERENCES Ingredients (id)
    )`);

    return true;
}