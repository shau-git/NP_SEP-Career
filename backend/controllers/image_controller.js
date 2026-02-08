const cloudinary = require('cloudinary').v2;
const User = require("../models/user")
const Company = require("../models/company")
const CompanyMember = require("../models/company_member")
const {NotFoundError, BadRequestError,  ForbiddenError} = require("../errors/errors")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Generate Signature (Replaces your Next.js POST route)
const signImage = async (req, res) => {
    try {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>")
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
const uploadImageToDbUser = async (req, res) => {
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



const uploadImageToDbCompany = async (req, res) => {
    try {
        const { newImageUrl, newPublicId } = req.body;
        let { company_id } = req.params; // Get from URL
        company_id = parseInt(company_id)
        const userId = req.user.user_id;   // Get from Auth payload

        if(!company_id) throw new BadRequestError(`Company Id ${company_id} must be a number`)

        // 1. Authorization: Is this user an admin/owner of THIS specific company?
        const membership = await CompanyMember.findOne({
            where: { 
                company_id, 
                user_id: userId ,
                removed: false
            }
        });

        if (!membership || !['admin', 'owner'].includes(membership.role)) {
            return res.status(403).json({ message: "Unauthorized to update this company profile" });
        }

        // 2. Find the Company record to handle old image deletion
        const company = await Company.findOne({
            where: { company_id },
            attributes: ['image_public_id']
        });

        if (!company) return res.status(404).json({ message: "Company not found" });

        // 3. Delete old image from Cloudinary
        if (company.image_public_id) {
            await cloudinary.uploader.destroy(company.image_public_id);
        }

        // 4. Update Database
        const updated = await Company.update(
            { image: newImageUrl, image_public_id: newPublicId },
            { where: { company_id: company_id }, returning: true }
        );

        res.status(200).json({ 
            message: "Company Profile picture updated!", 
            data: updated[1][0] 
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update company image" });
    }
};


module.exports = { signImage, uploadImageToDbUser , uploadImageToDbCompany};