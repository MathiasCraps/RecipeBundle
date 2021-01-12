# Setting up the back-end

## Prerequisites

You will need a recent version of NodeJS installed on your device.

Set-up requirements:
* install PostgreSQL on your device and set up a database. Ensure the log-in attributes are included as environment variables.
* set up an .ENV file with the following constants filled in: `PGUSER`, `PGHOST`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`, `SESSION_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_AUTH_SECRET`, `DOMAIN`

## Starting the server

Run `npm run` to start the server.