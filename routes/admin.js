const express = require("express");
const router = express.Router();
const passport = require('passport');

const {adminLoginPage,handleadminLogin,displayAdminPrf} = require("../controllers/adminController");
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


module.exports = router;
