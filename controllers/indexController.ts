const db = require("../db/queries");
import { Request, Response } from "express";

async function getIndex(req: Request, res: Response) {
  res.render("index");
}

module.exports = {
  getIndex,
};
