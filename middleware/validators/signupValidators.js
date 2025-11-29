const { body } = require("express-validator");
const db = require("../../prisma/queries/UserQueries");

const signupValidators = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username 3 char above")
    .custom(async (value) => {
      const user = await db.getUsername(value);
      if (user) throw new Error("Username already exists!");
      else return true;
    }),
  body("email")
    .isEmail()
    .withMessage("Input a valid email")
    .custom(async (value) => {
      const user = await db.getEmail(value);
      if (user) throw new Error("Email already exists!");
      else return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password must consists of 8 char"),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Please input same password"),
];

module.exports = signupValidators;
