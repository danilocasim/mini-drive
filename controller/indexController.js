module.exports.renderHome = async (req, res) => {
  res.render("pages/index.ejs");
};

module.exports.renderSignup = async (req, res) => {
  res.render("pages/signup.ejs");
};

module.exports.renderLogin = async (req, res) => {
  res.render("pages/login.ejs");
};
