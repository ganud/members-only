const pool = require("./pool");

async function addUser(
  first_name: string,
  last_name: string,
  username: string,
  password: string
) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)",
    [first_name, last_name, username, password]
  );
  return;
}

async function findUser(username: string) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = rows[0];
  return user;
}

async function addMessage(title: string, message: string, author: number) {
  await pool.query(
    "INSERT INTO messages (title, message, author) VALUES ($1, $2, $3)",
    [title, message, author]
  );
  return;
}

async function getMessages() {
  const messages = await pool.query(
    "SELECT messages.id, title, message, username FROM messages JOIN users ON users.id = author ORDER BY date DESC"
  );
  return messages.rows;
}

async function deleteMessage(id: number) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
  return;
}

module.exports = {
  addUser,
  findUser,
  addMessage,
  getMessages,
  deleteMessage,
};
