exports.executeQuery = async function(client, query) {
    try {
        await client.query('BEGIN');
        await client.query(query);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
}