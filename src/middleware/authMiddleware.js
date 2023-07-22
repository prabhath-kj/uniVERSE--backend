import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SEC_KEY,
};

const userStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user &&!user.blocked) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
});

const adminStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user && user.isAdmin && payload.admin === true) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
});

passport.use("user", userStrategy);
passport.use("admin", adminStrategy);

const authMiddleware = passport.authenticate("user", { session: false });
const adminAuthMiddleware = passport.authenticate("admin", { session: false });

export { authMiddleware, adminAuthMiddleware };
