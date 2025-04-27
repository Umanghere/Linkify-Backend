const JWT = require("jsonwebtoken");

const options = {
    expiresIn: "1h"
}

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
    };

    const token = JWT.sign(payload, process.env.JWT_SECRET, options);
    return token;
}

function decodeToken(token) {
    try {
        const user = JWT.verify(token, process.env.JWT_SECRET); // Verify the token
        return user; // Return decoded user data
    } catch (err) {
        throw new Error(err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token');
    }
}

module.exports = { generateToken, decodeToken };
