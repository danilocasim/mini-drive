const db = require("../prisma/queries/UserQueries");
const signupValidators = require("../middleware/validators/signupValidators");
const { validationResult, matchedData } = require("express-validator");

module.exports.addUser = [
  signupValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("../views/pages/signup", {
        errors: errors.array(),
      });
    }
    const data = matchedData(req);
    await db.addUser(data);
    res.redirect("/");
  },
];

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) next(err);
    res.redirect("/");
  });
};
