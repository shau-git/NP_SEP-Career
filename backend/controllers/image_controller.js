const cloudinary = require('cloudinary').v2;
const User = require("../models/user")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Generate Signature (Replaces your Next.js POST route)
const signImage = async (req, res) => {
    try {
        
        const { paramsToSign } = req.body;
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );
        return res.status(200).json({ signature });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to generate signature' });
    }
};


// 2. Save Image URL to DB (Replaces /api/image/uploadimage)
const uploadImageToDb = async (req, res) => {
    try {
        const { newImageUrl, newPublicId } = req.body;
        const payload =req.user
        
        // 1. Find the user's CURRENT image ID before we update it
        const user = await User.findOne({
            where: { user_id: parseInt(payload.user_id) },
            attributes: ['image_public_id', "user_id"]
        });

        // If the user doesn't exist in the DB
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. If an old image exists, delete it from Cloudinary
        if (user?.image_public_id) {
            // We don't await this if we want it to be faster, 
            // but awaiting ensures it's gone before we finish.
            await cloudinary.uploader.destroy(user?.image_public_id);
        }

        // 3. Update the database with the NEW image details
        const updatedUser = await User.update(
            { image: newImageUrl, image_public_id: newPublicId },
            { where: { user_id: parseInt(payload.user_id) }, returning: true }
        );

        res.status(200).json({ 
            message: "Profile picture updated", 
            data: updatedUser[1][0] 
        });
    } catch (error) {
        res.status(500).json({ message: "Image fail to upload" });
    }
};

module.exports = { signImage, uploadImageToDb };