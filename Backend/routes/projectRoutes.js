const express = require("express");
const router = express.Router();
const  projectController=  require("../controllers/projectController");

const photoUpload = require("../middleware/photoUpload"); 



router.post("/", photoUpload.array("images", 5), projectController.addProject);
router.get("/",photoUpload.single("image"),projectController.getAllProjects );
router.get("/:id",photoUpload.single("image"), projectController.getProjectById);
router.put("/:id", photoUpload.single("image"), projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.get("/category/:category",photoUpload.single("image"), projectController.getProjectsByCategory);

module.exports = router;
