const User = require("../models/user");

async function signUpHandler(req, res) {
    const { username, email, password } = req.body;

    try {
        const exist = await User.findOne({
            email: email,
        });

        if (exist) {
            return res.status(400).json({ msg: "User Already Exist" });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        return res.status(201).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function loginHandler(req, res) {
    const { email, password } = req.body;

    try {
        const data = await User.matchPassGenToken(email, password);

        if (data.status >= 400) {
            return res.status(data.status).json({ msg: data.msg });
        }

        return res.status(data.status).json({ token: data.token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

module.exports = { signUpHandler, loginHandler };
