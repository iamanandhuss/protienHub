import session from 'express-session';

import crypto from 'crypto'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import passport from "passport";
import { title } from "process";
import { log } from "console";



//---------------------- importing scheemas ---------------------- 

import User from '../../model/userSchema.mjs';

export const getSignUp = (req, res) => {
    try {
        res.render('user/authSignup.ejs')
    } catch (error) {
        console.log(`error while rendering signup page ${error} `)

    }
}

//---------------------- user signup posst request ---------------------- 

function generateOtp() {
    return crypto.randomInt(10000, 100000).toString();
}
async function sendOtpEmail(email, otp, username) {
    console.log("sendOTP Email ");

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


    const mailOptions = {
        from: 'protienHub@gmail.com',
        to: email,
        subject: 'Your OTP code',
        text: `Dear ${username},
Thank you for using ProteinHub!
Your One-Time Password (OTP) for verification is: ${otp}.
Please enter this OTP in the designated field to verify your email address.
Note: This OTP is valid for one minutes. If you did not request this OTP, please ignore this email.
If you have any questions or need assistance, feel free to contact our support team.
Best regards,
The ProteinHub Team`
    }
    await transporter.sendMail(mailOptions)
}


export const signupPost = async (req, res) => {
    const { First_name, Last_name, email, Phone, password, conform_password } = req.body;
    try {
        const existingUser = await User.findOne({ email })//check user existinggg
        const username = First_name + " " + Last_name;
        const nameexist = await User.findOne({ username })
        const passwortSame = await password == conform_password;
        console.log(existingUser);

        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ successsuccess: false, message: 'User already exists' })
        }
        if (nameexist) {
            console.log("Username already exists");
            return res.status(400).json({ successsuccess: false, message: 'Username already exists' })
        }
        if (!passwortSame) {
            console.log("Password not matching");
            return res.status(400).json({ successsuccess: false, message: 'Password not matching' })
        }

        //Generate OTP and expiry time 
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);




        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds for salting


        //Create new user but set isVerified to false until OTP is verified

        const newUser = new User({
            username: First_name + " " + Last_name,
            email,
            Phone,
            password: hashedPassword, // Save hashed password
            is_varified: false  // Assuming you have this field for verification
        });
        req.session.otp = { otp, otpExpiry, email };
        console.log(otp);

        await newUser.save();
        //Send OTP to user email
        await sendOtpEmail(newUser.email, otp, newUser.username);


        return res.redirect("/otp")
    } catch (error) {
        console.error(`Error during OTP verification: ${error}`);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." })
    }
}



//get otp page
export const getOtp = async (req, res) => {
    try {
        res.render('user/authOtp.ejs')
    } catch (error) {

    }
}
//post otp page
export const postOtp = async (req, res) => {
    try {
        const { otp, otpExpiry, email } = req.session.otp;
        const userOtp = req.body.full_otp;
        console.log(req.body);
        //get the data of the user
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." })
        }
        if (!otp || otp != userOtp || otpExpiry < Date.now()) {
            return res.status(404).json({ success: false, message: "OTP not found." })
        }
        //make the user verified
        user.is_varified = true;
        await user.save();
        //delete the session
        req.session.otp = null;
        //redirect to sucessfull page
        res.redirect("/authSuccess")

    } catch (error) {
        console.error(`Error during OTP verification: ${error}`);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}
export const getSuccess = (req, res) => {
    try {
        res.render('user/authSuccess.ejs')
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }

}

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.session.otp;
        const user = await User.findOne({ email })
        const otp = generateOtp();
        console.log(otp);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        req.session.otp = { otp, otpExpiry, email };
        await sendOtpEmail(user.email, otp, user.username);
        return res.render('user/authOtp.ejs')
    } catch (error) {
        console.log(error);
    }




}


//render the login page
export const getLogin = (req, res) => {
    try {
        res.render('user/authLogin.ejs')
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}


//post login
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            if (!user.is_varified) {
                return res.status(403).json({ message: "not allowed to login" });
            } else {
                const passwordCheck = await bcrypt.compare(password, user.password);
                if (passwordCheck) {
                    req.session._id = user._id;
                    return res.status(200).json({ message: "login sucess" });
                } else {
                    return res.status(401).json({ message: "password incorrect" });
                }
            }
        } else {
            console.log("user not excist");
            return res.status(402).json({ message: "user doesn't excist" });
        }

    } catch (error) {
        return res.status(404).json({ message: "Page Not Found" });
    }
};

//log out sesssion
export const logout = (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login')
    } catch (error) {

    }
}


export const forgetPassword = async (req, res) => {
    try {
        res.render('user/forgetPassword.ejs')
    } catch (error) {
        console.log(error);
    }
}

export const resetOpt = async (req, res) => {
    try {
        res.render('user/resetOtp.ejs')
    } catch (error) {
        console.log(error);
    }
}
export const get_Otp = async (req, res) => {
    try {
        const { otp, otpExpiry, email } = req.session.otp;
        const userOtp = req.body.full_otp;
        console.log(userOtp);
        //get the data of the user
        const user = await User.findOne({ email })


        if (!otp || otp != userOtp || otpExpiry < Date.now()) {
            return res.status(404).json({ success: false, message: "OTP not found." })
        }
        res.redirect("/newPassword")

    } catch (error) {
        console.error(`Error during OTP verification: ${error}`);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}
export const password_update = async (req, res) => {
    try {
        const { email } = req.session.otp;
        const user = await User.findOne({ email })
        const { password, confirmPassword } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}

export const verifie_email = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const otp = generateOtp();
        req.session.otp = { otp, otpExpiry, email }
        await sendOtpEmail(email, otp, user.username);
        return res.redirect("/resetOpt")
    } catch (error) {

    }
}

export const newPassword = async (req, res) => {
    try {
        res.render('user/createPassword.ejs')
    } catch (error) {

    }
}

//.......................................................................sign in with google.........................................................................................
export const googleAuth = passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account',
});

export const googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            console.log(`Error on Google auth callback: ${err}`);
            req.flash('error_msg', 'Something went wrong during authentication.');
            return res.redirect('/login');
        }

        if (!user) {
            req.flash('error_msg', 'No user found with this Google account.');
            return res.redirect('/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                console.log(`Login error: ${err}`);
                req.flash('error_msg', 'Failed to log you in.');
                console.log(req.session.googleId);

                return res.redirect('/');
            }

            // Store user in session

            req.session._id = user._id;
            console.log("********** session", req.session.user);

            console.log("Successfully logged in with Google!");

            req.flash('success_msg', 'Successfully logged in with Google!');
            return res.redirect('/');
        });
    })(req, res, next);
};