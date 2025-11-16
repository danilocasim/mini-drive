const { Router } = require("express");
const { addUser } = require("../controller/userController");
const passport = require("passport");

const userRouter = Router();

userRouter.post("/signup", addUser);

userRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

module.exports = userRouter;
