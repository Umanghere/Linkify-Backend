const { Router } = require("express");
const { getUserHandler } = require("../../controllers/user");

const router = Router();

router.get("/get", getUserHandler);

module.exports = router;