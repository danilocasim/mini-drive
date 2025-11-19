const db = require("../prisma/queries/FileQueries");

module.exports.renderHome = async (req, res) => {
  if (req.user) {
    const { id } = req.user;
    const folders = await db.viewAllFolders(id);

    res.render("pages/index.ejs", { folders: folders });
  } else res.render("pages/index.ejs");
};

module.exports.renderSignup = async (req, res) => {
  res.render("pages/signup.ejs");
};

module.exports.renderLogin = async (req, res) => {
  res.render("pages/login.ejs");
};
