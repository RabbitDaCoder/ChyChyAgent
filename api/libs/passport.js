import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Try to find user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        // If not found, try to find by email and link Google ID
        if (!user && profile.emails && profile.emails.length > 0) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        // If still not found, create new user
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            image:
              profile.photos && profile.photos[0] && profile.photos[0].value
                ? profile.photos[0].value
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.displayName
                  )}&background=random&color=ffffff&bold=true&size=128`,
            password: Math.random().toString(36), // random password, not used
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
