const db = require("../db/queries");
import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const { body, validationResult, check } = require("express-validator");

// Message create GET route
exports.getIndex = asyncHandler(async (req: Request, res: Response) => {
  const messages = await db.getMessages();
  res.render("index", { user: req.user, messages: messages });
});

// Message create GET route
exports.message_create_get = asyncHandler(
  async (req: Request, res: Response) => {
    res.render("message_form", { user: req.user, errors: false });
  }
);

// Message create POST route
exports.message_create_post = [
  // Sanitize user data
  body("message_title", "Message title must be between 1-50 characters.")
    .trim()
    .isLength({ min: 1, max: 50 }),
  body("message", "Message must be between 1-300 characters.")
    .trim()
    .isLength({ min: 1, max: 300 }),
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

// Render the delete message form on GET
exports.message_delete_get = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if a user is admin beforehand
    let admin = false;
    if (req.user) {
      admin = req.user.admin;
    }
    res.render("message_delete_form", {
      user: req.user,
      admin: admin,
      message_id: req.params.id,
    });
  }
);

exports.message_delete_post = asyncHandler(
  async (req: Request, res: Response) => {
    await db.deleteMessage(req.params.id);
    res.redirect("/");
  }
);
