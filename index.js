const express = require("express");
const mongoose = require("mongoose");
const passport = require('./config/passport');
const session = require('express-session');
const authRoutes  = require('./service/auth');
const cookieParser = require('cookie-parser');

const path = require('path');
const bodyParser = require("body-parser")
const ejs = require("ejs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
const MongoStore = require('connect-mongo');
mongoose.connect('mongodb+srv://sachinruriya:OmfJA4kuXnzrf5xL@crudapp.j55ln.mongodb.net/crudAPP?retryWrites=true&w=majority&appName=crudapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
  const route = require("./routes/user");
  app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://sachinruriya:OmfJA4kuXnzrf5xL@crudapp.j55ln.mongodb.net/crudAPP?retryWrites=true&w=majority&appName=crudapp',
      ttl: 60 * 5 // Session expiration time in seconds (5 minutes)
  }),
  cookie: {
      maxAge: 1000 * 60 * 30, // 5 minutes in milliseconds (300,000 milliseconds)
      secure: false, // Set true if you're using HTTPS
      httpOnly: true // Prevent client-side access to the cookie
  }
  }));
 

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session(
   
  ));
  app.use((req, res, next) => {
    res.locals.user = req.session.user;  // Set user from session to res.locals
    next();
  });
app.use("/",route);
  
  // Start server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });