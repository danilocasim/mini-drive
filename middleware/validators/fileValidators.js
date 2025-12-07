const { body } = require("express-validator");
const db = require("../../prisma/queries/FileQueries");

const fileValidators = [
  body("filename").custom(async (value, { req }) => {
    const { fileid } = req.params;

    const file = await db.getFileById(fileid);
    const folder = await db.getFileByName(value, file.folderId);
    if (folder) throw new Error("This file already exists!");
    else return true;
  }),
];

module.exports = fileValidators;
