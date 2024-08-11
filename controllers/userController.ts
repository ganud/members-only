const db = require("../db/queries");
import { Request, Response } from "express";

// Render the user signup form on GET
async function user_create_get(req: Request, res: Response) {
  res.render("user_signup_form");
}

// Render the user login form on GET
async function user_login_get(req: Request, res: Response) {
  res.render("user_login_form");
}

module.exports = {
  user_create_get,
  user_login_get,
};
