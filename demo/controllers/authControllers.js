import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user/userSchema.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// **Session Setup**
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true, 
    cookie: { secure: false },
  })
);

// **Password Hashing**
const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};

// **Nodemailer Transporter Setup**
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anandhustech1998@gmail.com',
    pass: 'iodw brnb iydy lzlc',
  },
});

// **Generate OTP**
const generateOTP = () => Math.floor(10000 + Math.random() * 90000).toString();

let Email;
let otp;
let otpExpirationTime;

// **Routes and Controllers**

export const loginPage = async (req, res) => {
  try {
    res.render('user/authLogin.ejs');
  } catch (error) {
    console.log(error.message);
  }
};

export const verifyLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await User.findOne({ name: username });
    if (userData) {
      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      if (userData.is_blocked) {
        res.render('user/authLogin.ejs');
      } else if (isPasswordMatch) {
        req.session.user_id = userData._id;
        req.session.fullName = userData.name;
        req.session.isBlocked = userData.is_blocked;
        res.redirect('/');
      } else {
        res.render('user/authLogin.ejs');
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const signupPage = (req, res) => {
  res.render('user/authSignup.ejs', { error: ' ' });
};

// **Sign Up with OTP Verification Process**
export const postSignup = async (req, res) => {
  
};

// **OTP Page**
export const otpPage = async (req, res) => {
  try {
    res.render('user/authOtp.ejs');
  } catch (error) {
    console.log(error);
  }
};

// **Successful Authentication Page**
export const authSuccess = async (req, res) => {
  try {
    res.render('user/authSuccess.ejs');
  } catch (error) {
    console.log(error);
  }
};

// **Logout Functionality**
export const logOut = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/login');
    });
  } catch (error) {
    console.log(error);
  }
};

