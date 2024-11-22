import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from './models/user/userSchema.js'; // Add .js extension for ES6

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your Google Client Secret
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Find the user by googleId
            let user = await User.findOne({ googleId: profile.id });

            // If user doesn't exist, create a new one
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName, // You have 'name' in your schema, use profile display name
                    email: profile._json.email,
                    is_varified: 1, // Set as verified when created through Google
                    createdAt: Date.now() // Set the createdAt date
                });
            }

            // If user exists or is newly created, return the user object
            return done(null, user);
        } catch (err) {
            return done(err); // Handle errors
        }
    }));

// Serialize and deserialize user to manage sessions
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});