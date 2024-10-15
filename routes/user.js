const express = require("express");
const router = express.Router();
const passport = require('passport');
const {userauthorization} = require("../middlewares/authorization.js")
const {handleHome,handleRegister,redirecthome,displayUser,handleUserLogin, uploadfilefunc,findFriends,findsearchkey,addfriend} = require("../controllers/authController.js")
router.get("/",redirecthome)

router.get("/registeration",handleHome)
router.post("/register",handleRegister)
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    failureMessage: true
}), handleUserLogin);

router.post('/upload-profile/:id',uploadfilefunc);


// Display users, only if authenticated
router.get('/dashboard', isAuthenticated,userauthorization(['admin','user']), displayUser);
router.get('/friends-list',isAuthenticated,userauthorization(['admin','user']),findFriends)
router.get('/search-friends',findsearchkey)
router.post('/add-friend',addfriend)
// Middleware for checking authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/registeration'); // Redirect to login page
        });
    });
});


module.exports=router;