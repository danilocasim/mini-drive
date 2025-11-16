const db = require("../prisma/queries/UserQueries");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await db.getEmail(email);
      console.log(user);

      if (!user) {
        return done(null, false, { message: "Incorrect Email" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
