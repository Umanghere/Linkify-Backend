const User = require("../models/user");

async function getUserHandler(req, res) {
    const user = req.user;

    const dbUser = await User.findOne({
        email: user.email
    });

    return res.status(200).json({ dbUser });
}

module.exports = { getUserHandler }