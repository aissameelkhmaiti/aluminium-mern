// ROUTES : routes/userRoutes.js
const router = require("express").Router();
const authController = require("../controllers/userController");
const { tryCatch, authorizationAdmin } = require("../middleware/authMiddleware");
const photoUpload = require('../middleware/photoUpload');

// Inscription avec vérification email (image obligatoire)
router.post("/register", photoUpload.single("image"), tryCatch(authController.createAdmin));

// Vérification du compte via token
router.get("/verify/:token", tryCatch(authController.verifyAccount));

// Connexion
router.post("/login", tryCatch(authController.login));

// Autres routes utilisateurs (protégées ou non selon le cas)
router.get("/myprofile", photoUpload.single("image"), authorizationAdmin, tryCatch(authController.getLoggedInUserInfo));
router.get("/", photoUpload.single("image"), tryCatch(authController.getAllUsers));
router.get("/:id", photoUpload.single("image"), tryCatch(authController.getUserById));
router.put("/:id", photoUpload.single("image"), tryCatch(authController.updateUser));
router.delete("/:id", tryCatch(authController.deleteUser));

module.exports = router;
