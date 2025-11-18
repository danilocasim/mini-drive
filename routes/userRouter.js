const { Router } = require("express");
const { addUser, logout } = require("../controller/userController");
const passport = require("passport");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
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

userRouter.post("/profile", upload.single("avatar"), (req, res, next) => {
  console.log(req.file);

  res.redirect("/");
});

module.exports = userRouter;
