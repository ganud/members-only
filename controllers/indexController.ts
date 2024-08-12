const db = require("../db/queries");
import { Request, Response } from "express";

async function getIndex(req: Request, res: Response) {
  const messages = await db.getMessages();
  res.render("index", { user: req.user, messages: messages });
}

module.exports = {
  getIndex,
};
