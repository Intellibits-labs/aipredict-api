const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const User = require("../app/users/users.model");
const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
const googleConfig = {
  clientID:
    "468687185923-5melpr67h7a2vrnfsbjhac2mqcgv6odf.apps.googleusercontent.com", // Your client id
  clientSecret: "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" // Your client secret
};
const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
// const googleStrategy = new GoogleStrategy(
//   googleConfig,
//   async (tokens, profile, done) => {
//     console.log("ss");
//     try {
//       console.log("🚀 ~ file: passport.js:34 ~ profile", profile);
//       const user = await User.findOne({ "google.id": profile.id });
//       if (!user) {
//         const newUser = await User.create({
//           email: profile.emails[0].value,
//           name: profile.displayName
//         });
//         return done(null, newUser);
//       }
//       return done(null, user);
//     } catch (e) {
//       console.log(e);
//       return done(e, false);
//     }
//   }
// );
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy
  // googleStrategy
};
