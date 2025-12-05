const { body } = require("express-validator");
const db = require("../../prisma/queries/FileQueries");

const uploadValidators = [
  body("avatar")
    .isEmpty()
    .custom(async (value, { req }) => {
      if (req.file.size > 1000000) {
        throw new Error("File is too large");
      } else true;
    })
    .custom(async (value, { req }) => {
      if (req.file.originalname.length >= 20) {
        throw new Error("Name is too large");
      } else true;
    }),
];

module.exports = uploadValidators;
