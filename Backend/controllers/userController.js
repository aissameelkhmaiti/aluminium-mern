// CONTROLLER : controllers/userController.js
// CONTROLLER : controllers/userController.js
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

exports.createAdmin = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email déjà utilisé" });
  }

  // Check if an image is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Aucune image fournie" });
  }

  // Upload image to Cloudinary
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user directly (no verificationToken, no email sending)
  const admin = new User({
    email,
    password: hashedPassword,
    first_name,
    last_name,
    role: role || "admin",
    image: { url: result.secure_url, publicId: result.public_id },
    isVerified: true, // Immediately verified
  });

  const savedAdmin = await admin.save();

  // Delete the image from the local disk
  fs.unlinkSync(imagePath);

  res.status(201).json({
    message: "Admin créé avec succès.",
    user: savedAdmin,
  });
});


exports.verifyAccount = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findOne({ email: decoded.email, verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Compte vérifié avec succès." });
  } catch (error) {
    console.error("Erreur dans verifyAccount:", error);
    res.status(400).json({ message: "Lien de vérification invalide ou expiré." });
  }
});

 

exports.login = async (req, res) => {
  const { body } = req;
  if (!body.email || !body.password)
    throw Error("Fill the all fields to login");
  const login_user = await User.findOne({ email: body.email });
  console.log(login_user);
  if (
    !login_user ||
    !(await bcrypt.compare(body.password, login_user.password))
  ) return res.status(400).json({message:"Email or password is incorrect"}) 

  const token = await jwt.sign({ id: login_user.id }, process.env.TOKEN_KEY);
  res.status(200).json({token});
};

exports.getLoggedInUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getLoggedInUserInfo:', error);
    res.status(500).json({ error: 'Server Error' });
  }
}



 

exports.logout = async (req, res) => {
  storage.clear();
  res.send(true);
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    let updatedData = req.body;

    // Check if a new image is provided
    if (req.file) {
      // Path of the uploaded image
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

      // Upload the new image to Cloudinary
      const result = await cloudinaryUploadImage(imagePath);

      // Update the image data in the object to be updated
      updatedData.image = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      // Remove the image from the local server
      fs.unlinkSync(imagePath);
    }

    const userUpdated = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!userUpdated) {
      return res.status(404).json("User not found");
    }

    res.json(userUpdated);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};