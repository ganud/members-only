const express = require("express");
import { DoneCallback } from "passport";
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const messageRouter = require("./routes/messageRouter");
const userRouter = require("./routes/userRouter");
const { strategy } = require("./localstrategy");
require("dotenv").config();

// Create the Express application
var app = express();

passport.use(strategy);

passport.serializeUser((user: any, done: DoneCallback) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: DoneCallback) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup
app.use(
  session({
    store: new pgSession({
      pool: pool, // Connection pool
      tableName: "user_sessions",
    }),
    secret: process.env.FOO_COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    saveUninitialized: true,
  })
);

app.use(passport.session());
app.use("/", messageRouter);
app.use("/", userRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}
