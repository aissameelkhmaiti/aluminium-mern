const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          alt: { type: String },
        },
      ],
      default: [],
    },
    category: {
      type: String,
      enum: ["Fenêtre", "Porte", "Clôture"],
      required: true,
    },
    clientName: {
      type: String,
      default: "Anonyme",
    },
    location: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["En cours", "Terminé", "Annulé"],
      default: "Terminé",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project; // Exportation du modèle
