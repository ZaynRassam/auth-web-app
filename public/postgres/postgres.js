import { Client } from 'pg'

var conString = process.env.CONSTRING

var client = new Client(conString);
await client.connect();

async function queryAllUsers() {
    try {
        const res = await client.query("SELECT * FROM users");
        return res.rows;
    } catch (err) {
        console.log(err.message);
        return err.message
    }
}

async function insertUser(username, passwordHash, role) {
    try {
        const query = 'INSERT INTO users (username, hashed_password, role) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, passwordHash, role];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error inserting user:', err.message);
        return err.message;
    }
}

async function updateUserPassword(username, newPassword) {
    try {
        const query = 'UPDATE users SET hashed_password = $1 WHERE username = $2 RETURNING *';
        const values = [newPassword, username];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating user:', err.message);
        return err.message;
    }
}

async function deleteUser(username) {
    try {
        const query = 'DELETE FROM users WHERE username = $1 RETURNING *';
        const values = [username];
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating user:', err.message);
        return err.message;
    }
}


export {queryAllUsers, insertUser, updateUserPassword, deleteUser}