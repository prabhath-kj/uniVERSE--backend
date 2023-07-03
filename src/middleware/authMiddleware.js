import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import User from "../models/user.js";
import * as dotenv from "dotenv";
dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SEC_KEY,
};

const strategy = new Strategy(options, async (payload, done) => {
  const user = await User.findById(payload.id);

  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});

passport.use(strategy);

const authMiddleware = passport.authenticate("jwt", { session: false });

export default authMiddleware;
