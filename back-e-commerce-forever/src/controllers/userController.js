import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import err from "multer/lib/multer-error.js";


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "24h"});
}

//Route for login
const loginUser = async (req, res) => {
   try {
       console.log(req.body);
       const { email, password } = req.body;

       const existUser = await User.findOne({ email });

       if (!existUser) {
           return res.json({success: false, message: "User does not exist"});
       }

       const isMatch = await bcrypt.compare(password, existUser.password);

       if (isMatch) {
           const token = createToken(existUser._id);
           return res.json({success: true, token});
       }else {
           return res.json({success: false, message: "Invalid Credentials"});
       }

   }catch(err) {
       res.json({success: false, message: err.message});
   }

}

//Route for user register
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existUser = await User.findOne({email});
        //checking if user exists or not
        if (existUser) {
            return res.json({success: false, message: "User already exists"});
        }
        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter a valid email"});
        }
        if (password.length < 8) {
            return res.json({success: false, message: "Please enter strong password"});
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashPassword});
        const user = await newUser.save();

        const token = createToken(user._id);
        return res.json({success: true, token});

    } catch (err) {
        res.json({success: false, message: err.message});
    }
}


//Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            return res.json({success: true, token});
        }else {
            return res.json({success: false, message: "Invalid Credentials"});
        }
    }catch(err) {
        res.json({success: false, message: err.message});
    }

}

export {loginUser, registerUser, adminLogin};