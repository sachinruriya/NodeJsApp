const secret_key = "GSHHBSBJSB1788";

const jwt = require('jsonwebtoken');

function setUser(user) {
    const token = jwt.sign({ id: user._id, email: user.email, role:user.role },secret_key , { expiresIn: '1h' });
    return token;
}

module.exports = { setUser };

