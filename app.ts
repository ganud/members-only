var bcrypt = require("bcryptjs");
const express = require("express");
import { Request, Response, NextFunction } from "express";
const db = require("./db/queries");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");

require("dotenv").config();

// Create the Express application
var app = express();

passport.use(
  new LocalStrategy(async (username, password, done) => {
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
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
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
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

app.use(passport.session());

app.use(passport.session());

app.use("/", indexRouter);
app.use("/", userRouter);

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
});

app.listen(3000, () => console.log("app listening on port 3000!"));
