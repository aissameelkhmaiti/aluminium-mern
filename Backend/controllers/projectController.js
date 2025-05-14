const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

// Create: Ajouter un nouveau projet
exports.addProject = asyncHandler(async (req, res) => {
  try {
    const { category, title, description, location, status, date } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    const images = [];

    // Upload chaque image sur Cloudinary
    for (const file of req.files) {
      const imagePath = path.join(__dirname, `../images/${file.filename}`);
      const result = await cloudinaryUploadImage(imagePath);

      images.push({
        url: result.secure_url,
        publicId: result.public_id,
        alt: file.originalname,
      });
      console.log(file.originalname)

      fs.unlinkSync(imagePath);
    }

    const newProject = new Project({
      category,
      title,
      description,
      location,
      status,
      date,
      image: images, // note: ou images si tu renommes le champ
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Read: Obtenir tous les projets
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read: Obtenir un projet par son ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update: Mettre à jour un projet
exports.updateProject = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    let updatedData = req.body;

    // Vérifier si une nouvelle image est fournie
    if (req.file) {
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
      const result = await cloudinaryUploadImage(imagePath);

      updatedData.media = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      // Supprimer l'ancienne image locale
      fs.unlinkSync(imagePath);
    }

    const { id } = req.params;
    const updatedProject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Delete: Supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.json({ message: "Projet supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read: Obtenir les projets par catégorie
const mongoose = require("mongoose");

exports.getProjectsByCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.params;
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "ID de catégorie invalide" });
    }

    const projects = await Project.find({ category });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
