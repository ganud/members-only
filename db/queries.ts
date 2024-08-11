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
}

async function findUser(username: string) {
  await pool.query("SELECT * FROM users;");
}

module.exports = {
  addUser,
  findUser,
};

async function main() {
  findUser("walter");
}
