const userModel = require("../models/user.js");
const path = require("path");
const argon2 = require("argon2")
const {setUser} = require("../service/auth.js");
const { json } = require("body-parser");
const nodemailer = require('nodemailer');
const upload = require('../config/cloudinary'); // adjust path accordingly
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51QGxZIBD02FCKrcnpNGomskz9wA5UeYLklo7i11B47hxouMWJpbjzpgFkhyPvQGOGTQhWVs1APQoDHQFkIxtnMXZ00SlR80d4b"); // Replace with your actual Secret Key

async function handleHome(req , res) { 
    await res.render("home", { error: null, success: null });   
}
async function redirecthome(req,res) {
    res.redirect("/registeration");
}

async function handleRegister(req,res) {
    const{name,email,password,gender,username} = req.body;
    try {
    await userModel.create({
        name,email,username,password,gender
    })
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
      auth: {
        user: 'sachin.ruriya@techinfini.com', // Replace with your email
        pass: 'Sachin@#123'   // Replace with your email password or app password
      }
    });
    
    // Email options
    const mailOptions = {
      from: 'sachin.ruriya@techinfini.com',
      to: email,
      subject: 'Test Email from Node.js',
      text: 'Hello! This is a test email sent from a Node.js script.' // You can also use 'html' field for HTML email
    };
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
    // res.status(201).send('User registered successfully');
    res.status(201).render('home', { success: `Congratulations! ${name}, Your Account has been created.`, error: null });
}catch (error) {
  let errorMessage = 'An error occurred. Please try again.';
        // Check for a duplicate key error (11000 is the error code for duplicate key)
        if (error.code === 11000) {
          errorMessage = 'Email already exists';

          return res.status(400).render('home', { error: errorMessage, success: null });
        }
        // Handle other validation errors
        res.status(400).send(error.message);
      }
}

async function handleUserLogin(req, res) {
  req.session.user = req.user;
  const token = setUser(req.user);
  req.session.isLoggedIn = true;
  res.cookie('uid', token);
  res.redirect('/dashboard');
}

async function displayUser(req, res) {
  // Fetch logged-in user from the session (req.user is set by Passport)
  if (req.session.isLoggedIn) { 
      const uData = await userModel.findById(req.user._id); // Find the logged-in user by ID
      if (uData) {
          return res.render('dashboard', { user: uData });
      }
  }
  // If no user is logged in, redirect to login page
  res.redirect('/login');
}
async function findFriends(req, res) {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId).populate('friends.friendId', 'name _id').exec();

    if (!user) {
      return res.status(404).send('User not found');
    }
    // console.log("user",user.friends)
    // return res.render('friends', { friends: user.friends, userId: userId });
    return res.render('friends', { 
      friends: user.friends.map(f => ({ friendId: f.friendId._id, name: f.friendId.name })), // Ensure a clean structure
      userId: userId 
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}

const uploadfilefunc = async (req, res) => {
  const id = req.params.id; // Get user ID from request parameters

  try {
    // Handle the file upload with multer
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload file' });
      }

      // If the file upload is successful
      if (req.file) {
        const profileImagePath = req.file.path; // The path of the uploaded file in Cloudinary

        // Update the user model with the uploaded file path
        const user = await userModel.findById(id); // Find the user by ID
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        user.profile = profileImagePath; // Update the profile field
        console.log("uuuuuuu",user)
        await user.save(); // Save the updated user model
        return res.redirect(`/dashboard?uploadSuccess=true`);
        // Respond with success
        // return res.status(200).render('dashboard',{ message: 'File uploaded and profile updated successfully', user: user });
      } else {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};

async function findsearchkey(req,res) {
 

  const { name } = req.query;

  try {
      const users = await userModel.find({
          name: { $regex: name, $options: 'i' } // Case-insensitive search
      }, 'name _id friends'); // Fetch only the name and ID

      res.json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}
async function addfriend (req,res) {
  const { userId, friendId, friendName } = req.body;

  try {
      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if the friend is already in the list
      const isFriend = user.friends.some(friend => friend.friendId.toString() === friendId);
      if (isFriend) return res.status(400).json({ message: 'Friend already added' });

      user.friends.push({ friendId, friendName });
      await user.save();

      res.status(200).json({ message: 'Friend added successfully', friends: user.friends });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function paymentCreate(req,res) {

  const { amount,currency} = req.body ;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,  // Stripe expects amount in cents
      currency: currency || "usd",
    });
   console.log("paymentIntent",paymentIntent)
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function paytheamount(req,res) {
  console.log("paymentpage")
  console.log("paymentpage2")
  res.render("paymentpage")
}
module.exports = {handleHome,handleRegister,redirecthome,displayUser,handleUserLogin,uploadfilefunc,findFriends,findsearchkey,addfriend,paymentCreate,paytheamount}

