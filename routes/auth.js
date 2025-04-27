const { Router } = require("express");
const { signUpHandler, loginHandler } = require("../controllers/auth");

const router = Router();

router.post("/signup", signUpHandler);
router.post("/login", loginHandler);

module.exports = router;
