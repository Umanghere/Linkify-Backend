const shortid = require("shortid");
const URL = require("../models/url");

async function addURLHandler(req, res) {
    const user = req.user;

    try {
        const { url } = req.body;
        const shortID = shortid.generate();

        const existingUrlEntry = await URL.findOne({
            userId: user.id,
        });

        if (existingUrlEntry) {
            existingUrlEntry.urls = [
                ...existingUrlEntry.urls,
                {
                    shortURL: shortID,
                    originalURL: url,
                },
            ];
            await existingUrlEntry.save();
            return res.status(201).json({ shortID: shortID });
        }

        await URL.create({
            userId: user.id,
            urls: [
                {
                    shortURL: shortID,
                    originalURL: url,
                },
            ],
        });

        return res.status(201).json({ shortID: shortID });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function getURLHandler(req, res) {
    const shortID = req.params.id;

    try {
        const entry = await URL.findOne({
            urls: { $elemMatch: { shortURL: shortID } },
        });

        if (!entry) {
            return res.status(404).json({
                msg: "No Urls Found, Please generate a shortURL first",
            });
        }

        const matchedURL = entry.urls.find((url) => url.shortURL === shortID);

        const date = new Date();
        const urlDate = matchedURL.expiresAt;   

        if (date.toLocaleString() > urlDate.toLocaleString()) {
            return res.status(404).send("<h2>Current URL is not active. Please generate a fresh url</h2>");
        }

        matchedURL.clicks = [...matchedURL.clicks, {
            count: 1
        }]
        await entry.save();

        return res.redirect(matchedURL.originalURL);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function getAllUrls(req, res) {
    const user = req.user;

    try {
        const userWithUrl = await URL.findOne({
            userId: user.id,
        });

        if (!userWithUrl) {
            return res.status(200).json({ urls: [] });
        }

        const urls = userWithUrl.urls;
        const sortedUrls = urls.sort((a, b) => b.createdAt - a.createdAt);
        return res.status(200).json({ urls: sortedUrls });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function deleteUrlHandler(req, res) {
    const user = req.user;
    const id = req.params.id;

    try {
        const userWithUrl = await URL.findOne({
            userId: user.id,
        });

        if (!userWithUrl) {
            return res.status(404).json({ msg: "No urls found" });
        }

        userWithUrl.urls = userWithUrl.urls.filter((url) => url._id != id);
        await userWithUrl.save();

        return res.status(200).json({ msg: "URL deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

module.exports = { addURLHandler, getURLHandler, getAllUrls, deleteUrlHandler };
