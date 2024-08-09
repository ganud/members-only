const db = require("../db/queries");

async function getIndex(req, res) {
  res.render("index");
}

module.exports = {
  getIndex,
};
