require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("./generated/prisma");

const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");

const path = require("path");
const fileRouter = require("./routes/fileRouter");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
require("./configs/passport");

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/", fileRouter);

const { PORT } = process.env;
app.listen(PORT, (err) => {
  if (err) throw err;
  else console.log(`the server is running at http://localhost:${PORT}`);
});
