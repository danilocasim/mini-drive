const { Router } = require("express");
const index = require("../controller/indexController");

const indexRouter = Router();

indexRouter.get("/", index.renderHome);
indexRouter.get("/signup", index.renderSignup);
indexRouter.get("/login", index.renderLogin);

module.exports = indexRouter;
