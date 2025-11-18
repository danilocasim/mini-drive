const db = require("../prisma/queries/UserQueries");

module.exports.addUser = async (req, res) => {
  const data = req.body;
  await db.addUser(data);
  res.redirect("/");
};

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) next(err);
    res.redirect("/");
  });
};
