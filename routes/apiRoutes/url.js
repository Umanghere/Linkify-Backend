const { Router } = require("express");
const {
    addURLHandler,
    getAllUrls,
    deleteUrlHandler,
} = require("../../controllers/url");

const router = Router();

router.post("/add", addURLHandler);
router.get("/get", getAllUrls);
router.get("/delete/:id", deleteUrlHandler);

module.exports = router;
