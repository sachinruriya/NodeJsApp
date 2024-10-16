// const  express  = require("express")
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
module.exports = {adminLoginPage,handleadminLogin,displayAdminPrf}