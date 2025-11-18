const { Router } = require("express");
const { addUser, logout } = require("../controller/userController");
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

userRouter.get("/logout", logout);

module.exports = userRouter;
