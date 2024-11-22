  dotenv.config();
  //---------------------- module require ---------------------------------
  import express from "express";
  import connectDB from './config/db.mjs';
  import dotenv from "dotenv";
  import path from "path";
  import mongoose from "mongoose";
  import userRouter from "./routes/userRoutes.mjs";
  import adminRouter from './routes/adminRoutes.mjs'
  import session from "express-session";
  import nocache from "nocache";
  import flash from "connect-flash";
  import passport from "passport";
  //---------------------- module require ---------------------------------
  const app = express();

  // Database connection
  connectDB();
  // Database connection

  //----------------------setting view engine--------------------------
  app.set("view engine", "ejs");




  //---------------------- public static files------------------------------

  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use('/uploads', express.static('uploads'));
  //PORT

  const PORT = process.env.PORT || 3000;

  //PORT

  //---------------------- url encoded data ----------------------

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  //---------------------------- middlewares -------------------------------

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  //---------------------------- flash setup-------------------------------

  app.use(flash());

  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
  });

  //---------------------------- passport setup-------------------------------

  app.use(passport.initialize());
  app.use(passport.session());


  //routes

  app.use(nocache());

  app.use("/admin", adminRouter);
  app.use("/", userRouter);



  //server listening

  app.listen(PORT, (err) => {
    if (err) {
      console.log("Error while listing port");
    } else {
      console.log(`server listening to http://localhost:${PORT}`);
    }
  });

  //server listening
