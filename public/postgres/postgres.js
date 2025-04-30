import { Client } from 'pg'

var conString = process.env.CONSTRING

var client = new Client(conString);
await client.connect();
console.log("connected to client")

async function queryAllUsers() {
    try {
        const res = await client.query(`SELECT * FROM ${process.env.USER_TABLE_NAME};`);
        return res.rows;
    } catch (err) {
        console.log(err.message);
        return err.message
    }
}

async function insertUser(username, passwordHash, role) {
    try {
        const query = `INSERT INTO ${process.env.USER_TABLE_NAME} (username, hashed_password, role) VALUES ($1, $2, $3) RETURNING *;`;
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
        const query = `UPDATE ${process.env.USER_TABLE_NAME} SET hashed_password = $1 WHERE username = $2 RETURNING *;`;
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
        const query = `DELETE FROM ${process.env.USER_TABLE_NAME} WHERE username = $1 RETURNING *;`;
        const values = [username];
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating user:', err.message);
        return err.message;
    }
}

async function changeUserRole(newRole, username){
    try {
        const query = `UPDATE ${process.env.USER_TABLE_NAME} SET role = $1 WHERE username = $2 RETURNING *;`;
        const values = [newRole, username];

        const res = await client.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error updating role:', err.message);
        return err.message;
    }
}

export {queryAllUsers, insertUser, updateUserPassword, deleteUser, changeUserRole}