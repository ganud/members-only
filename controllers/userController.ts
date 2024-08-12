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

exports.user_login = asyncHandler(async (req: Request, res: Response) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })(req, res);
});

exports.user_logout = asyncHandler(async (req: Request, res: Response) => {
  req.logout((err: Error) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});

// Render the user signup form on GET
exports.message_create_get = asyncHandler(
  async (req: Request, res: Response) => {
    res.render("message_form", { user: req.user, errors: false });
  }
);

// Render the user signup form on GET
exports.message_create_post = [
  // Sanitize user data
  body("message_title", "Message title must be between 1-50 characters.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("message", "Message must be between 1-300 characters.")
    .trim()
    .isLength({ min: 1, max: 300 })
    .escape(),
  // Process request with sanitized data
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("message_form", {
        errors: errors.array({ onlyFirstError: true }),
        user: req.user,
      });
    } else {
      // Data from form is valid. Save message.
      await db.addMessage(
        req.body.message_title,
        req.body.message,
        req.user?.id
      );
      res.redirect("/");
    }
  }),
];

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}
