const db = require("../db/queries");
import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const { body, validationResult, check } = require("express-validator");
// Render the user signup form on GET
exports.user_create_get = asyncHandler(async (req: Request, res: Response) => {
  res.render("user_signup_form", { errors: false });
});

exports.user_create_post = [
  // Sanitize user data
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm_password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check("password").custom((value: string, { req }: any) => {
    if (value !== req.body.confirm_password) {
      throw new Error("Password confirmation is incorrect");
    }
    return;
  }),
  // Process request with sanitized data
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the validation errors from a request.

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("user_signup_form", {
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save category.
      db.addUser(
        req.body.username,
        req.body.first_name,
        req.body.last_name,
        req.body.password
      );
      res.redirect("/");
    }
  }),
];

// Render the user login form on GET
exports.user_login_get = asyncHandler(async (req: Request, res: Response) => {
  res.render("user_login_form");
});
