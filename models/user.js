const mongoose = require("mongoose");
const { randomBytes, createHmac } = require("node:crypto");
const { generateToken } = require("../service/user");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true },
);

/* Middlewares */
userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPassGenToken", async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
        return {
            status: 404,
            msg: "User Not found",
        };
    }

    const hashedPassword = user.password;
    const salt = user.salt;

    const newHash = createHmac("sha256", salt).update(password).digest("hex");
    

    if (hashedPassword != newHash) {
        return {
            status: 400,
            msg: "Invalid Password",
        };
    }

    const token = generateToken(user);
    return {
        status: 200,
        token: token
    };
});

const User = mongoose.model("user", userSchema);
module.exports = User;
