const { Router } = require("express");
const urlRoutes = require("./url");
const userRoutes = require("./user")
const checkAuth = require("../../middlewares/auth");

const router = Router();

router.use(checkAuth);

router.use("/url", urlRoutes);
router.use("/user", userRoutes);

module.exports = router;