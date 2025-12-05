const { body } = require("express-validator");
const db = require("../../prisma/queries/FileQueries");

const fileValidators = [
  body("filename").custom(async (value) => {
    const folder = await db.getFileByName(value);
    if (folder) throw new Error("This file already exists!");
    else return true;
  }),
];

module.exports = fileValidators;
