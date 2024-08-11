const db = require("../db/queries");
import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const { body, validationResult, check } = require("express-validator");
var bcrypt = require("bcryptjs");
const passport = require("passport");

// Render the user signup form on GET
exports.user_create_get = asyncHandler(async (req: Request, res: Response) => {
  res.render("user_signup_form", { errors: false });
});

exports.user_create_post = [
  // Sanitize user data
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value: string, { req }: any) => {
      if (await db.findUser(value)) {
        throw new Error("Username already in use");
      }
    }),
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
  body("confirm_password", "Confirm password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value: string, { req }: any) => {
      return value === req.body.password;
    })
    .withMessage("Confirm field does not match password"),
  // Process request with sanitized data
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the validation errors from a request.

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("user_signup_form", {
        errors: errors.array({ onlyFirstError: true }),
      });
    } else {
      // Data from form is valid. Save user.
      bcrypt.hash(
        req.body.password,
        10,
        async (err: Error, hashedPassword: string) => {
          // if err, do something
          // otherwise, store hashedPassword in DB
          db.addUser(
            req.body.username,
            req.body.first_name,
            req.body.last_name,
            hashedPassword
          );
        }
      );
      res.redirect("/");
    }
  }),
];

// Render the user login form on GET
exports.user_login_get = asyncHandler(async (req: Request, res: Response) => {
  res.render("user_login_form");
});
