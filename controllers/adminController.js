// const  express  = require("express")
const { json } = require("body-parser");
const userModel = require("../models/user.js");
const {setUser} = require("../service/auth.js");
async function adminLoginPage(req,res) {
    res.render("admin/adminLogin") 
}
async function handleadminLogin(req,res) {
    req.session.user = req.user;
    const token = setUser(req.user);
    req.session.isLoggedIn = true;
    res.cookie('uid', token);
    res.redirect('dashboard');
}
async function displayAdminPrf(req,res) {
    if (req.session.isLoggedIn) { 
           const users = await userModel.find();
            return res.render('admin/dashboard',{users:users});
        
    }
    // If no user is logged in, redirect to login page
    res.redirect('login-page');
}
async function editController(req, res) {
    try {
        const user = await userModel.findById(req.params.id); // Fetch user by ID
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user); // Send user data as JSON
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function editProfiledata(req, res) {
    const { name, email, username } = req.body;
    const { id } = req.params;

    // Validate input
    if (!name || !email || !username) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user fields
        user.email = email;
        user.username = username;
        user.name = name;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function deleteUser(req,res) {
    const{id}= req.params ;
    try{
    const user = await userModel.findByIdAndDelete(id);
    if(!user){
    res.status(404).json({error:"User not found"});
    }
    res.status(200).json({ message: 'User deleted successfully' });
}catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}



module.exports = {adminLoginPage,handleadminLogin,displayAdminPrf,editController,editProfiledata,deleteUser}