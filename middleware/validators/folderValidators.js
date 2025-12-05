const { body } = require("express-validator");
const db = require("../../prisma/queries/FileQueries");

const folderValidators = [
  body("foldername").custom(async (value) => {
    const folder = await db.getFolderByName(value);
    if (folder) throw new Error("This folder already exists!");
    else return true;
  }),
];

module.exports = folderValidators;
