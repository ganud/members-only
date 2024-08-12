import { DoneCallback } from "passport";

var LocalStrategy = require("passport-local");
const db = require("./db/queries");
var bcrypt = require("bcryptjs");

const strategy = new LocalStrategy(
  async (username: string, password: string, done: DoneCallback) => {
    try {
      const user = await db.findUser(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      // Compare password hash
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

module.exports = {
  strategy,
};
