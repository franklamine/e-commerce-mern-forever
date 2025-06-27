

//Add product to user cart
import User from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        const {userId, itemId, size} = req.body;

        const userData = await User.findById(userId);
        let cartData = userData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }else{
                cartData[itemId][size] = 1;
            }
        }else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        await User.findByIdAndUpdate(userId, {cartData},);
        res.json({success:true, message:"Added to cart"});

    }catch (e) {
        res.json({success: false, message: e.message});
    }
}


//Update  user cart
const updateCart = async (req, res) => {
    try {
        const {userId, itemId, size, quantity} = req.body;

        const userData = await User.findById(userId);
        let cartData = userData.cartData;

        cartData[itemId][size] = quantity;

        await User.findByIdAndUpdate(userId, {cartData},);
        res.json({success:true, message:"Cart updated"});

    }catch (e) {
        res.json({success: false, message: e.message});
    }
}


//get user cart data
const getUserCart = async (req, res) => {
    try {

        const userData = await User.findById(req.body.userId);
        let cartData = userData.cartData;

        res.json({success:true, cartData});

    }catch (e) {
        res.json({success: false, message: e.message});
    }
}

export {addToCart, updateCart, getUserCart}