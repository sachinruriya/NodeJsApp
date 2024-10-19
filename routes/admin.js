const express = require("express");
const router = express.Router();
const passport = require('passport');

const {adminLoginPage,handleadminLogin,displayAdminPrf,editController, editProfiledata} = require("../controllers/adminController");
const {adminAuthorization}= require("../middlewares/authorization.js")

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}
router.get("/login-page",adminLoginPage);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    failureMessage: true
}), handleadminLogin);
router.get("/dashboard",isAuthenticated,adminAuthorization(['admin']), displayAdminPrf);
// router.get("/edit-userProfile/:id", isAuthenticated, editController);
router.get("/edit-userProfile/:id", isAuthenticated, (req, res, next) => {
    console.log("Received request for edit-userProfile with ID:");
    next(); // Calls the next middleware (editController in this case)
}, editController);
router.post("/profile-update/:id",isAuthenticated,(req,res,next) => {
 console.log("update", req);
 next();
},editProfiledata)

module.exports = router;
