const {getUser}=require("../service/auth")
async function restrickted_login(req,res,next) {
    const token = res.cookies?.uid;
    if(!token){
       return res.redirect("/registeration");
    }
    
    const user= getUser(token)
    if(!user){
        return res.redirect("/registeration")
    }
    req.user = user;
    alert(req.user)
    next();
}
module.exports={restrickted_login};