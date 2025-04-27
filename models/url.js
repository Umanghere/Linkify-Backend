const mongoose = require("mongoose");

const countSchema = new mongoose.Schema({
    count: Number,
}, { timestamps: true })

const urlPartSchema = new mongoose.Schema(
    {
        shortURL: {
            type: String,
            unique: true,
        },
        originalURL: {
            type: String,
        },
        clicks: [countSchema],
        isActive: {
            type: Boolean,
            default: true
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    },
    { timestamps: true },
);

const urlSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        urls: [urlPartSchema],
    },
    { timestamps: true },
);

const URL = mongoose.model("url", urlSchema);
module.exports = URL;
