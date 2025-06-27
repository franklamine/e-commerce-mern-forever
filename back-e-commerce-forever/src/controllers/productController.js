//function for add product
import {v2 as cloudinary} from "cloudinary";
import Product from "../models/productModel.js";
import e from "express";

const addProduct = async (req, res) => {
    try {
        const {name, description, price, category, subCategory, sizes, bestseller} = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined);

        const imagesUrl = await Promise.all(
            images.map(async image => {
                let result = await cloudinary.uploader.upload(image.path, {
                    folder: "forever-products",
                    use_filename: true,
                    unique_filename: false
                });
                return result.secure_url;
            }))

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }
        const newProduct = new Product(productData);
        await newProduct.save();

        res.json({success: true, message: `Product Added Successfully`});
    } catch (e) {
        res.json({success: false, message: e.message});
    }
}

//function for list product
const listProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({success: true, products});
    } catch (e) {
        res.json({success: false, message: e.message});
    }
}

//function for removing product
const removeProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.body.id);
        if (!deletedProduct) {
            return res.json({success: false, message: `Product not Found`});
        } else {
            return res.json({success: true, message: `Product Removed Successfully`});
        }
    } catch (e) {
        res.json({success: false, message: e.message});
    }

}

//function for single product info
const singleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.body.id);
        if (!product) {
            return res.json({success: false, message: "Product not found"});
        } else {
            res.json({success: true, product});
        }
    } catch (e) {
        res.json({success: false, message: e.message});
    }
}

export {addProduct, listProduct, removeProduct, singleProduct}