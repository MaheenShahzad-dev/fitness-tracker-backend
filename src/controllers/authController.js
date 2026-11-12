
const user = require('../models/userModel')
const userValidator = require('../validators/userValidator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('../helpers/cloudinary')
const streamifier = require('streamifier')
const uploadToCloudinary=require('../utils/uploadToCloudinary')


exports.register = async (req, res) => {
    try {
        if (!req.file) {
    return res.status(400).json({
        status: 'error',
        message: 'Profile picture is required'
    });
}
        const { email, password } = req.body

        await userValidator.validateAsync(req.body)

        const isUser = await user.findOne({ email })

        if (isUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            })
        }

       let profilePic = '';
let uploadedImage = null;

if (req.file) {
    uploadedImage = await uploadToCloudinary(req.file.buffer);
    profilePic = uploadedImage.secure_url;
}

        const encryptPassword = await bcrypt.hash(password, 12)

        const data = await user.create({
            ...req.body,
            email,
            password: encryptPassword,
            profilePic,
           profilePicPublicId: uploadedImage ? uploadedImage.public_id : ''
        })

        const safeUser = data.toObject()
        delete safeUser.password

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: safeUser
        })

    } catch (e) {
        if (e.isJoi) {
            return res.status(400).json({
                success: false,
                message: e.message
            })
        }

        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

exports.login = async (req, res) => {
    try {

        let isUser = await user.findOne({ email: req.body.email });
        if (!isUser) {

            res.json({"message":"user not found"});
        
        }
     
        let isPassword=await bcrypt.compare(req.body.password,isUser.password);
        if(!isPassword){
               res.json({"message":"incorrect password"});
        }


let token=await jwt.sign({"id":isUser._id},"secure_token",{expiresIn:"2d"});




    res.json({   "status": "success", "user": isUser ,"token":token});

    }


    catch (e) {
        res.status(500).json({ "message": `error ${e.message}` });

    }
}
