const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/protect");

router.post("/register", userController.create);

router.use(authenticate);

router.get("/getAll", userController.getAll);
router.get("/find/:id", userController.getById);
router.put("/update/:id", userController.update);
router.delete("/delete/:id", userController.delete);

module.exports = router;
